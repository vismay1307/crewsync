import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/api/cn";
import type { User, WorkspaceRole } from "@/types/entities";

export const ROLE_LABEL: Record<WorkspaceRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const ROLE_STYLES: Record<WorkspaceRole, string> = {
  owner: "border-primary/30 bg-primary-soft text-primary-soft-foreground",
  admin: "border-border bg-surface text-foreground",
  member: "border-border bg-surface text-muted",
};

const badgeBase =
  "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2 text-xs font-medium";

export function memberName(user: string | User) {
  if (typeof user === "string") return user;
  return `${user.firstName} ${user.lastName}`;
}

export function memberEmail(user: string | User) {
  return typeof user === "string" ? "" : user.email;
}

function initialsOf(user: string | User) {
  if (typeof user === "string") return "U";

  return (
    [user.firstName, user.lastName]
      .map((part) => part?.charAt(0) ?? "")
      .join("")
      .toUpperCase() || "U"
  );
}

export function MemberAvatar({
  className,
  user,
}: {
  className?: string;
  user: string | User;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary-soft-foreground",
        className,
      )}
    >
      {initialsOf(user)}
    </span>
  );
}

export function RoleBadge({
  className,
  role,
}: {
  className?: string;
  role: WorkspaceRole;
}) {
  return (
    <span className={cn(badgeBase, ROLE_STYLES[role] ?? ROLE_STYLES.member, className)}>
      {ROLE_LABEL[role] ?? role}
    </span>
  );
}

export function PendingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        badgeBase,
        "border-warning/30 bg-warning/10 text-warning",
        className,
      )}
    >
      Pending
    </span>
  );
}

export function MemberRowSkeleton() {
  return (
    <div className="cs-row flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56 max-w-full" />
      </div>
      <Skeleton className="h-9 w-36" />
    </div>
  );
}