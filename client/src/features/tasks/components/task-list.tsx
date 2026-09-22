"use client";

import Link from "next/link";
import { FiArchive, FiRotateCcw, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useTaskActionMutations,
  useTasksQuery,
} from "@/features/tasks/hooks/use-task-queries";
import type { TaskPriority, TaskStatus } from "@/types/entities";

const statusLabel: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};

const priorityLabel: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function TaskList({
  archived = false,
  projectId,
  workspaceId,
}: {
  archived?: boolean;
  projectId: string;
  workspaceId: string;
}) {
  const tasksQuery = useTasksQuery(workspaceId, projectId, { archived, limit: 50 });
  const actions = useTaskActionMutations(workspaceId, projectId);

  if (tasksQuery.isPending) {
    return <p className="text-sm text-muted">Loading tasks</p>;
  }

  if (tasksQuery.isError) {
    return <p className="text-sm text-destructive">{tasksQuery.error.message}</p>;
  }

  if (!tasksQuery.data.items.length) {
    return (
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">
          {archived ? "No archived tasks" : "No tasks yet"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          {archived ? "Archived backend tasks appear here." : "Create a task to track project work."}
        </p>
      </Card>
    );
  }

  return (
    <Card variant="list">
      {tasksQuery.data.items.map((task) => (
        <div className="cs-row grid gap-3 p-4 transition-colors lg:grid-cols-[minmax(0,1fr)_120px_120px_180px] lg:items-center" key={task._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground">{task.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {task.description || "No description"}
            </p>
          </div>
          <span className="cs-meta-pill justify-center">{statusLabel[task.status]}</span>
          <span className="cs-meta-pill justify-center">{priorityLabel[task.priority]}</span>
          <div className="flex items-center gap-2">
            {archived ? (
              <Button
                disabled={actions.restore.isPending}
                onClick={() => actions.restore.mutate(task._id)}
                variant="ghost"
              >
                <FiRotateCcw size={15} />
              </Button>
            ) : (
              <Button
                disabled={actions.archive.isPending}
                onClick={() => actions.archive.mutate(task._id)}
                variant="ghost"
              >
                <FiArchive size={15} />
              </Button>
            )}
            <Button
              disabled={actions.delete.isPending}
              onClick={() => actions.delete.mutate(task._id)}
              variant="ghost"
            >
              <FiTrash2 size={15} />
            </Button>
            {!archived ? (
              <Link
                className="cs-link-button"
                href={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
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
