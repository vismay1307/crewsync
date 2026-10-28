"use client";

import Link from "next/link";
import { use, useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/features/tasks/components/task-create-dialog";
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { projectId, workspaceId } = use(params);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="cs-page">
      <div className="space-y-4">
        <Link
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          href={`/workspaces/${workspaceId}/projects/${projectId}`}
        >
          <FiArrowLeft aria-hidden="true" size={15} />
          Back to project
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="cs-page-header">
            <h1 className="cs-page-title">Tasks</h1>
            <p className="cs-page-description">
              Track the work in this project. Open a task to update its details
              or discuss it in comments.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <FiPlus aria-hidden="true" size={16} />
            New task
          </Button>
        </header>
      </div>

      <TaskList
        onCreate={() => setCreateOpen(true)}
        projectId={projectId}
        workspaceId={workspaceId}
      />

      <section>
        <h2 className="cs-section-title">Archived</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          Archived tasks are kept out of the active list. Restore one to use it
          again.
        </p>
        <TaskList archived projectId={projectId} workspaceId={workspaceId} />
      </section>

      <CreateTaskDialog
        onClose={() => setCreateOpen(false)}
        open={createOpen}
        projectId={projectId}
        workspaceId={workspaceId}
      />
    </div>
  );
}