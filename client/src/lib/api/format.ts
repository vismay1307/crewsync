const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
});

function parseDate(value?: string | null): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string | null): string | null {
  const date = parseDate(value);
  return date ? dateFormat.format(date) : null;
}

export function formatDateTime(value?: string | null): string | null {
  const date = parseDate(value);
  return date ? dateTimeFormat.format(date) : null;
}

export function formatTime(value?: string | null): string | null {
  const date = parseDate(value);
  return date ? timeFormat.format(date) : null;
}

/**
 * Turns backend keys into readable text:
 * "task.restored" -> "Task restored", "WorkspaceInvitation" -> "Workspace invitation".
 */
export function humanizeKey(value: string): string {
  const spaced = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .trim()
    .toLowerCase();

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** "Today", "Yesterday", or the date, based on the viewer's local day. */
export function getDayLabel(value?: string | null): string {
  const date = parseDate(value);
  if (!date) return "Unknown date";

  const startOfDay = (input: Date) =>
    new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime();
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return dateFormat.format(date);
}