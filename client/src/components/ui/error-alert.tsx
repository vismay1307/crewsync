import type { ReactNode } from "react";

import { cn } from "@/lib/api/cn";

export function ErrorAlert({
  action,
  children,
  className,
}: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive",
        className,
      )}
      role="alert"
    >
      <p>{children}</p>
      {action}
    </div>
  );
}