"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateLabelMutation } from "@/features/labels/hooks/use-label-queries";
import { ApiError } from "@/lib/api/client";

function themeColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getPrimaryColorSnapshot() {
  if (typeof document === "undefined") return "";

  return themeColor("--primary");
}

function getServerPrimaryColorSnapshot() {
  return "";
}

function subscribePrimaryColor(listener: () => void) {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributeFilter: ["class"],
    attributes: true,
  });

  return () => observer.disconnect();
}

export function LabelForm({ workspaceId }: { workspaceId: string }) {
  const [name, setName] = useState("");
  const primaryColor = useSyncExternalStore(
    subscribePrimaryColor,
    getPrimaryColorSnapshot,
    getServerPrimaryColorSnapshot
  );
  const [customColor, setCustomColor] = useState<string | null>(null);
  const color = customColor ?? primaryColor;
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
          setCustomColor(null);
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
            className="h-10 w-14 rounded-md border border-border bg-surface-inset p-1"
            disabled={!color}
            id="labelColor"
            onChange={(event) => setCustomColor(event.target.value)}
            type="color"
            value={color}
          />
          <input
            aria-label="Color hex value"
            className="h-10 w-full rounded-md border border-border bg-surface-inset px-3 text-sm text-foreground outline-none transition-all hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20"
            maxLength={7}
            name="color"
            onChange={(event) => setCustomColor(event.target.value)}
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
