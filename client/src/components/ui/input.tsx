"use client";

import { useId, type ComponentProps } from "react";

import { Field, getFieldIds } from "@/components/ui/field";
import { cn } from "@/lib/api/cn";

type InputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const { describedBy } = getFieldIds(inputId, { error, hint });

  return (
    <Field error={error} hint={hint} htmlFor={inputId} label={label}>
      <input
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn("cs-control", className)}
        id={inputId}
        {...props}
      />
    </Field>
  );
}