export type MemorySlice = {
  id: string;
  label: string;
  gb: number;
  tone: "os" | "stt" | "llm" | "kv" | "free";
};

export const MACHINE = {
  name: "Ryzen AI Max+ 395",
  codename: "Strix Halo",
  memoryGb: 128,
  cpu: "16× Zen 5",
  gpu: "Radeon 8060S · 40 CU RDNA 3.5",
  verdict: "Yes. This pipeline is comfortably in budget.",
};

export const FAST_PROFILE: MemorySlice[] = [
  { id: "os", label: "OS + desktop + browser", gb: 16, tone: "os" },
  { id: "stt", label: "whisper.cpp large-v3-turbo", gb: 2, tone: "stt" },
  { id: "llm", label: "Qwen2.5-14B Q5_K_M", gb: 10, tone: "llm" },
  { id: "kv", label: "KV cache + runtime", gb: 4, tone: "kv" },
  { id: "free", label: "Headroom", gb: 96, tone: "free" },
];

export const QUALITY_PROFILE: MemorySlice[] = [
  { id: "os", label: "OS + desktop + browser", gb: 16, tone: "os" },
  { id: "stt", label: "whisper.cpp large-v3", gb: 3, tone: "stt" },
  { id: "llm", label: "Qwen2.5-32B Q5_K_M", gb: 23, tone: "llm" },
  { id: "kv", label: "KV cache 8k", gb: 6, tone: "kv" },
  { id: "free", label: "Headroom", gb: 80, tone: "free" },
];

export const PIPELINE_STAGES = [
  {
    id: "route",
    step: "01",
    title: "Audio routing",
    detail: "Tab audio or mic in. On the 395, a Pulse/PipeWire monitor replaces the virtual cable.",
  },
  {
    id: "vad",
    step: "02",
    title: "VAD & buffer",
    detail: "Energy VAD here; Silero on-device. Drops silence, flushes 2–3 s speech.",
  },
  {
    id: "stt",
    step: "03",
    title: "Transcription",
    detail: "Cloud STT in this HUD. Local: whisper.cpp on the iGPU — Faster-Whisper is CUDA-first.",
  },
  {
    id: "orch",
    step: "04",
    title: "Orchestration",
    detail: "Wraps the Dutch with your interview prompt. One in-flight turn at a time.",
  },
  {
    id: "llm",
    step: "05",
    title: "Interpreter",
    detail: "Grok in the cloud, or Ollama Qwen on the 395. Streams Afrikaans only.",
  },
  {
    id: "hud",
    step: "06",
    title: "Overlay HUD",
    detail: "Frameless caption bar. Pop-out for always-on-top. Desktop wrappers can exclude capture.",
  },
] as const;

export type StageId = (typeof PIPELINE_STAGES)[number]["id"];
