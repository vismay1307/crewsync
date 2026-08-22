"use client";

import { Button } from "@/components/ui/button";
import {
  useNotificationActions,
  useNotificationsQuery,
} from "@/features/notifications/hooks/use-notification-queries";
import type { User, Workspace } from "@/types/entities";

function actorName(actor?: string | User) {
  if (!actor || typeof actor === "string") return "System";
  return `${actor.firstName} ${actor.lastName}`;
}

function workspaceName(workspace?: string | Workspace) {
  if (!workspace || typeof workspace === "string") return "";
  return workspace.name;
}

export function NotificationList() {
  const notificationsQuery = useNotificationsQuery({ limit: 50 });
  const actions = useNotificationActions();

  if (notificationsQuery.isPending) {
    return <p className="text-sm text-muted">Loading notifications</p>;
  }

  if (notificationsQuery.isError) {
    return <p className="text-sm text-destructive">{notificationsQuery.error.message}</p>;
  }

  if (!notificationsQuery.data.items.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">No notifications</h2>
        <p className="mt-1 text-sm text-muted">Activity directed to you appears here.</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex justify-end">
        <Button
          disabled={actions.markAllRead.isPending}
          onClick={() => actions.markAllRead.mutate()}
          variant="secondary"
        >
          Mark all read
        </Button>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {notificationsQuery.data.items.map((notification) => (
          <article className="flex items-center justify-between gap-4 p-4" key={notification._id}>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{notification.type}</h2>
              <p className="mt-1 text-sm text-muted">
                {actorName(notification.actor)}
                {workspaceName(notification.workspace) ? ` in ${workspaceName(notification.workspace)}` : ""}
              </p>
            </div>
            <Button
              disabled={actions.markRead.isPending || Boolean(notification.readAt)}
              onClick={() => actions.markRead.mutate(notification._id)}
              variant="ghost"
            >
              {notification.readAt ? "Read" : "Mark read"}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
