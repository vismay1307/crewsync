"use client";

import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { useWorkspaceQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { WorkspaceSettingsLink } from "@/components/layout/app-shell";

export function WorkspaceDetail({ workspaceId }: { workspaceId: string }) {
  const workspaceQuery = useWorkspaceQuery(workspaceId);

  if (workspaceQuery.isPending) {
    return <p className="text-sm text-muted">Loading workspace</p>;
  }

  if (workspaceQuery.isError) {
    return <p className="text-sm text-destructive">{workspaceQuery.error.message}</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{workspaceQuery.data.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {workspaceQuery.data.description || "No description"}
          </p>
        </div>
        <WorkspaceSettingsLink workspaceId={workspaceId} />
      </div>
      <section className="max-w-xl rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Workspace profile</h2>
        <WorkspaceForm mode="update" workspace={workspaceQuery.data} />
      </section>
    </div>
  );
}
