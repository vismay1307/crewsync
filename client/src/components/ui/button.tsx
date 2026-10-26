"use client";

import type { ComponentProps } from "react";

import { cn } from "../../lib/api/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = ComponentProps<"button"> & {
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-primary-foreground enabled:hover:bg-primary/90 enabled:active:bg-primary/80",
  secondary:
    "border-border-strong bg-card text-foreground enabled:hover:bg-surface-highlight",
  ghost:
    "border-transparent bg-transparent text-muted enabled:hover:bg-surface-highlight enabled:hover:text-foreground",
  danger:
    "border-destructive/30 bg-destructive/10 text-destructive enabled:hover:bg-destructive/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  icon: "h-9 w-9 p-0",
};

export function Button({
  children,
  className,
  disabled,
  loading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}