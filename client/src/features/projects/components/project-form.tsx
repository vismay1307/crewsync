"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/features/projects/hooks/use-project-queries";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/api/cn";
import type { Project } from "@/types/entities";

export function ProjectForm({
  mode,
  onCancel,
  onSuccess,
  project,
  workspaceId,
}: {
  mode: "create" | "update";
  onCancel?: () => void;
  onSuccess?: () => void;
  project?: Project;
  workspaceId: string;
}) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(
    project?.description ?? "",
  );
  const [emoji, setEmoji] = useState(project?.emoji ?? "");

  const createMutation = useCreateProjectMutation(workspaceId);
  const updateMutation = useUpdateProjectMutation(
    workspaceId,
    project?._id ?? "",
  );

  const mutation =
    mode === "create" ? createMutation : updateMutation;

  const nameError =
    name && name.trim().length < 3
      ? "Project name must be at least 3 characters."
      : name.trim().length > 100
        ? "Project name cannot exceed 100 characters."
        : undefined;

  const canSubmit =
    name.trim().length >= 3 &&
    name.trim().length <= 100 &&
    description.trim().length <= 500 &&
    !mutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      emoji: emoji.trim() || undefined,
    };

    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => {
          setName("");
          setDescription("");
          setEmoji("");
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
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-4">
        <Input
          error={nameError}
          hint={nameError ? undefined : "3 to 100 characters."}
          label="Project name"
          name="projectName"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />

        <Input
          hint="Optional."
          label="Emoji"
          name="emoji"
          onChange={(event) => setEmoji(event.target.value)}
          value={emoji}
        />
      </div>

      <Textarea
        className="min-h-24"
        hint="Optional. Up to 500 characters."
        label="Description"
        maxLength={500}
        name="projectDescription"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />

      {apiError ? <ErrorAlert>{apiError}</ErrorAlert> : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 pt-1",
          onCancel ? "justify-end" : "justify-start",
        )}
      >
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
              ? "Create project"
              : "Save project"}
        </Button>
      </div>
    </form>
  );
}