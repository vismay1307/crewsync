"use client";

import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl py-8">
      <Card className="p-6">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-lg bg-destructive/10 text-destructive"
        >
          <FiAlertTriangle size={18} />
        </span>

        <h1 className="cs-section-title mt-4 text-lg">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          This page could not be loaded. You can try again, or go back to the
          dashboard.
        </p>

        {error.message ? (
          <p className="mt-4 break-words rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
            {error.message}
          </p>
        ) : null}
        {error.digest ? (
          <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link className="cs-link-button h-10" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}