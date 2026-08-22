"use client";

import { useActivityQuery } from "@/features/activity/hooks/use-activity-queries";
import type { User } from "@/types/entities";

function actorName(actor?: string | User) {
  if (!actor || typeof actor === "string") return "System";
  return `${actor.firstName} ${actor.lastName}`;
}

export function ActivityList({ workspaceId }: { workspaceId: string }) {
  const activityQuery = useActivityQuery(workspaceId, { limit: 50 });

  if (activityQuery.isPending) {
    return <p className="text-sm text-muted">Loading activity</p>;
  }

  if (activityQuery.isError) {
    return <p className="text-sm text-destructive">{activityQuery.error.message}</p>;
  }

  if (!activityQuery.data.items.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">No activity yet</h2>
        <p className="mt-1 text-sm text-muted">Workspace changes appear here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {activityQuery.data.items.map((entry) => (
        <article className="grid gap-2 p-4 md:grid-cols-[180px_minmax(0,1fr)_180px]" key={entry._id}>
          <p className="text-sm font-medium">{actorName(entry.actor)}</p>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{entry.action}</h2>
            <p className="mt-1 text-sm text-muted">{entry.resourceType}</p>
          </div>
          <time className="text-sm text-muted" dateTime={entry.createdAt}>
            {new Date(entry.createdAt).toLocaleString()}
          </time>
        </article>
      ))}
    </div>
  );
}
