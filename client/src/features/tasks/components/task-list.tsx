"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArchive,
  FiCalendar,
  FiRotateCcw,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  TaskLabelChips,
  TaskPriorityBadge,
  TaskRowSkeleton,
  TaskStatusBadge,
  formatTaskDate,
  getUserName,
} from "@/features/tasks/components/task-parts";
import {
  useTaskActionMutations,
  useTasksQuery,
} from "@/features/tasks/hooks/use-task-queries";
import { cn } from "@/lib/api/cn";

export function TaskList({
  archived = false,
  onCreate,
  projectId,
  workspaceId,
}: {
  archived?: boolean;
  onCreate?: () => void;
  projectId: string;
  workspaceId: string;
}) {
  const tasksQuery = useTasksQuery(workspaceId, projectId, { archived, limit: 50 });
  const actions = useTaskActionMutations(workspaceId, projectId);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const anyPending =
    actions.archive.isPending ||
    actions.restore.isPending ||
    actions.delete.isPending;
  const actionError =
    actions.archive.error ?? actions.restore.error ?? actions.delete.error;

  function clearActionErrors() {
    actions.archive.reset();
    actions.restore.reset();
    actions.delete.reset();
  }

  function cancelDelete() {
    setConfirmingId(null);
    clearActionErrors();
  }

  function confirmDelete(taskId: string) {
    actions.delete.mutate(taskId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  if (tasksQuery.isPending) {
    return (
      <Card aria-busy="true" variant="list">
        {[0, 1, 2].map((index) => (
          <TaskRowSkeleton key={index} />
        ))}
        <span className="sr-only" role="status">
          Loading tasks
        </span>
      </Card>
    );
  }

  if (tasksQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={tasksQuery.isFetching}
            onClick={() => void tasksQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {tasksQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!tasksQuery.data.items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">
          {archived ? "No archived tasks" : "No tasks yet"}
        </p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          {archived
            ? "Tasks you archive will appear here."
            : "Create a task to start tracking work in this project."}
        </p>
        {!archived && onCreate ? (
          <Button className="mt-4" onClick={onCreate}>
            Create task
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {actionError ? (
        <ErrorAlert>Could not update the task. {actionError.message}</ErrorAlert>
      ) : null}

      <Card variant="list">
        <ul>
          {tasksQuery.data.items.map((task) => {
            const confirming = confirmingId === task._id;
            const deleting =
              actions.delete.isPending && actions.delete.variables === task._id;
            const dueDate = formatTaskDate(task.dueDate);
            const assigneeName = getUserName(task.assignee);

            return (
              <li
                className="cs-row relative flex flex-wrap items-center gap-x-4 gap-y-3 p-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring"
                key={task._id}
              >
                <div className="min-w-0 flex-1 basis-64">
                  {archived ? (
                    <p className="truncate text-sm font-medium text-muted">
                      {task.title}
                    </p>
                  ) : (
                    <Link
                      className="block truncate text-sm font-medium text-foreground outline-none after:absolute after:inset-0 after:content-['']"
                      href={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
                    >
                      {task.title}
                    </Link>
                  )}
                  <p className="mt-1 line-clamp-1 text-sm text-muted">
                    {task.description || "No description"}
                  </p>

                  {dueDate || assigneeName || task.labels?.length ? (
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      {dueDate ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs",
                            task.isOverdue
                              ? "font-medium text-destructive"
                              : "text-muted",
                          )}
                        >
                          <FiCalendar aria-hidden="true" size={12} />
                          {task.isOverdue
                            ? `Overdue, due ${dueDate}`
                            : `Due ${dueDate}`}
                        </span>
                      ) : null}
                      {assigneeName ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <FiUser aria-hidden="true" size={12} />
                          {assigneeName}
                        </span>
                      ) : null}
                      <TaskLabelChips labels={task.labels} />
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <TaskPriorityBadge priority={task.priority} />
                </div>

                <div
                  className="relative z-10 flex shrink-0 items-center gap-2"
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && confirming && !deleting) {
                      cancelDelete();
                    }
                  }}
                >
                  {confirming ? (
                    <>
                      <span className="hidden text-sm text-muted sm:inline">
                        Delete this task?
                      </span>
                      <Button
                        disabled={deleting}
                        onClick={cancelDelete}
                        size="sm"
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        aria-label={`Confirm delete ${task.title}`}
                        loading={deleting}
                        onClick={() => confirmDelete(task._id)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      {archived ? (
                        <Button
                          aria-label={`Restore ${task.title}`}
                          disabled={anyPending}
                          onClick={() => {
                            clearActionErrors();
                            actions.restore.mutate(task._id);
                          }}
                          size="icon"
                          title="Restore"
                          variant="ghost"
                        >
                          <FiRotateCcw aria-hidden="true" size={15} />
                        </Button>
                      ) : (
                        <Button
                          aria-label={`Archive ${task.title}`}
                          disabled={anyPending}
                          onClick={() => {
                            clearActionErrors();
                            actions.archive.mutate(task._id);
                          }}
                          size="icon"
                          title="Archive"
                          variant="ghost"
                        >
                          <FiArchive aria-hidden="true" size={15} />
                        </Button>
                      )}
                      <Button
                        aria-label={`Delete ${task.title}`}
                        disabled={anyPending}
                        onClick={() => {
                          clearActionErrors();
                          setConfirmingId(task._id);
                        }}
                        size="icon"
                        title="Delete"
                        variant="ghost"
                      >
                        <FiTrash2 aria-hidden="true" size={15} />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}