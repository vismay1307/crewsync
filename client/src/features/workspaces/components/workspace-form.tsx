"use client";

import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/features/workspaces/hooks/use-workspace-queries";
import type { Workspace } from "@/types/entities";

export function WorkspaceForm({
  mode,
  workspace,
}: {
  mode: "create" | "update";
  workspace?: Workspace;
}) {
  const [name, setName] = useState(workspace?.name ?? "");
  const [description, setDescription] = useState(workspace?.description ?? "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    workspace?.visibility ?? "private"
  );
  const createMutation = useCreateWorkspaceMutation();
  const updateMutation = useUpdateWorkspaceMutation(workspace?._id ?? "");
  const mutation = mode === "create" ? createMutation : updateMutation;

  const nameError = useMemo(() => {
    if (!name) return undefined;
    if (name.trim().length < 3) return "Workspace name must be at least 3 characters.";
    if (name.trim().length > 100) return "Workspace name cannot exceed 100 characters.";
    return undefined;
  }, [name]);

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
      visibility,
    });
  }

  const apiError =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error?.message;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={nameError}
        label="Workspace name"
        name="workspaceName"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium" htmlFor="workspaceDescription">
          Description
        </label>
        <textarea
          className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          id="workspaceDescription"
          maxLength={500}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium" htmlFor="workspaceVisibility">
          Visibility
        </label>
        <select
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          id="workspaceVisibility"
          onChange={(event) => setVisibility(event.target.value as "private" | "public")}
          value={visibility}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>
      {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
      <Button disabled={!canSubmit} type="submit">
        {mutation.isPending
          ? mode === "create"
            ? "Creating"
            : "Saving"
          : mode === "create"
            ? "Create workspace"
            : "Save changes"}
      </Button>
    </form>
  );
}
