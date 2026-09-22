"use client";

import Link from "next/link";
import { FiArchive, FiRotateCcw, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">
          {archived ? "No archived projects" : "No projects yet"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          {archived ? "Archived backend projects appear here." : "Create a project to start adding tasks."}
        </p>
      </Card>
    );
  }

  return (
    <Card variant="list">
      {projectsQuery.data.items.map((project) => (
        <div className="cs-row flex items-center justify-between gap-4 p-4 transition-colors" key={project._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground">
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
                className="cs-link-button"
                href={`/workspaces/${workspaceId}/projects/${project._id}`}
              >
                Open
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </Card>
  );
}
