"use client";

import { FiCheck } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotificationActions,
  useNotificationsQuery,
} from "@/features/notifications/hooks/use-notification-queries";
import { cn } from "@/lib/api/cn";
import { formatDateTime, humanizeKey } from "@/lib/api/format";
import type { User, Workspace } from "@/types/entities";

function actorName(actor?: string | User) {
  if (!actor || typeof actor === "string") return "System";
  return `${actor.firstName} ${actor.lastName}`;
}

function workspaceName(workspace?: string | Workspace) {
  if (!workspace || typeof workspace === "string") return "";
  return workspace.name;
}

function NotificationSkeleton() {
  return (
    <Card aria-busy="true" variant="list">
      {[0, 1, 2].map((index) => (
        <div className="cs-row flex items-center gap-3 p-4" key={index}>
          <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
        </div>
      ))}
      <span className="sr-only" role="status">
        Loading notifications
      </span>
    </Card>
  );
}

export function NotificationList() {
  const notificationsQuery = useNotificationsQuery({ limit: 50 });
  const actions = useNotificationActions();

  if (notificationsQuery.isPending) {
    return <NotificationSkeleton />;
  }

  if (notificationsQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={notificationsQuery.isFetching}
            onClick={() => void notificationsQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {notificationsQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!notificationsQuery.data.items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">No notifications</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Updates that involve you will appear here.
        </p>
      </Card>
    );
  }

  const items = notificationsQuery.data.items;
  const unreadCount = items.filter((notification) => !notification.readAt).length;
  const actionError = actions.markRead.error ?? actions.markAllRead.error;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {unreadCount > 0 ? `${unreadCount} unread` : "No unread notifications"}
        </p>
        <Button
          disabled={actions.markAllRead.isPending}
          loading={actions.markAllRead.isPending}
          onClick={() => actions.markAllRead.mutate()}
          variant="secondary"
        >
          Mark all read
        </Button>
      </div>

      {actionError ? (
        <ErrorAlert>
          Could not update notifications. {actionError.message}
        </ErrorAlert>
      ) : null}

      <Card variant="list">
        <ul>
          {items.map((notification) => {
            const unread = !notification.readAt;
            const title = humanizeKey(notification.type);
            const workspace = workspaceName(notification.workspace);
            const when = formatDateTime(notification.createdAt);
            const marking =
              actions.markRead.isPending &&
              actions.markRead.variables === notification._id;

            return (
              <li
                className={cn(
                  "cs-row flex flex-wrap items-center gap-x-4 gap-y-2 p-4",
                  unread && "bg-primary-soft/30",
                )}
                key={notification._id}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    unread ? "bg-primary" : "bg-transparent",
                  )}
                />

                <div className="min-w-0 flex-1 basis-56">
                  <p
                    className={cn(
                      "text-sm text-foreground",
                      unread ? "font-semibold" : "font-medium",
                    )}
                  >
                    {title}
                    {unread ? <span className="sr-only"> (unread)</span> : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {actorName(notification.actor)}
                    {workspace ? ` in ${workspace}` : ""}
                    {when ? ` · ${when}` : ""}
                  </p>
                </div>

                {unread ? (
                  <Button
                    aria-label={`Mark ${title}${when ? ` from ${when}` : ""} as read`}
                    disabled={actions.markRead.isPending}
                    loading={marking}
                    onClick={() => actions.markRead.mutate(notification._id)}
                    size="sm"
                    variant="ghost"
                  >
                    Mark read
                  </Button>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted">
                    <FiCheck aria-hidden="true" size={13} />
                    Read
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}