"use client";

import { Card } from "@/components/ui/card";
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
    <div className="cs-page">
      <div className="flex items-start justify-between gap-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">{workspaceQuery.data.name}</h1>
          <p className="cs-page-description">
            {workspaceQuery.data.description || "No description"}
          </p>
        </div>
        <WorkspaceSettingsLink workspaceId={workspaceId} />
      </div>
      <Card className="max-w-xl p-5" variant="form">
        <h2 className="mb-4 cs-section-title">Workspace profile</h2>
        <WorkspaceForm mode="update" workspace={workspaceQuery.data} />
      </Card>
    </div>
  );
}
