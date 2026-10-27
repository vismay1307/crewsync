import Link from "next/link";

import { cn } from "@/lib/api/cn";

export function Brand({
  className,
  hideName = false,
  onClick,
}: {
  className?: string;
  hideName?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      className={cn("flex items-center gap-2.5 rounded-lg", className)}
      href="/dashboard"
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        C
      </span>

      <span
        className={
          hideName
            ? "sr-only"
            : "text-base font-semibold tracking-tight text-foreground"
        }
      >
        CrewSync
      </span>
    </Link>
  );
}