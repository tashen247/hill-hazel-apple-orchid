import { useEffect, useRef, type ReactNode } from "react";
import { OverlayHud } from "@/components/overlay-hud";
import type { HudMode } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  nl: string;
  af: string;
  mode: HudMode;
  live: boolean;
  thinking: boolean;
  speaking: boolean;
  feedStream: MediaStream | null;
  onPopOut?: () => void;
};

function Tile({
  label,
  tag,
  live,
  children,
}: {
  label: string;
  tag: string;
  live?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative min-h-40 overflow-hidden rounded-lg border border-border bg-bg-elevated md:min-h-64",
        live && "ring-1 ring-live/50",
      )}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 tile-vignette" />
      <div className="absolute left-3 top-3 flex items-center gap-2">
        {live ? <span className="size-1.5 rounded-full bg-live live-pulse" /> : null}
        <span className="font-mono text-xs uppercase tracking-wider text-muted">{tag}</span>
        <span className="text-sm text-fg">{label}</span>
      </div>
    </div>
  );
}

function Face({ initials, active }: { initials: string; active?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className={cn(
          "grid size-20 place-items-center rounded-full border border-border bg-surface font-display text-2xl text-muted",
          active && "border-live/40 text-fg",
        )}
      >
        {initials}
      </div>
    </div>
  );
}

function VideoFill({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    void el.play().catch(() => {});
    return () => {
      el.srcObject = null;
    };
  }, [stream]);
  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      muted
      playsInline
      autoPlay
    />
  );
}

export function CallStage({
  nl,
  af,
  mode,
  live,
  thinking,
  speaking,
  feedStream,
  onPopOut,
}: Props) {
  const hasVideo = Boolean(feedStream?.getVideoTracks().length);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg-elevated p-2 md:p-3">
      <div className="grid grid-cols-2 gap-2">
        <Tile label="Onderhoudvoerder" tag="System" live={speaking || live}>
          {hasVideo && feedStream ? (
            <VideoFill stream={feedStream} />
          ) : (
            <Face initials="NL" active={speaking} />
          )}
        </Tile>
        <Tile label="Jy" tag="Mic">
          <Face initials="AF" />
        </Tile>
      </div>

      <div className="relative z-10 mt-2 md:pointer-events-none md:absolute md:inset-x-5 md:bottom-3 md:mt-0">
        <OverlayHud
          nl={nl}
          af={af}
          mode={mode}
          live={live}
          thinking={thinking}
          onPopOut={onPopOut}
        />
      </div>
    </div>
  );
}
