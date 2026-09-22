"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/features/tasks/hooks/use-task-queries";
import { ApiError } from "@/lib/api/client";
import type { Task, TaskPriority, TaskStatus } from "@/types/entities";

export function TaskForm({
  mode,
  projectId,
  task,
  workspaceId,
}: {
  mode: "create" | "update";
  projectId: string;
  task?: Task;
  workspaceId: string;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [startDate, setStartDate] = useState(task?.startDate?.slice(0, 10) ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 10) ?? "");
  const createMutation = useCreateTaskMutation(workspaceId, projectId);
  const updateMutation = useUpdateTaskMutation(workspaceId, projectId, task?._id ?? "");
  const mutation = mode === "create" ? createMutation : updateMutation;
  const titleError =
    title && title.trim().length < 3 ? "Task title must be at least 3 characters." : undefined;
  const canSubmit =
    title.trim().length >= 3 &&
    title.trim().length <= 150 &&
    description.trim().length <= 5000 &&
    !mutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    mutation.mutate({
      title,
      description: description || undefined,
      status,
      priority,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });
  }

  const apiError =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error?.message;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={titleError}
        label="Title"
        name="title"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          name="taskStatus"
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
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
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          value={priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
        label="Description"
        maxLength={5000}
        name="taskDescription"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />
      {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
      <Button disabled={!canSubmit} type="submit">
        {mutation.isPending
          ? mode === "create"
            ? "Creating"
            : "Saving"
          : mode === "create"
            ? "Create task"
            : "Save task"}
      </Button>
    </form>
  );
}
