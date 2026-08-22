"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const initialized = useAppSelector((state) => state.auth.initialized);
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (initialized && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [initialized, router, status]);

  if (!initialized || status === "loading") {
    return (
      <main className="min-h-screen bg-background p-6 text-sm text-muted">
        Loading session
      </main>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return children;
}
