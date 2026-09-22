import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "form" | "list" | "empty";
};

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "cs-card",
  form: "cs-form-card",
  list: "cs-list",
  empty: "cs-empty",
};

export function Card({
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  return <div className={`${variantClasses[variant]} ${className}`} {...props} />;
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-b border-border px-5 py-4 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`cs-section-title ${className}`} {...props} />;
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`mt-1 text-sm leading-6 text-muted ${className}`} {...props} />;
}
