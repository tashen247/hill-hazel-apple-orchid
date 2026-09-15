import { useEffect, useRef, useState } from "react";
import { getAnalyser } from "@/lib/audio";
import { cn } from "@/lib/utils";

const BINS = 40;

type Props = {
  level: number;
  speaking: boolean;
  active: boolean;
};

export function Waveform({ level, speaking, active }: Props) {
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: BINS }, () => 0.08));
  const mockRef = useRef<number[]>(Array.from({ length: BINS }, () => 0.08));

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;

    let last = 0;
    const tick = (now: number) => {
      if (now - last < 50) {
        if (!reduced && alive) raf = requestAnimationFrame(tick);
        return;
      }
      last = now;
      const analyser = getAnalyser();
      const next = new Array<number>(BINS);
      if (analyser && active) {
        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);
        const step = Math.floor(data.length / BINS);
        for (let i = 0; i < BINS; i++) {
          const v = data[i * step] ?? 128;
          next[i] = Math.min(1, Math.abs(v - 128) / 48);
        }
      } else {
        const mock = mockRef.current;
        for (let i = 0; i < BINS; i++) {
          const shape = 0.35 + ((i * 17) % 10) / 18;
          const target = speaking
            ? (0.26 + Math.min(0.35, level * 8)) * shape
            : active
              ? 0.1 * shape
              : 0.08;
          mock[i] = (mock[i] ?? 0.08) * 0.82 + target * 0.18;
          next[i] = mock[i] ?? 0.08;
        }
      }
      if (alive) setBars(next);
      if (!reduced && alive) raf = requestAnimationFrame(tick);
    };

    tick(performance.now());
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [active, level, speaking]);

  return (
    <div className="flex h-12 w-full items-center gap-0.5" aria-hidden="true">
      {bars.map((mag, i) => (
        <span
          key={i}
          className={cn(
            "inline-block w-full rounded-full origin-center",
            mag > 0.16 ? (speaking ? "bg-live" : "bg-accent") : "bg-border",
          )}
          style={{ height: `${Math.max(20, mag * 100)}%`, opacity: mag > 0.16 ? 0.95 : 0.75 }}
        />
      ))}
    </div>
  );
}
