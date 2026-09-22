"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">No notifications</h2>
        <p className="mt-1 text-sm leading-6 text-muted">Activity directed to you appears here.</p>
      </Card>
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
      <Card variant="list">
        {notificationsQuery.data.items.map((notification) => (
          <article className="cs-row flex items-center justify-between gap-4 p-4 transition-colors" key={notification._id}>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-medium text-foreground">{notification.type}</h2>
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
      </Card>
    </section>
  );
}
