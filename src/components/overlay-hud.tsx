import { useEffect, useState } from "react";
import { PictureInPicture2 } from "lucide-react";
import type { HudMode } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  nl: string;
  af: string;
  mode: HudMode;
  live: boolean;
  thinking: boolean;
  onPopOut?: () => void;
  compact?: boolean;
};

function useRevealed(text: string, thinking: boolean) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!text) {
      setShown("");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || thinking) {
      setShown(text);
      return;
    }
    const words = text.split(/\s+/);
    let i = 0;
    setShown("");
    const id = window.setInterval(() => {
      i += 1;
      setShown(words.slice(0, i).join(" "));
      if (i >= words.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [text, thinking]);

  return shown;
}

export function OverlayHud({ nl, af, mode, live, thinking, onPopOut, compact }: Props) {
  const shown = useRevealed(af, thinking);
  const stealth = mode === "stealth";
  const caption = mode === "caption" || stealth;

  return (
    <div
      className={cn(
        "pointer-events-auto relative border border-border bg-bg/95 text-fg shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        caption ? "rounded-lg px-4 py-3" : "rounded-xl px-5 py-3.5",
        stealth && "max-w-md bg-bg",
        compact && "max-w-none",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-1.5 rounded-full bg-border",
              live && "bg-live live-pulse",
              thinking && "bg-wait lamp-pulse",
            )}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-subtle">
            {thinking ? "Tolking" : live ? "Live" : "Fluister"}
          </span>
          <span className="font-mono text-xs text-subtle">NL → AF</span>
        </div>
        {onPopOut && !compact ? (
          <button
            type="button"
            onClick={onPopOut}
            className="inline-flex size-9 items-center justify-center rounded-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-fg"
            aria-label="Pop out overlay"
          >
            <PictureInPicture2 className="size-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {thinking && !af ? (
        <p className="font-display text-xl italic leading-snug text-muted">
          <span className="shimmer bg-clip-text text-transparent">Wag op Afrikaans…</span>
        </p>
      ) : (
        <p
          className={cn(
            "font-display italic leading-snug text-fg",
            stealth ? "text-base md:text-lg" : "text-lg md:text-xl",
          )}
        >
          {shown || "Wag vir Nederlandse spraak."}
        </p>
      )}

      {!stealth && nl ? (
        <p className="mt-3 max-w-prose text-xs leading-relaxed text-muted">{nl}</p>
      ) : null}
    </div>
  );
}
