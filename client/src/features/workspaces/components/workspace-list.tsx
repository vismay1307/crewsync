"use client";

import Link from "next/link";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  useDeleteWorkspaceMutation,
  useWorkspacesQuery,
} from "@/features/workspaces/hooks/use-workspace-queries";
import {
  VisibilityBadge,
  WorkspaceAvatar,
  WorkspaceRowSkeleton,
} from "@/features/workspaces/components/workspace-parts";

export function WorkspaceList({ onCreate }: { onCreate?: () => void }) {
  const workspacesQuery = useWorkspacesQuery();
  const deleteMutation = useDeleteWorkspaceMutation();

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function cancelDelete() {
    setConfirmingId(null);
    deleteMutation.reset();
  }

  function confirmDelete(workspaceId: string) {
    deleteMutation.mutate(workspaceId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  if (workspacesQuery.isPending) {
    return (
      <Card aria-busy="true" variant="list">
        {[0, 1, 2].map((index) => (
          <WorkspaceRowSkeleton key={index} />
        ))}

        <span className="sr-only" role="status">
          Loading workspaces
        </span>
      </Card>
    );
  }

  if (workspacesQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={workspacesQuery.isFetching}
            onClick={() => void workspacesQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {workspacesQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!workspacesQuery.data.length) {
    return (
      <Card className="p-6" variant="empty">
        <h2 className="cs-section-title">No workspaces yet</h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Create a workspace to start organizing projects and tasks with your
          team.
        </p>

        {onCreate ? (
          <Button className="mt-4" onClick={onCreate}>
            Create workspace
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {deleteMutation.isError ? (
        <ErrorAlert>
          Could not delete the workspace. {deleteMutation.error.message}
        </ErrorAlert>
      ) : null}

      <Card variant="list">
        <ul>
          {workspacesQuery.data.map((workspace) => {
            const confirming = confirmingId === workspace._id;
            const deleting =
              deleteMutation.isPending &&
              deleteMutation.variables === workspace._id;

            return (
              <li
                className="cs-row relative flex flex-wrap items-center gap-x-4 gap-y-3 p-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring"
                key={workspace._id}
              >
                <WorkspaceAvatar name={workspace.name} />

                <div className="min-w-0 flex-1 basis-56">
                  <div className="flex items-center gap-2">
                    <Link
                      className="truncate text-sm font-medium text-foreground outline-none after:absolute after:inset-0 after:content-['']"
                      href={`/workspaces/${workspace._id}`}
                    >
                      {workspace.name}
                    </Link>

                    <VisibilityBadge visibility={workspace.visibility} />
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {workspace.description || "No description"}
                  </p>
                </div>

                <div
                  className="relative z-10 flex shrink-0 items-center gap-2"
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && confirming && !deleting) {
                      cancelDelete();
                    }
                  }}
                >
                  {confirming ? (
                    <>
                      <span className="hidden text-sm text-muted sm:inline">
                        Delete this workspace?
                      </span>

                      <Button
                        disabled={deleting}
                        onClick={cancelDelete}
                        size="sm"
                        variant="secondary"
                      >
                        Cancel
                      </Button>

                      <Button
                        aria-label={`Confirm delete ${workspace.name}`}
                        loading={deleting}
                        onClick={() => confirmDelete(workspace._id)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      aria-label={`Delete ${workspace.name}`}
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        deleteMutation.reset();
                        setConfirmingId(workspace._id);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <FiTrash2 aria-hidden="true" size={15} />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}