"use client";

import { TaskForm } from "@/features/tasks/components/task-form";
import { useTaskQuery } from "@/features/tasks/hooks/use-task-queries";

export function TaskDetail({
  projectId,
  taskId,
  workspaceId,
}: {
  projectId: string;
  taskId: string;
  workspaceId: string;
}) {
  const taskQuery = useTaskQuery(workspaceId, projectId, taskId);

  if (taskQuery.isPending) {
    return <p className="text-sm text-muted">Loading task</p>;
  }

  if (taskQuery.isError) {
    return <p className="text-sm text-destructive">{taskQuery.error.message}</p>;
  }

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">{taskQuery.data.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {taskQuery.data.isOverdue ? "Overdue" : "Task details"}
        </p>
      </div>
      <section className="max-w-2xl rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Task profile</h2>
        <TaskForm
          mode="update"
          projectId={projectId}
          task={taskQuery.data}
          workspaceId={workspaceId}
        />
      </section>
    </main>
  );
}
