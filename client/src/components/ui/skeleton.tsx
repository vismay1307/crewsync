import type { ComponentProps } from "react";

import { cn } from "@/lib/api/cn";

export function Skeleton({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-surface-highlight",
        className,
      )}
      {...props}
    />
  );
}