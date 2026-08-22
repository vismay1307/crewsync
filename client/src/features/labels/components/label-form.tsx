"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateLabelMutation } from "@/features/labels/hooks/use-label-queries";
import { ApiError } from "@/lib/api/client";

export function LabelForm({ workspaceId }: { workspaceId: string }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#64748b");
  const [description, setDescription] = useState("");
  const createMutation = useCreateLabelMutation(workspaceId);
  const canSubmit =
    name.trim().length > 0 &&
    name.trim().length <= 50 &&
    description.trim().length <= 250 &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) &&
    !createMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    createMutation.mutate(
      {
        name,
        color,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          setName("");
          setColor("#64748b");
          setDescription("");
        },
      }
    );
  }

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error?.message;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Label name"
        maxLength={50}
        name="name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium" htmlFor="labelColor">
          Color
        </label>
        <div className="flex gap-3">
          <input
            className="h-10 w-14 rounded-md border border-border bg-card p-1"
            id="labelColor"
            onChange={(event) => setColor(event.target.value)}
            type="color"
            value={color}
          />
          <input
            aria-label="Color hex value"
            className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            maxLength={7}
            name="color"
            onChange={(event) => setColor(event.target.value)}
            value={color}
          />
        </div>
      </div>
      <Input
        label="Description"
        maxLength={250}
        name="description"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />
      {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
      <Button disabled={!canSubmit} type="submit">
        {createMutation.isPending ? "Creating" : "Create label"}
      </Button>
    </form>
  );
}
