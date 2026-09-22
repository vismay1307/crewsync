"use client";

import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useDeleteWorkspaceMutation,
  useWorkspacesQuery,
} from "@/features/workspaces/hooks/use-workspace-queries";

export function WorkspaceList() {
  const workspacesQuery = useWorkspacesQuery();
  const deleteMutation = useDeleteWorkspaceMutation();

  if (workspacesQuery.isPending) {
    return <p className="text-sm text-muted">Loading workspaces</p>;
  }

  if (workspacesQuery.isError) {
    return <p className="text-sm text-destructive">{workspacesQuery.error.message}</p>;
  }

  if (!workspacesQuery.data.length) {
    return (
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">No workspaces yet</h2>
        <p className="mt-1 text-sm leading-6 text-muted">Create a workspace to start organizing projects.</p>
      </Card>
    );
  }

  return (
    <Card variant="list">
      {workspacesQuery.data.map((workspace) => (
        <div className="cs-row flex items-center justify-between gap-4 p-4 transition-colors" key={workspace._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground">{workspace.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {workspace.description || "No description"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              aria-label={`Delete ${workspace.name}`}
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(workspace._id)}
              variant="ghost"
            >
              <FiTrash2 size={15} />
            </Button>
            <Link
              className="cs-link-button"
              href={`/workspaces/${workspace._id}`}
            >
              Open
            </Link>
          </div>
        </div>
      ))}
    </Card>
  );
}
