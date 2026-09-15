import { useEffect, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CallStage } from "@/components/call-stage";
import { MachineCard } from "@/components/machine-card";
import { OverlayHud } from "@/components/overlay-hud";
import { PipelineRail, PipelineStrip } from "@/components/pipeline-rail";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Waveform } from "@/components/waveform";
import { useFluister, type HudMode } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MonitorUp, Mic, Square } from "lucide-react";

const HUD_MODES: { id: HudMode; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "caption", label: "Caption" },
  { id: "stealth", label: "Stealth" },
];

async function openPip() {
  const docPip = (
    window as unknown as {
      documentPictureInPicture?: {
        requestWindow: (o?: { width?: number; height?: number }) => Promise<Window>;
      };
    }
  ).documentPictureInPicture;
  if (!docPip) throw new Error("Pop-out needs a Chromium browser");

  const pip = await docPip.requestWindow({ width: 480, height: 200 });
  pip.document.documentElement.classList.add("dark");
  pip.document.body.style.margin = "0";
  pip.document.body.style.background = "#0c0c0b";
  pip.document.body.style.color = "#f2efe9";

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (sheet.href) {
        const link = pip.document.createElement("link");
        link.rel = "stylesheet";
        link.href = sheet.href;
        pip.document.head.append(link);
      } else {
        const style = pip.document.createElement("style");
        style.textContent = Array.from(sheet.cssRules)
          .map((r) => r.cssText)
          .join("\n");
        pip.document.head.append(style);
      }
    } catch {
      /* cross-origin sheet */
    }
  }

  const mount = pip.document.createElement("div");
  mount.id = "fluister-pip";
  mount.style.padding = "12px";
  pip.document.body.append(mount);
  return { pip, mount };
}

