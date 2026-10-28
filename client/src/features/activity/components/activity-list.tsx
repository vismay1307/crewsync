"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityQuery } from "@/features/activity/hooks/use-activity-queries";
import {
  formatDateTime,
  formatTime,
  getDayLabel,
  humanizeKey,
} from "@/lib/api/format";
import type { User } from "@/types/entities";

function actorName(actor?: string | User) {
  if (!actor || typeof actor === "string") return "System";
  return `${actor.firstName} ${actor.lastName}`;
}

function actorInitials(actor?: string | User) {
  if (!actor || typeof actor === "string") return "S";

  return (
    [actor.firstName, actor.lastName]
      .map((part) => part?.charAt(0) ?? "")
      .join("")
      .toUpperCase() || "U"
  );
}

function groupByDay<T extends { createdAt: string }>(items: T[]) {
  const groups: Array<{ items: T[]; label: string }> = [];

  for (const item of items) {
    const label = getDayLabel(item.createdAt);
    const last = groups[groups.length - 1];

    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ items: [item], label });
    }
  }

  return groups;
}

function ActivitySkeleton() {
  return (
    <Card aria-busy="true" variant="list">
      {[0, 1, 2, 3].map((index) => (
        <div className="cs-row flex items-center gap-3 p-4" key={index}>
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
      <span className="sr-only" role="status">
        Loading activity
      </span>
    </Card>
  );
}

export function ActivityList({ workspaceId }: { workspaceId: string }) {
  const activityQuery = useActivityQuery(workspaceId, { limit: 50 });
  const items = activityQuery.data?.items;
  const groups = useMemo(() => groupByDay(items ?? []), [items]);

  if (activityQuery.isPending) {
    return <ActivitySkeleton />;
  }

  if (activityQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={activityQuery.isFetching}
            onClick={() => void activityQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {activityQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!activityQuery.data.items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">No activity yet</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Changes made in this workspace will be recorded here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => (
        <section key={`${group.label}-${groupIndex}`}>
          <h2 className="mb-3 text-sm font-medium text-muted">{group.label}</h2>
          <Card variant="list">
            <ul>
              {group.items.map((entry) => (
                <li
                  className="cs-row flex items-start gap-3 p-4"
                  key={entry._id}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground"
                  >
                    {actorInitials(entry.actor)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {humanizeKey(entry.action)}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {actorName(entry.actor)} · {humanizeKey(entry.resourceType)}
                    </p>
                  </div>

                  <time
                    className="shrink-0 pt-0.5 text-xs text-muted"
                    dateTime={entry.createdAt}
                    title={formatDateTime(entry.createdAt) ?? undefined}
                  >
                    {formatTime(entry.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ))}
    </div>
  );
}