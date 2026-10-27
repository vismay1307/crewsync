"use client";

import { type FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/api/cn";
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/features/workspaces/hooks/use-workspace-queries";
import type { Workspace } from "@/types/entities";

export function WorkspaceForm({
  mode,
  onCancel,
  onSuccess,
  workspace,
}: {
  mode: "create" | "update";
  onCancel?: () => void;
  onSuccess?: () => void;
  workspace?: Workspace;
}) {
  const [name, setName] = useState(workspace?.name ?? "");
  const [description, setDescription] = useState(
    workspace?.description ?? "",
  );
  const [visibility, setVisibility] = useState<"private" | "public">(
    workspace?.visibility ?? "public",
  );

  const createMutation = useCreateWorkspaceMutation();
  const updateMutation = useUpdateWorkspaceMutation(workspace?._id ?? "");

  const mutation =
    mode === "create" ? createMutation : updateMutation;

  const nameError = useMemo(() => {
    if (!name) return undefined;

    if (name.trim().length < 3) {
      return "Workspace name must be at least 3 characters.";
    }

    if (name.trim().length > 100) {
      return "Workspace name cannot exceed 100 characters.";
    }

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

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      visibility,
    };

    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => {
          setName("");
          setDescription("");
          setVisibility("public");
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
        error={nameError}
        hint={nameError ? undefined : "3 to 100 characters."}
        label="Workspace name"
        name="workspaceName"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />

      <Textarea
        className="min-h-24"
        hint="Optional. Up to 500 characters."
        label="Description"
        maxLength={500}
        name="workspaceDescription"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />

      <Select
        label="Visibility"
        name="workspaceVisibility"
        onChange={(event) =>
          setVisibility(event.target.value as "private" | "public")
        }
        value={visibility}
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
      </Select>

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
              ? "Create workspace"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}