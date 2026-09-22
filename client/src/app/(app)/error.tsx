"use client";

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
    <Card className="max-w-xl p-5">
      <h1 className="cs-section-title">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <Button className="mt-4" onClick={reset} variant="secondary">
        Try again
      </Button>
    </Card>
  );
}
