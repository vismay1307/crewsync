"use client";

import { useId, type ComponentProps } from "react";

import { Field, getFieldIds } from "@/components/ui/field";
import { cn } from "@/lib/api/cn";

type TextareaProps = ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Textarea({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? props.name ?? generatedId;
  const { describedBy } = getFieldIds(textareaId, { error, hint });

  const control = (
    <textarea
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      className={cn("cs-textarea", className)}
      id={textareaId}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <Field error={error} hint={hint} htmlFor={textareaId} label={label}>
      {control}
    </Field>
  );
}