import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/api/cn";

export function LabelSwatch({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-10 w-10 shrink-0 rounded-lg border border-border-strong",
        className,
      )}
      style={{ backgroundColor: color }}
    />
  );
}

export function LabelChip({ color, name }: { color: string; name: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{name}</span>
    </span>
  );
}

export function LabelRowSkeleton() {
  return (
    <div className="cs-row flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-56 max-w-full" />
      </div>
    </div>
  );
}