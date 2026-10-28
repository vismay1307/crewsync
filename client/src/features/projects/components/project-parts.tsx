import { FiFolder } from "react-icons/fi";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/api/cn";
import type { ProjectStatus } from "@/types/entities";

export function ProjectAvatar({
  className,
  emoji,
  muted = false,
  size = "md",
}: {
  className?: string;
  emoji?: string;
  muted?: boolean;
  size?: "md" | "lg";
}) {
  const symbol = emoji?.trim();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center bg-primary-soft text-primary-soft-foreground",
        size === "lg"
          ? "h-14 w-14 rounded-xl text-2xl"
          : "h-10 w-10 rounded-lg text-lg",
        muted && "opacity-60",
        className,
      )}
    >
      {symbol ? (
        <span className="leading-none">{symbol}</span>
      ) : (
        <FiFolder size={size === "lg" ? 22 : 18} />
      )}
    </span>
  );
}

const STATUS_STYLES: Record<
  ProjectStatus,
  { className: string; label: string }
> = {
  active: {
    className: "border-success/30 bg-success/10 text-success",
    label: "Active",
  },
  archived: {
    className: "border-border bg-surface text-muted",
    label: "Archived",
  },
};

export function ProjectStatusBadge({
  className,
  status,
}: {
  className?: string;
  status: ProjectStatus;
}) {
  const style = STATUS_STYLES[status];

  if (!style) return null;

  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full border px-2 text-xs font-medium",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}

export function ProjectRowSkeleton() {
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