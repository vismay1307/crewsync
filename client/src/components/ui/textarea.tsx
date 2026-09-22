"use client";

import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({
  className = "",
  error,
  id,
  label,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;
  const control = (
    <textarea
      aria-invalid={error ? "true" : "false"}
      className={`cs-textarea disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      id={textareaId}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground" htmlFor={textareaId}>
        {label}
      </label>
      {control}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
