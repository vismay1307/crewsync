import { FiFlag } from "react-icons/fi";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/api/cn";
import type {
  Label,
  TaskPriority,
  TaskStatus,
  User,
} from "@/types/entities";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const badgeBase =
  "inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 text-xs font-medium";

const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: "border-border bg-surface text-muted",
  in_progress:
    "border-primary/30 bg-primary-soft text-primary-soft-foreground",
  review: "border-warning/30 bg-warning/10 text-warning",
  done: "border-success/30 bg-success/10 text-success",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "border-border bg-surface text-muted",
  medium: "border-border bg-surface text-foreground",
  high: "border-warning/30 bg-warning/10 text-warning",
  critical: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function TaskStatusBadge({
  className,
  status,
}: {
  className?: string;
  status: TaskStatus;
}) {
  return (
    <span
      className={cn(
        badgeBase,
        STATUS_STYLES[status] ?? STATUS_STYLES.todo,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current"
      />
      {TASK_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function TaskPriorityBadge({
  className,
  priority,
}: {
  className?: string;
  priority: TaskPriority;
}) {
  return (
    <span
      className={cn(
        badgeBase,
        PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium,
        className,
      )}
    >
      <FiFlag aria-hidden="true" size={11} />
      {TASK_PRIORITY_LABEL[priority] ?? priority}
    </span>
  );
}

export function TaskOverdueBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        badgeBase,
        "border-destructive/30 bg-destructive/10 text-destructive",
        className,
      )}
    >
      Overdue
    </span>
  );
}

export function TaskArchivedBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        badgeBase,
        "border-border bg-surface text-muted",
        className,
      )}
    >
      Archived
    </span>
  );
}

/** Returns a display name only when the API sends a populated user object. */
export function getUserName(
  user?: string | User | null,
): string | null {
  if (!user || typeof user === "string") return null;

  return `${user.firstName} ${user.lastName}`.trim() || null;
}

/**
 * Task due dates are date-only values, so format them in UTC
 * to avoid shifting a day across time zones.
 */
export function formatTaskDate(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

/** Display label chips only when populated label objects are available. */
export function TaskLabelChips({
  labels,
  max = 3,
}: {
  labels?: Array<string | Label>;
  max?: number;
}) {
  const resolved = (labels ?? []).filter(
    (label): label is Label => typeof label !== "string",
  );

  if (resolved.length === 0) return null;

  const shown = resolved.slice(0, max);
  const extra = resolved.length - shown.length;

  return (
    <>
      {shown.map((label) => (
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted"
          key={label._id}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: label.color }}
          />
          {label.name}
        </span>
      ))}

      {extra > 0 ? (
        <span className="text-xs text-muted">+{extra}</span>
      ) : null}
    </>
  );
}

export function TaskRowSkeleton() {
  return (
    <div className="cs-row flex flex-wrap items-center gap-4 p-4">
      <div className="min-w-0 flex-1 basis-64 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}