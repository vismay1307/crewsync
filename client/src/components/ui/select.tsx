"use client";

import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({
  className = "",
  error,
  id,
  label,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;
  const control = (
    <select
      aria-invalid={error ? "true" : "false"}
      className={`h-10 w-full rounded-md border border-border bg-surface-inset px-3 text-sm text-foreground outline-none transition-all hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      id={selectId}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground" htmlFor={selectId}>
        {label}
      </label>
      {control}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
