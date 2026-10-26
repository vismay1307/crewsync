import type { ReactNode } from "react";

type FieldMessages = {
  error?: string;
  hint?: string;
};

export function getFieldIds(
  id: string,
  { error, hint }: FieldMessages,
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy =
    [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return { describedBy, errorId, hintId };
}

export function Field({
  children,
  error,
  hint,
  htmlFor,
  label,
}: FieldMessages & {
  children: ReactNode;
  htmlFor: string;
  label: string;
}) {
  const { errorId, hintId } = getFieldIds(htmlFor, {
    error,
    hint,
  });

  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-medium text-foreground"
        htmlFor={htmlFor}
      >
        {label}
      </label>

      {children}

      {hint ? (
        <p className="text-xs leading-5 text-muted" id={hintId}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}