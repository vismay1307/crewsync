"use client";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-xl rounded-lg border border-border bg-card p-5">
      <h1 className="text-base font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <Button className="mt-4" onClick={reset} variant="secondary">
        Try again
      </Button>
    </main>
  );
}