export function Studio() {
  const s = useFluister();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pipError, setPipError] = useState<string | null>(null);

  useEffect(() => {
    s.hydrate();
    void s.probeAi();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const armed = s.run === "live";
  const rehearsing = s.run === "rehearsal";
  const busy = s.run !== "idle";

  const popOut = async () => {
    setPipError(null);
    try {
      const { pip, mount } = await openPip();
      s.setPipOpen(true);
      const root: Root = createRoot(mount);
      let last = "";
      const paint = () => {
        const st = useFluister.getState();
        const key = `${st.currentNl}|${st.currentAf}|${st.hudMode}|${st.translating}|${st.run}|${st.speaking}`;
        if (key === last) return;
        last = key;
        root.render(
          <OverlayHud
            nl={st.currentNl}
            af={st.currentAf}
            mode={st.hudMode}
            live={st.run === "live" || st.speaking}
            thinking={st.translating}
            compact
          />,
        );
      };
      paint();
      const unsub = useFluister.subscribe(paint);
      pip.addEventListener("pagehide", () => {
        unsub();
        root.unmount();
        s.setPipOpen(false);
      });
    } catch (err) {
      setPipError(err instanceof Error ? err.message : "Pop-out failed");
    }
  };

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="rise flex items-end justify-between gap-4 px-4 pb-4 pt-6 md:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-subtle">
            Private interpreter
          </p>
          <h1 className="mt-1 font-sans text-3xl font-medium tracking-tight md:text-4xl">
            Fluister
          </h1>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-subtle">Engine</p>
            <p className="text-sm text-fg">
              {s.engine === "ollama" ? s.ollamaModel : s.aiAvailable ? "Grok 4.5" : "Offline fallback"}
            </p>
          </div>
          <span
            className={cn(
              "size-2 rounded-full",
              s.aiAvailable || s.engine === "ollama" ? "bg-hot" : "bg-border",
            )}
          />
        </div>
      </header>

      <div className="grid gap-6 px-4 pb-16 md:px-8 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)_minmax(16rem,22rem)]">
        <aside className="rise rise-2 hidden rounded-xl border border-border bg-bg-elevated p-3 xl:block">
          <p className="px-3 pb-2 pt-2 font-mono text-xs uppercase tracking-wider text-subtle">
            Pipeline
          </p>
          <PipelineRail stages={s.stages} />
        </aside>

        <main className="rise rise-3 min-w-0 space-y-4">
          <div className="rounded-xl border border-border bg-bg-elevated px-4 py-3 xl:hidden">
            <PipelineStrip stages={s.stages} />
          </div>

          <CallStage
            nl={s.currentNl}
            af={s.currentAf}
            mode={s.hudMode}
            live={armed || rehearsing}
            thinking={s.translating}
            speaking={s.speaking}
            feedStream={s.feedStream}
            onPopOut={() => void popOut()}
          />

          <div className="rounded-xl border border-border bg-bg-elevated px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wider text-subtle">Feed</p>
              <p className="font-mono text-xs tabular-nums text-muted">
                {s.lastMs ? `${s.lastMs} ms` : "—"}
              </p>
            </div>
            <Waveform level={s.level} speaking={s.speaking} active={armed || rehearsing} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {busy ? (
              <Button variant="live" className="flex-1" onClick={() => s.stopAll()}>
                <Square className="size-4" strokeWidth={1.75} />
                Stop
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => void s.startRehearsal()}>
                Run rehearsal
              </Button>
            )}
            <Button
              variant="secondary"
              className="flex-1"
              disabled={rehearsing}
              onClick={() => void (armed ? s.disarm() : s.arm("mic"))}
            >
              <Mic className="size-4" strokeWidth={1.75} />
              {armed && s.feed === "mic" ? "Disarm mic" : "Arm microphone"}
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              disabled={rehearsing}
              onClick={() => void (armed && s.feed === "display" ? s.disarm() : s.arm("display"))}
            >
              <MonitorUp className="size-4" strokeWidth={1.75} />
              Capture call
            </Button>
          </div>

          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void s.submitTyped();
            }}
          >
            <label className="sr-only" htmlFor="typed-nl">
              Dutch to translate
            </label>
            <input
              id="typed-nl"
              value={s.typed}
              onChange={(e) => s.setTyped(e.target.value)}
              placeholder="Plak Nederlandse teks…"
              className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            />
            <Button type="submit" variant="secondary" disabled={!s.typed.trim() || s.translating}>
              Translate
            </Button>
          </form>

          {s.error || pipError ? (
            <p className="text-sm text-live">{s.error ?? pipError}</p>
          ) : null}

          <TurnLog turns={s.turns} />
        </main>

        <aside className="rise rise-4 space-y-4">
          <section className="rounded-xl border border-border bg-bg-elevated p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-subtle">HUD</p>
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-md border border-border bg-bg p-1">
              {HUD_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => s.patch({ hudMode: m.id })}
                  className={cn(
                    "h-10 rounded-sm text-sm transition-colors duration-150",
                    s.hudMode === m.id ? "bg-surface text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Local Ollama</p>
                <p className="text-xs text-muted">Qwen on the 395. Cloud is the default.</p>
              </div>
              <Switch
                checked={s.engine === "ollama"}
                onCheckedChange={(v) => s.patch({ engine: v ? "ollama" : "cloud" })}
              />
            </div>

            <button
              type="button"
              className="mt-4 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
              onClick={() => setSettingsOpen((v) => !v)}
            >
              {settingsOpen ? "Hide setup" : "Interview setup"}
            </button>

            {settingsOpen ? (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                <Field label="Chunk">
                  <div className="grid grid-cols-3 gap-1">
                    {([2000, 2500, 3000] as const).map((ms) => (
                      <button
                        key={ms}
                        type="button"
                        onClick={() => s.patch({ chunkMs: ms })}
                        className={cn(
                          "h-10 rounded-sm border text-sm",
                          s.chunkMs === ms
                            ? "border-accent bg-surface text-fg"
                            : "border-border text-muted",
                        )}
                      >
                        {ms / 1000}s
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="VAD">
                  <div className="grid grid-cols-3 gap-1">
                    {(["low", "med", "high"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => s.patch({ vad: v })}
                        className={cn(
                          "h-10 rounded-sm border text-sm capitalize",
                          s.vad === v
                            ? "border-accent bg-surface text-fg"
                            : "border-border text-muted",
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Ollama URL">
                  <input
                    value={s.ollamaUrl}
                    onChange={(e) => s.patch({ ollamaUrl: e.target.value })}
                    className="h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm"
                  />
                </Field>
                <Field label="Model">
                  <input
                    value={s.ollamaModel}
                    onChange={(e) => s.patch({ ollamaModel: e.target.value })}
                    className="h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm"
                  />
                </Field>
                <Field label="Interview context">
                  <textarea
                    value={s.context}
                    onChange={(e) => s.patch({ context: e.target.value })}
                    rows={4}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm leading-relaxed"
                  />
                </Field>
                <p className="text-xs leading-relaxed text-subtle">
                  Stealth shrinks the caption. True share-exclusion needs a desktop
                  wrapper with content protection. Document PiP floats the HUD
                  above the call in Chromium.
                </p>
              </div>
            ) : null}
          </section>

          <MachineCard />
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function TurnLog({
  turns,
}: {
  turns: { id: string; nl: string; af: string; ms: number }[];
}) {
  if (turns.length === 0) {
    return (
      <p className="text-sm text-muted">
        Run a Dutch rehearsal, arm the mic, or paste a line. Afrikaans lands in the
        overlay.
      </p>
    );
  }
  return (
    <ol className="space-y-3">
      {turns
        .slice()
        .reverse()
        .map((t) => (
          <li key={t.id} className="rounded-lg border border-border bg-bg-elevated px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-lg italic leading-snug">{t.af}</p>
              <span className="shrink-0 font-mono text-xs tabular-nums text-subtle">{t.ms} ms</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{t.nl}</p>
          </li>
        ))}
    </ol>
  );
}
