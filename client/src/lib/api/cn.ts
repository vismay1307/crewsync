type ClassValue = string | false | null | undefined;

/**
 * Joins class names and skips falsy values.
 * This does not resolve conflicting Tailwind classes.
 */
export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}