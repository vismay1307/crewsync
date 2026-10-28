import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/api/cn";
import { formatDate } from "@/lib/api/format";
import type { WorkspaceInvitation } from "@/types/entities";

type InvitationStatus = WorkspaceInvitation["status"];

const STATUS_STYLES: Record<
  InvitationStatus,
  { className: string; label: string }
> = {
  pending: {
    className: "border-warning/30 bg-warning/10 text-warning",
    label: "Pending",
  },
  accepted: {
    className: "border-success/30 bg-success/10 text-success",
    label: "Accepted",
  },
  rejected: {
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    label: "Rejected",
  },
  cancelled: {
    className: "border-border bg-surface text-muted",
    label: "Cancelled",
  },
  expired: {
    className: "border-border bg-surface text-muted",
    label: "Expired",
  },
};

export function InvitationStatusBadge({
  className,
  status,
}: {
  className?: string;
  status: InvitationStatus;
}) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2 text-xs font-medium",
        style?.className ?? "border-border bg-surface text-muted",
        className,
      )}
    >
      {style?.label ?? status}
    </span>
  );
}

function withDate(prefix: string, value?: string) {
  const date = formatDate(value);
  return date ? `${prefix} ${date}` : prefix;
}

/** One short line describing where an invitation stands, from its real date fields. */
export function getInvitationTimeline(
  invitation: Pick<
    WorkspaceInvitation,
    "acceptedAt" | "cancelledAt" | "expiresAt" | "rejectedAt" | "status"
  >,
): string {
  switch (invitation.status) {
    case "pending":
      return withDate("Expires", invitation.expiresAt);
    case "accepted":
      return withDate("Accepted", invitation.acceptedAt);
    case "rejected":
      return withDate("Rejected", invitation.rejectedAt);
    case "cancelled":
      return withDate("Cancelled", invitation.cancelledAt);
    case "expired":
      return withDate("Expired", invitation.expiresAt);
    default:
      return "";
  }
}

export function InvitationRowSkeleton() {
  return (
    <div className="cs-row flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}