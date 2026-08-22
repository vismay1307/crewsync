"use client";

import Link from "next/link";
import { FiArchive, FiArrowRight, FiRotateCcw, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  useArchiveProjectMutation,
  useDeleteProjectMutation,
  useProjectsQuery,
  useRestoreProjectMutation,
} from "@/features/projects/hooks/use-project-queries";

export function ProjectList({
  archived = false,
  workspaceId,
}: {
  archived?: boolean;
  workspaceId: string;
}) {
  const projectsQuery = useProjectsQuery(workspaceId, { archived, limit: 50 });
  const archiveMutation = useArchiveProjectMutation(workspaceId);
  const restoreMutation = useRestoreProjectMutation(workspaceId);
  const deleteMutation = useDeleteProjectMutation(workspaceId);

  if (projectsQuery.isPending) {
    return <p className="text-sm text-muted">Loading projects</p>;
  }

  if (projectsQuery.isError) {
    return <p className="text-sm text-destructive">{projectsQuery.error.message}</p>;
  }

  if (!projectsQuery.data.items.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">
          {archived ? "No archived projects" : "No projects yet"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {archived ? "Archived backend projects appear here." : "Create a project to start adding tasks."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {projectsQuery.data.items.map((project) => (
        <div className="flex items-center justify-between gap-4 p-4" key={project._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">
              {project.emoji ? `${project.emoji} ` : ""}
              {project.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {project.description || "No description"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {archived ? (
              <Button
                disabled={restoreMutation.isPending}
                onClick={() => restoreMutation.mutate(project._id)}
                variant="ghost"
              >
                <FiRotateCcw size={15} />
              </Button>
            ) : (
              <Button
                disabled={archiveMutation.isPending}
                onClick={() => archiveMutation.mutate(project._id)}
                variant="ghost"
              >
                <FiArchive size={15} />
              </Button>
            )}
            <Button
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(project._id)}
              variant="ghost"
            >
              <FiTrash2 size={15} />
            </Button>
            {!archived ? (
              <Link
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm hover:bg-background"
                href={`/workspaces/${workspaceId}/projects/${project._id}`}
              >
                Open
                <FiArrowRight size={15} />
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
