"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArchive, FiRotateCcw, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  ProjectAvatar,
  ProjectRowSkeleton,
} from "@/features/projects/components/project-parts";
import {
  useArchiveProjectMutation,
  useDeleteProjectMutation,
  useProjectsQuery,
  useRestoreProjectMutation,
} from "@/features/projects/hooks/use-project-queries";

export function ProjectList({
  archived = false,
  onCreate,
  workspaceId,
}: {
  archived?: boolean;
  onCreate?: () => void;
  workspaceId: string;
}) {
  const projectsQuery = useProjectsQuery(workspaceId, { archived, limit: 50 });
  const archiveMutation = useArchiveProjectMutation(workspaceId);
  const restoreMutation = useRestoreProjectMutation(workspaceId);
  const deleteMutation = useDeleteProjectMutation(workspaceId);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const anyPending =
    archiveMutation.isPending ||
    restoreMutation.isPending ||
    deleteMutation.isPending;
  const actionError =
    archiveMutation.error ?? restoreMutation.error ?? deleteMutation.error;

  function clearActionErrors() {
    archiveMutation.reset();
    restoreMutation.reset();
    deleteMutation.reset();
  }

  function cancelDelete() {
    setConfirmingId(null);
    clearActionErrors();
  }

  function confirmDelete(projectId: string) {
    deleteMutation.mutate(projectId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  if (projectsQuery.isPending) {
    return (
      <Card aria-busy="true" variant="list">
        {[0, 1, 2].map((index) => (
          <ProjectRowSkeleton key={index} />
        ))}
        <span className="sr-only" role="status">
          Loading projects
        </span>
      </Card>
    );
  }

  if (projectsQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={projectsQuery.isFetching}
            onClick={() => void projectsQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {projectsQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!projectsQuery.data.items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">
          {archived ? "No archived projects" : "No projects yet"}
        </p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          {archived
            ? "Projects you archive will appear here."
            : "Create a project to start adding tasks."}
        </p>
        {!archived && onCreate ? (
          <Button className="mt-4" onClick={onCreate}>
            Create project
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {actionError ? (
        <ErrorAlert>
          Could not update the project. {actionError.message}
        </ErrorAlert>
      ) : null}

      <Card variant="list">
        <ul>
          {projectsQuery.data.items.map((project) => {
            const confirming = confirmingId === project._id;
            const deleting =
              deleteMutation.isPending &&
              deleteMutation.variables === project._id;

            return (
              <li
                className="cs-row relative flex flex-wrap items-center gap-x-4 gap-y-3 p-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring"
                key={project._id}
              >
                <ProjectAvatar emoji={project.emoji} muted={archived} />

                <div className="min-w-0 flex-1 basis-56">
                  {archived ? (
                    <p className="truncate text-sm font-medium text-muted">
                      {project.name}
                    </p>
                  ) : (
                    <Link
                      className="block truncate text-sm font-medium text-foreground outline-none after:absolute after:inset-0 after:content-['']"
                      href={`/workspaces/${workspaceId}/projects/${project._id}`}
                    >
                      {project.name}
                    </Link>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {project.description || "No description"}
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
                        Delete this project?
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
                        aria-label={`Confirm delete ${project.name}`}
                        loading={deleting}
                        onClick={() => confirmDelete(project._id)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      {archived ? (
                        <Button
                          aria-label={`Restore ${project.name}`}
                          disabled={anyPending}
                          onClick={() => {
                            clearActionErrors();
                            restoreMutation.mutate(project._id);
                          }}
                          size="icon"
                          title="Restore"
                          variant="ghost"
                        >
                          <FiRotateCcw aria-hidden="true" size={15} />
                        </Button>
                      ) : (
                        <Button
                          aria-label={`Archive ${project.name}`}
                          disabled={anyPending}
                          onClick={() => {
                            clearActionErrors();
                            archiveMutation.mutate(project._id);
                          }}
                          size="icon"
                          title="Archive"
                          variant="ghost"
                        >
                          <FiArchive aria-hidden="true" size={15} />
                        </Button>
                      )}
                      <Button
                        aria-label={`Delete ${project.name}`}
                        disabled={anyPending}
                        onClick={() => {
                          clearActionErrors();
                          setConfirmingId(project._id);
                        }}
                        size="icon"
                        title="Delete"
                        variant="ghost"
                      >
                        <FiTrash2 aria-hidden="true" size={15} />
                      </Button>
                    </>
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