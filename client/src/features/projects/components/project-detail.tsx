"use client";

import Link from "next/link";

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
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">
          {projectQuery.data.emoji ? `${projectQuery.data.emoji} ` : ""}
          {projectQuery.data.name}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {projectQuery.data.description || "No description"}
        </p>
      </div>
      <section className="max-w-xl rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold">Project profile</h2>
          <Link
            className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-background"
            href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
          >
            Tasks
          </Link>
        </div>
        <ProjectForm mode="update" project={projectQuery.data} workspaceId={workspaceId} />
      </section>
    </main>
  );
}
