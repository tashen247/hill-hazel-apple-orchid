import { FAST_PROFILE, MACHINE, QUALITY_PROFILE, type MemorySlice } from "@/lib/hardware";
import { cn } from "@/lib/utils";

function Bar({ slices }: { slices: MemorySlice[] }) {
  const total = slices.reduce((a, s) => a + s.gb, 0);
  return (
    <div className="flex h-3 overflow-hidden rounded-full border border-border">
      {slices.map((s) => (
        <div
          key={s.id}
          title={`${s.label} · ${s.gb} GB`}
          style={{ width: `${(s.gb / total) * 100}%` }}
          className={cn(
            s.tone === "os" && "bg-border",
            s.tone === "stt" && "bg-muted",
            s.tone === "llm" && "bg-accent",
            s.tone === "kv" && "bg-wait/80",
            s.tone === "free" && "bg-hot/70",
          )}
        />
      ))}
    </div>
  );
}

function Profile({
  title,
  slices,
}: {
  title: string;
  slices: MemorySlice[];
}) {
  const used = slices.filter((s) => s.tone !== "free").reduce((a, s) => a + s.gb, 0);
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        <p className="font-mono text-xs tabular-nums text-muted">{used} / 128 GB</p>
      </div>
      <Bar slices={slices} />
      <ul className="space-y-1.5">
        {slices.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 text-xs text-muted">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  s.tone === "os" && "bg-border",
                  s.tone === "stt" && "bg-muted",
                  s.tone === "llm" && "bg-accent",
                  s.tone === "kv" && "bg-wait",
                  s.tone === "free" && "bg-hot",
                )}
              />
              {s.label}
            </span>
            <span className="font-mono tabular-nums">{s.gb} GB</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MachineCard() {
  return (
    <section className="rounded-xl border border-border bg-bg-elevated p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-subtle">Machine</p>
      <h2 className="mt-2 font-display text-2xl italic leading-tight text-fg">
        {MACHINE.name}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {MACHINE.codename} · {MACHINE.cpu} · {MACHINE.gpu}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-fg">{MACHINE.verdict}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        128 GB unified memory makes Qwen 14B a rounding error. Faster-Whisper is
        CUDA-first — on this APU use whisper.cpp (Vulkan or ROCm) plus Ollama.
        After speech ends, expect about 1–1.5 s to Afrikaans.
      </p>
      <div className="mt-6 space-y-8">
        <Profile title="Fast HUD · 14B" slices={FAST_PROFILE} />
        <Profile title="Quality HUD · 32B" slices={QUALITY_PROFILE} />
      </div>
    </section>
  );
}
