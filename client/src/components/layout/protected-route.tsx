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
      <main className="min-h-screen bg-background p-6">
        <div className="h-6 w-36 rounded-md bg-border" />
        <div className="mt-5 max-w-xl rounded-lg border border-border bg-card p-5">
          <div className="h-4 w-48 rounded-md bg-border" />
          <div className="mt-4 h-10 rounded-md bg-background" />
        </div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return children;
}
