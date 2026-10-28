"use client";

import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiUser } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentThread } from "@/features/comments/components/comment-thread";
import { TaskForm } from "@/features/tasks/components/task-form";
import {
  TaskArchivedBadge,
  TaskLabelChips,
  TaskOverdueBadge,
  TaskPriorityBadge,
  TaskStatusBadge,
  formatTaskDate,
  getUserName,
} from "@/features/tasks/components/task-parts";
import { useTaskQuery } from "@/features/tasks/hooks/use-task-queries";

function TaskDetailSkeleton() {
  return (
    <div aria-busy="true" className="cs-page">
      <Skeleton className="h-4 w-24" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-8 w-80 max-w-full" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <span className="sr-only" role="status">
        Loading task
      </span>
    </div>
  );
}

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
    return <TaskDetailSkeleton />;
  }

  if (taskQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={taskQuery.isFetching}
            onClick={() => void taskQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {taskQuery.error.message}
      </ErrorAlert>
    );
  }

  const task = taskQuery.data;
  const dueDate = formatTaskDate(task.dueDate);
  const createdOn = formatTaskDate(task.createdAt);
  const assigneeName = getUserName(task.assignee);

  return (
    <div className="cs-page">
      <Link
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
      >
        <FiArrowLeft aria-hidden="true" size={15} />
        Tasks
      </Link>

      <header className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          {task.isOverdue ? <TaskOverdueBadge /> : null}
          {task.isArchived ? <TaskArchivedBadge /> : null}
        </div>

        <h1 className="cs-page-title mt-3 wrap-break-word">{task.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          {dueDate ? (
            <span className="inline-flex items-center gap-1.5">
              <FiCalendar aria-hidden="true" size={14} />
              Due {dueDate}
            </span>
          ) : null}
          {assigneeName ? (
            <span className="inline-flex items-center gap-1.5">
              <FiUser aria-hidden="true" size={14} />
              {assigneeName}
            </span>
          ) : null}
          {createdOn ? <span>Created {createdOn}</span> : null}
          <TaskLabelChips labels={task.labels} max={5} />
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-start">
        <Card variant="form">
          <CardHeader>
            <CardTitle>Task profile</CardTitle>
            <CardDescription>
              Update the title, status, priority, dates, and description.
            </CardDescription>
          </CardHeader>
          <div className="p-5">
            <TaskForm
              mode="update"
              projectId={projectId}
              task={task}
              workspaceId={workspaceId}
            />
          </div>
        </Card>

        <CommentThread
          projectId={projectId}
          taskId={taskId}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
}