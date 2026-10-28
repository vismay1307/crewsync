"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
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
      <main aria-busy="true" className="min-h-screen bg-background">
        <div className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface p-4 md:block">
          <Skeleton className="h-8 w-32" />
          <div className="mt-8 space-y-2">
            {[0, 1, 2].map((index) => (
              <Skeleton className="h-10 w-full" key={index} />
            ))}
          </div>
        </div>

        <div className="md:pl-64">
          <div className="flex h-16 items-center border-b border-border px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-56 max-w-full" />
          </div>
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>

        <span className="sr-only" role="status">
          Loading your account
        </span>
      </main>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return children;
}