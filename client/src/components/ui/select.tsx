"use client";

import { useId, type ComponentProps } from "react";

import { Field, getFieldIds } from "@/components/ui/field";
import { cn } from "@/lib/api/cn";

type SelectProps = ComponentProps<"select"> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Select({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? props.name ?? generatedId;
  const { describedBy } = getFieldIds(selectId, { error, hint });

  const control = (
    <select
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      className={cn("cs-control", className)}
      id={selectId}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <Field error={error} hint={hint} htmlFor={selectId} label={label}>
      {control}
    </Field>
  );
}