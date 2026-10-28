"use client";

import { use, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "@/features/projects/components/project-create-dialog";
import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="cs-page">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Projects</h1>
          <p className="cs-page-description">
            Group related work into projects. Open a project to manage its
            tasks.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <FiPlus aria-hidden="true" size={16} />
          New project
        </Button>
      </header>

      <ProjectList
        onCreate={() => setCreateOpen(true)}
        workspaceId={workspaceId}
      />

      <section>
        <h2 className="cs-section-title">Archived</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          Archived projects are kept out of the active list. Restore one to
          use it again.
        </p>
        <ProjectList archived workspaceId={workspaceId} />
      </section>

      <CreateProjectDialog
        onClose={() => setCreateOpen(false)}
        open={createOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}