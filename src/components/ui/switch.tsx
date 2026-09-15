import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
  disabled?: boolean;
};

export function Switch({ checked, onCheckedChange, id, disabled }: Props) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border border-border",
        "bg-bg-elevated transition-colors duration-150",
        "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        "disabled:opacity-40",
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-5 translate-x-0.5 rounded-full bg-muted",
          "transition-transform duration-150 ease-out",
          "data-[state=checked]:translate-x-5 data-[state=checked]:bg-accent-fg",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
