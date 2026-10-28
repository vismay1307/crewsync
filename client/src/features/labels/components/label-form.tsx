"use client";

import { type FormEvent, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LabelChip } from "@/features/labels/components/label-parts";
import { useCreateLabelMutation } from "@/features/labels/hooks/use-label-queries";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/api/cn";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

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

export function LabelForm({
  onCancel,
  onSuccess,
  workspaceId,
}: {
  onCancel?: () => void;
  onSuccess?: () => void;
  workspaceId: string;
}) {
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
  const colorValid = HEX_COLOR.test(color);
  const colorError =
    color && !colorValid ? "Enter a hex color such as #496EA9." : undefined;
  const canSubmit =
    name.trim().length > 0 &&
    name.trim().length <= 50 &&
    description.trim().length <= 250 &&
    colorValid &&
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
          onSuccess?.();
        },
      }
    );
  }

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error?.message;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        hint="Up to 50 characters."
        label="Label name"
        maxLength={50}
        name="name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />

      <Field error={colorError} htmlFor="labelColor" label="Color">
        <div className="flex gap-3">
          <input
            className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border-strong bg-surface-inset p-1 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!color}
            id="labelColor"
            onChange={(event) => setCustomColor(event.target.value)}
            type="color"
            value={color}
          />
          <input
            aria-describedby={colorError ? "labelColor-error" : undefined}
            aria-invalid={colorError ? true : undefined}
            aria-label="Color hex value"
            className="cs-control font-mono"
            maxLength={7}
            name="color"
            onChange={(event) => setCustomColor(event.target.value)}
            value={color}
          />
        </div>
      </Field>

      <Input
        hint="Optional. Up to 250 characters."
        label="Description"
        maxLength={250}
        name="description"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />

      {name.trim() && colorValid ? (
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>Preview</span>
          <LabelChip color={color} name={name.trim()} />
        </div>
      ) : null}

      {apiError ? <ErrorAlert>{apiError}</ErrorAlert> : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 pt-1",
          onCancel ? "justify-end" : "justify-start",
        )}
      >
        {onCancel ? (
          <Button
            disabled={createMutation.isPending}
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          disabled={!canSubmit}
          loading={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Creating" : "Create label"}
        </Button>
      </div>
    </form>
  );
}