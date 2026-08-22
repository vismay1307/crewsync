"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:hover:bg-primary",
  secondary:
    "border-border bg-card text-foreground hover:bg-background disabled:hover:bg-card",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-card disabled:hover:bg-transparent",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
