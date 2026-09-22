"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/features/projects/hooks/use-project-queries";
import { ApiError } from "@/lib/api/client";
import type { Project } from "@/types/entities";

export function ProjectForm({
  mode,
  project,
  workspaceId,
}: {
  mode: "create" | "update";
  project?: Project;
  workspaceId: string;
}) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [emoji, setEmoji] = useState(project?.emoji ?? "");
  const createMutation = useCreateProjectMutation(workspaceId);
  const updateMutation = useUpdateProjectMutation(workspaceId, project?._id ?? "");
  const mutation = mode === "create" ? createMutation : updateMutation;
  const nameError =
    name && name.trim().length < 3 ? "Project name must be at least 3 characters." : undefined;
  const canSubmit =
    name.trim().length >= 3 &&
    name.trim().length <= 100 &&
    description.trim().length <= 500 &&
    !mutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    mutation.mutate({
      name,
      description: description || undefined,
      emoji: emoji || undefined,
    });
  }

  const apiError =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error?.message;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={nameError}
        label="Project name"
        name="projectName"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
      <Input
        label="Emoji"
        name="emoji"
        onChange={(event) => setEmoji(event.target.value)}
        value={emoji}
      />
      <Textarea
        className="min-h-24"
        label="Description"
        maxLength={500}
        name="projectDescription"
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
            ? "Create project"
            : "Save project"}
      </Button>
    </form>
  );
}
