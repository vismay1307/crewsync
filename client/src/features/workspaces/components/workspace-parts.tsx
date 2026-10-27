import { FiGlobe, FiLock } from "react-icons/fi";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/api/cn";

export function WorkspaceAvatar({
  className,
  name,
}: {    
  className?: string;
  name: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "W";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-sm font-semibold text-primary-soft-foreground",
        className,
      )}
    >
      {initial}
    </span>
  );
}

export function VisibilityBadge({
  className,
  visibility,
}: {
  className?: string;
  visibility?: string | null;
}) {
  if (!visibility) return null;

  const Icon = visibility === "private" ? FiLock : FiGlobe;
  const label = visibility.charAt(0).toUpperCase() + visibility.slice(1);

  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-2 text-xs font-medium text-muted",
        className,
      )}
    >
      <Icon aria-hidden="true" size={12} />
      {label}
    </span>
  );
}

export function WorkspaceRowSkeleton() {
  return (
    <div className="cs-row flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}