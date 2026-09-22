"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ProjectForm } from "@/features/projects/components/project-form";
import { useProjectQuery } from "@/features/projects/hooks/use-project-queries";

export function ProjectDetail({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) {
  const projectQuery = useProjectQuery(workspaceId, projectId);

  if (projectQuery.isPending) {
    return <p className="text-sm text-muted">Loading project</p>;
  }

  if (projectQuery.isError) {
    return <p className="text-sm text-destructive">{projectQuery.error.message}</p>;
  }

  return (
    <main className="cs-page">
      <div className="cs-page-header">
        <h1 className="cs-page-title">
          {projectQuery.data.emoji ? `${projectQuery.data.emoji} ` : ""}
          {projectQuery.data.name}
        </h1>
        <p className="cs-page-description">
          {projectQuery.data.description || "No description"}
        </p>
      </div>
      <Card className="max-w-xl p-5" variant="form">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="cs-section-title">Project profile</h2>
          <Link
            className="cs-link-button"
            href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
          >
            Tasks
          </Link>
        </div>
        <ProjectForm mode="update" project={projectQuery.data} workspaceId={workspaceId} />
      </Card>
    </main>
  );
}
