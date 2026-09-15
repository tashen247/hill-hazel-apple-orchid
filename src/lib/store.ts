import { create } from "zustand";
import { getAiStatus, transcribeChunk, translateTurn } from "@/lib/ai";
import { startCapture, stopCapture, type VadConfig } from "@/lib/audio";
import { REHEARSAL } from "@/lib/rehearsal";
import { uid } from "@/lib/utils";
import type { StageId } from "@/lib/hardware";

export type StageState = "idle" | "ready" | "hot" | "wait" | "err";
export type Engine = "cloud" | "ollama";
export type HudMode = "studio" | "caption" | "stealth";
export type RunMode = "idle" | "rehearsal" | "live";
export type FeedKind = "mic" | "display" | null;

export type Turn = {
  id: string;
  nl: string;
  af: string;
  at: number;
  ms: number;
  source: "mic" | "rehearsal" | "type";
};

type Stages = Record<StageId, StageState>;

const IDLE_STAGES: Stages = {
  route: "idle",
  vad: "idle",
  stt: "idle",
  orch: "idle",
  llm: "idle",
  hud: "idle",
};

const SETTINGS_KEY = "fluister-settings";

export type Settings = {
  engine: Engine;
  ollamaUrl: string;
  ollamaModel: string;
  context: string;
  hudMode: HudMode;
  chunkMs: 2000 | 2500 | 3000;
  vad: "low" | "med" | "high";
};

const DEFAULT_SETTINGS: Settings = {
  engine: "cloud",
  ollamaUrl: "http://127.0.0.1:11434",
  ollamaModel: "qwen2.5:14b",
  context:
    "Technical interview. Candidate is targeting AMD Ryzen AI Max hardware. Keep product names.",
  hudMode: "studio",
  chunkMs: 2500,
  vad: "med",
};

