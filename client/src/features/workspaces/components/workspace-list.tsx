"use client";

import Link from "next/link";
import { FiArrowRight, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
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
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">No workspaces yet</h2>
        <p className="mt-1 text-sm text-muted">Create a workspace to start organizing projects.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {workspacesQuery.data.map((workspace) => (
        <div className="flex items-center justify-between gap-4 p-4" key={workspace._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{workspace.name}</h2>
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
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm hover:bg-background"
              href={`/workspaces/${workspace._id}`}
            >
              Open
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
