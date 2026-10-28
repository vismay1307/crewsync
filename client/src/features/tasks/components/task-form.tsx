"use client";

import { type FormEvent, useState } from "react";
import { FiCheck } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/features/tasks/hooks/use-task-queries";
import { ApiError } from "@/lib/api/client";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/entities";

export function TaskForm({
  mode,
  onCancel,
  onSuccess,
  projectId,
  task,
  workspaceId,
}: {
  mode: "create" | "update";
  onCancel?: () => void;
  onSuccess?: () => void;
  projectId: string;
  task?: Task;
  workspaceId: string;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(
    task?.description ?? "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    task?.status ?? "todo",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium",
  );
  const [startDate, setStartDate] = useState(
    task?.startDate?.slice(0, 10) ?? "",
  );
  const [dueDate, setDueDate] = useState(
    task?.dueDate?.slice(0, 10) ?? "",
  );

  const createMutation = useCreateTaskMutation(workspaceId, projectId);
  const updateMutation = useUpdateTaskMutation(
    workspaceId,
    projectId,
    task?._id ?? "",
  );

  const mutation =
    mode === "create" ? createMutation : updateMutation;

  const titleError =
    title && title.trim().length < 3
      ? "Task title must be at least 3 characters."
      : title.trim().length > 150
        ? "Task title cannot exceed 150 characters."
        : undefined;

  const canSubmit =
    title.trim().length >= 3 &&
    title.trim().length <= 150 &&
    description.trim().length <= 5000 &&
    !mutation.isPending;

  const dirty =
    mode === "update" &&
    (title !== (task?.title ?? "") ||
      description !== (task?.description ?? "") ||
      status !== (task?.status ?? "todo") ||
      priority !== (task?.priority ?? "medium") ||
      startDate !== (task?.startDate?.slice(0, 10) ?? "") ||
      dueDate !== (task?.dueDate?.slice(0, 10) ?? ""));

  const showSaved =
    mode === "update" && updateMutation.isSuccess && !dirty;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    // Preserve the existing API payload and whitespace behavior.
    const data = {
      title,
      description: description || undefined,
      status,
      priority,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    };

    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
        },
      });

      return;
    }

    updateMutation.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  }

  const apiError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error?.message;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        error={titleError}
        hint={titleError ? undefined : "3 to 150 characters."}
        label="Title"
        name="title"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
        <Select
          label="Status"
          name="taskStatus"
          onChange={(event) =>
            setStatus(event.target.value as TaskStatus)
          }
          value={status}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </Select>

        <Select
          label="Priority"
          name="taskPriority"
          onChange={(event) =>
            setPriority(event.target.value as TaskPriority)
          }
          value={priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
        <Input
          label="Start date"
          name="startDate"
          onChange={(event) => setStartDate(event.target.value)}
          type="date"
          value={startDate}
        />

        <Input
          label="Due date"
          name="dueDate"
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          value={dueDate}
        />
      </div>

      <Textarea
        className="min-h-28"
        hint="Optional. Up to 5000 characters."
        label="Description"
        maxLength={5000}
        name="taskDescription"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />

      {apiError ? <ErrorAlert>{apiError}</ErrorAlert> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p
          className="inline-flex min-h-5 items-center gap-1.5 text-sm text-success"
          role="status"
        >
          {showSaved ? (
            <>
              <FiCheck aria-hidden="true" size={14} />
              Task saved.
            </>
          ) : null}
        </p>

        <div className="flex items-center gap-3">
          {onCancel ? (
            <Button
              disabled={mutation.isPending}
              onClick={onCancel}
              variant="secondary"
            >
              Cancel
            </Button>
          ) : null}

          <Button
            disabled={!canSubmit}
            loading={mutation.isPending}
            type="submit"
          >
            {mutation.isPending
              ? mode === "create"
                ? "Creating"
                : "Saving"
              : mode === "create"
                ? "Create task"
                : "Save task"}
          </Button>
        </div>
      </div>
    </form>
  );
}