"use client";

import Link from "next/link";
import { FiArchive, FiArrowRight, FiRotateCcw, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
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
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">
          {archived ? "No archived tasks" : "No tasks yet"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {archived ? "Archived backend tasks appear here." : "Create a task to track project work."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {tasksQuery.data.items.map((task) => (
        <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_120px_120px_180px] lg:items-center" key={task._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{task.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {task.description || "No description"}
            </p>
          </div>
          <span className="text-sm text-muted">{statusLabel[task.status]}</span>
          <span className="text-sm text-muted">{priorityLabel[task.priority]}</span>
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
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm hover:bg-background"
                href={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
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