const VAD_THRESH: Record<Settings["vad"], number> = {
  low: 0.01,
  med: 0.018,
  high: 0.03,
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type FluisterState = Settings & {
  hydrated: boolean;
  aiAvailable: boolean;
  run: RunMode;
  feed: FeedKind;
  feedStream: MediaStream | null;
  stages: Stages;
  level: number;
  speaking: boolean;
  currentNl: string;
  currentAf: string;
  turns: Turn[];
  lastMs: number;
  error: string | null;
  translating: boolean;
  pipOpen: boolean;
  typed: string;
  hydrate: () => void;
  probeAi: () => Promise<void>;
  patch: (partial: Partial<Settings>) => void;
  setTyped: (v: string) => void;
  setPipOpen: (v: boolean) => void;
  startRehearsal: () => Promise<void>;
  arm: (kind: "mic" | "display") => Promise<void>;
  disarm: () => void;
  stopAll: () => void;
  submitTyped: () => Promise<void>;
};

function vadConfig(s: Settings): VadConfig {
  return {
    threshold: VAD_THRESH[s.vad],
    minMs: 700,
    maxMs: s.chunkMs,
    hangoverMs: 420,
  };
}

async function translateOllama(dutch: string, settings: Settings) {
  const res = await fetch(`${settings.ollamaUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: settings.ollamaModel,
      temperature: 0.2,
      max_tokens: 180,
      messages: [
        {
          role: "system",
          content:
            "Translate Dutch interview speech into natural spoken Afrikaans. Output only the Afrikaans.",
        },
        {
          role: "user",
          content: settings.context
            ? `Candidate context: ${settings.context}\n\nDutch:\n${dutch}`
            : dutch,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty Ollama reply");
  return text;
}

async function interpret(dutch: string, get: () => FluisterState) {
  const s = get();
  if (s.engine === "ollama") {
    try {
      return await translateOllama(dutch, s);
    } catch {
      /* fall through to cloud */
    }
  }
  const res = await translateTurn({ data: { dutch, context: s.context } });
  if (!res.ok) throw new Error(res.error);
  return res.text;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useFluister = create<FluisterState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,
  aiAvailable: false,
  run: "idle",
  feed: null,
  feedStream: null,
  stages: { ...IDLE_STAGES },
  level: 0,
  speaking: false,
  currentNl: "",
  currentAf: "",
  turns: [],
  lastMs: 0,
  error: null,
  translating: false,
  pipOpen: false,
  typed: "",

  hydrate: () => {
    if (get().hydrated) return;
    set({ ...loadSettings(), hydrated: true });
  },

  probeAi: async () => {
    try {
      const { available } = await getAiStatus();
      set({ aiAvailable: available });
    } catch {
      set({ aiAvailable: false });
    }
  },

  patch: (partial) => {
    set(partial);
    const s = get();
    const next: Settings = {
      engine: s.engine,
      ollamaUrl: s.ollamaUrl,
      ollamaModel: s.ollamaModel,
      context: s.context,
      hudMode: s.hudMode,
      chunkMs: s.chunkMs,
      vad: s.vad,
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  },

  setTyped: (typed) => set({ typed }),
  setPipOpen: (pipOpen) => set({ pipOpen }),

  startRehearsal: async () => {
    if (get().run !== "idle") return;
    set({
      run: "rehearsal",
      error: null,
      currentNl: "",
      currentAf: "",
      turns: [],
      stages: { ...IDLE_STAGES, route: "ready", hud: "ready" },
    });

    for (const beat of REHEARSAL) {
      if (get().run !== "rehearsal") return;
      set({
        speaking: true,
        stages: {
          route: "ready",
          vad: "hot",
          stt: "idle",
          orch: "idle",
          llm: "idle",
          hud: "ready",
        },
        currentNl: "",
        currentAf: "",
      });
      await sleep(480);
      if (get().run !== "rehearsal") return;
      set({ stages: { ...get().stages, vad: "wait", stt: "hot" }, speaking: false });
      await sleep(320);
      if (get().run !== "rehearsal") return;
      set({
        currentNl: beat.nl,
        stages: { ...get().stages, stt: "ready", orch: "hot" },
      });
      await sleep(180);
      if (get().run !== "rehearsal") return;
      set({ stages: { ...get().stages, orch: "ready", llm: "wait" }, translating: true });
      const t0 = performance.now();
      let af = beat.afFallback;
      try {
        af = await interpret(beat.nl, get);
      } catch {
        af = beat.afFallback;
      }
      if (get().run !== "rehearsal") return;
      const ms = Math.round(performance.now() - t0);
      set({
        currentAf: af,
        translating: false,
        lastMs: ms,
        stages: { ...get().stages, llm: "ready", hud: "hot" },
        turns: [
          ...get().turns,
          { id: uid(), nl: beat.nl, af, at: Date.now(), ms, source: "rehearsal" },
        ],
      });
      await sleep(2200);
    }

    if (get().run === "rehearsal") {
      set({
        run: "idle",
        speaking: false,
        translating: false,
        stages: { ...IDLE_STAGES, hud: "ready" },
      });
    }
  },

  arm: async (kind) => {
    if (get().run === "rehearsal") return;
    get().disarm();
    set({ error: null, run: "live", feed: kind, stages: { ...IDLE_STAGES, route: "wait" } });
    await startCapture(kind, vadConfig(get()), {
      onStream: (stream, k) => {
        set({
          feedStream: stream,
          feed: k,
          stages: { ...get().stages, route: "ready", vad: "ready", hud: "ready" },
        });
      },
      onLevel: (rms, speaking) => {
        const prev = get();
        const vad: StageState = speaking ? "hot" : prev.feed ? "ready" : "idle";
        if (prev.speaking === speaking && prev.stages.vad === vad) return;
        set({ level: rms, speaking, stages: { ...prev.stages, vad } });
      },
      onChunk: (wavBase64) => {
        void (async () => {
          if (get().translating) return;
          set({
            translating: true,
            stages: { ...get().stages, stt: "hot", orch: "wait" },
            error: null,
          });
          const t0 = performance.now();
          try {
            const stt = await transcribeChunk({ data: { wavBase64 } });
            if (!stt.ok) throw new Error(stt.error);
            const dutch = stt.text.trim();
            if (!dutch) {
              set({
                translating: false,
                stages: { ...get().stages, stt: "ready", orch: "idle" },
              });
              return;
            }
            if (get().run !== "live") return;
            set({
              currentNl: dutch,
              currentAf: "",
              stages: { ...get().stages, stt: "ready", orch: "hot", llm: "wait" },
            });
            const af = await interpret(dutch, get);
            if (get().run !== "live") return;
            const ms = Math.round(performance.now() - t0);
            set({
              currentAf: af,
              translating: false,
              lastMs: ms,
              stages: { ...get().stages, orch: "ready", llm: "ready", hud: "hot" },
              turns: [
                ...get().turns,
                { id: uid(), nl: dutch, af, at: Date.now(), ms, source: "mic" },
              ],
            });
          } catch (err) {
            set({
              translating: false,
              error: err instanceof Error ? err.message : "Pipeline failed",
              stages: { ...get().stages, stt: "err", llm: "err" },
            });
          }
        })();
      },
      onStop: () => get().disarm(),
      onError: (message) => {
        set({
          error: message,
          run: "idle",
          feed: null,
          feedStream: null,
          stages: { ...IDLE_STAGES },
        });
      },
    });
  },

  disarm: () => {
    stopCapture();
    const stream = get().feedStream;
    stream?.getTracks().forEach((t) => t.stop());
    if (get().run === "live") {
      set({
        run: "idle",
        feed: null,
        feedStream: null,
        speaking: false,
        level: 0,
        stages: { ...IDLE_STAGES, hud: get().currentAf ? "ready" : "idle" },
      });
    }
  },

  stopAll: () => {
    stopCapture();
    const stream = get().feedStream;
    stream?.getTracks().forEach((t) => t.stop());
    set({
      run: "idle",
      feed: null,
      feedStream: null,
      speaking: false,
      level: 0,
      translating: false,
      stages: { ...IDLE_STAGES, hud: get().currentAf ? "ready" : "idle" },
    });
  },

  submitTyped: async () => {
    const dutch = get().typed.trim();
    if (!dutch || get().translating) return;
    set({
      translating: true,
      currentNl: dutch,
      error: null,
      stages: {
        route: "ready",
        vad: "ready",
        stt: "ready",
        orch: "hot",
        llm: "wait",
        hud: "ready",
      },
    });
    const t0 = performance.now();
    try {
      const af = await interpret(dutch, get);
      const ms = Math.round(performance.now() - t0);
      set({
        currentAf: af,
        translating: false,
        typed: "",
        lastMs: ms,
        stages: { ...get().stages, orch: "ready", llm: "ready", hud: "hot" },
        turns: [
          ...get().turns,
          { id: uid(), nl: dutch, af, at: Date.now(), ms, source: "type" },
        ],
      });
    } catch (err) {
      set({
        translating: false,
        error: err instanceof Error ? err.message : "Translation failed",
        stages: { ...get().stages, llm: "err" },
      });
    }
  },
}));
