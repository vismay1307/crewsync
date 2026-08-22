"use client";

import { useLogoutMutation } from "@/features/auth/hooks/use-auth-mutations";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const status = useAppSelector((state) => state.auth.status);
  const logoutMutation = useLogoutMutation();

  if (!initialized || status === "loading") {
    return (
      <main className="min-h-screen bg-background p-6 text-sm text-muted">
        Loading session
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main className="min-h-screen bg-background p-6 text-sm text-muted">
        You are not authenticated.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted">
              Signed in as {currentUser?.firstName} {currentUser?.lastName}.
            </p>
          </div>
          <Button
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            variant="secondary"
          >
            {logoutMutation.isPending ? "Logging out" : "Logout"}
          </Button>
        </div>
      </section>
    </main>
  );
}
