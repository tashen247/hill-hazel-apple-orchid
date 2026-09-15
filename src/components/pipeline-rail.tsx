import { PIPELINE_STAGES, type StageId } from "@/lib/hardware";
import type { StageState } from "@/lib/store";
import { cn } from "@/lib/utils";

const LABEL: Record<StageState, string> = {
  idle: "Idle",
  ready: "Ready",
  hot: "Live",
  wait: "Wait",
  err: "Error",
};

function Lamp({ state }: { state: StageState }) {
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        state === "idle" && "bg-border",
        state === "ready" && "bg-accent/70",
        state === "hot" && "bg-live lamp-pulse",
        state === "wait" && "bg-wait lamp-pulse",
        state === "err" && "bg-live",
      )}
      aria-hidden="true"
    />
  );
}

type Props = {
  stages: Record<StageId, StageState>;
};

export function PipelineRail({ stages }: Props) {
  return (
    <ol className="flex flex-col gap-1">
      {PIPELINE_STAGES.map((stage, i) => {
        const state = stages[stage.id];
        return (
          <li
            key={stage.id}
            className={cn(
              "rounded-lg border border-transparent px-3 py-3",
              state === "hot" || state === "wait"
                ? "border-border bg-surface"
                : "hover:bg-bg-elevated",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 font-mono text-xs text-subtle tabular-nums">
                {stage.step}
              </span>
              <Lamp state={state} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-fg">{stage.title}</p>
                  <span className="font-mono text-xs uppercase tracking-wider text-subtle">
                    {LABEL[state]}
                  </span>
                </div>
                <p className="mt-1 hidden text-xs leading-snug text-muted lg:block">
                  {stage.detail}
                </p>
              </div>
            </div>
            {i < PIPELINE_STAGES.length - 1 ? (
              <div className="ml-11 mt-2 hidden h-3 w-px bg-border lg:block" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function PipelineStrip({ stages }: Props) {
  return (
    <ol className="flex items-center justify-between gap-1">
      {PIPELINE_STAGES.map((stage) => (
        <li key={stage.id} className="flex flex-col items-center gap-1.5">
          <Lamp state={stages[stage.id]} />
          <span className="font-mono text-xs uppercase tracking-wider text-subtle">
            {stage.step}
          </span>
        </li>
      ))}
    </ol>
  );
}
