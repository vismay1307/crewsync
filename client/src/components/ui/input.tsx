"use client";

import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({
  className = "",
  error,
  id,
  label,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-invalid={error ? "true" : "false"}
        className={`h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        id={inputId}
        {...props}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
