"use client";

import { Card } from "@/components/ui/card";
import { TaskForm } from "@/features/tasks/components/task-form";
import { useTaskQuery } from "@/features/tasks/hooks/use-task-queries";
import { CommentThread } from "@/features/comments/components/comment-thread";

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
    <main className="cs-page">
      <div className="cs-page-header">
        <h1 className="cs-page-title">{taskQuery.data.title}</h1>
        <p className="cs-page-description">
          {taskQuery.data.isOverdue ? "Overdue" : "Task details"}
        </p>
      </div>
      <Card className="max-w-2xl p-5" variant="form">
        <h2 className="mb-4 cs-section-title">Task profile</h2>
        <TaskForm
          mode="update"
          projectId={projectId}
          task={taskQuery.data}
          workspaceId={workspaceId}
        />
      </Card>
      <CommentThread projectId={projectId} taskId={taskId} workspaceId={workspaceId} />
    </main>
  );
}
