import { cn } from "@/lib/cn";

interface AdSlotPlaceholderProps {
  label?: string;
  className?: string;
}

export function AdSlotPlaceholder({
  label = "Ad space",
  className,
}: AdSlotPlaceholderProps) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-center",
        "min-h-30 flex items-center justify-center",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
    </aside>
  );
}
