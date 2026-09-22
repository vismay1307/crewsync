"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border-primary/70 bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(66,217,200,0.18)] hover:border-primary hover:bg-primary/90 disabled:hover:bg-primary",
  secondary:
    "border-border bg-surface-raised text-foreground hover:border-border-strong hover:bg-surface-highlight disabled:hover:bg-surface-raised",
  ghost:
    "border-transparent bg-transparent text-muted hover:bg-primary/10 hover:text-foreground disabled:hover:bg-transparent",
  danger:
    "border-destructive/50 bg-destructive/12 text-destructive hover:bg-destructive/18 disabled:hover:bg-destructive/12",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold tracking-normal outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55 ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
