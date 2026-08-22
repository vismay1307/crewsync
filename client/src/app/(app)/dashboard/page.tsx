"use client";

import Link from "next/link";

import { useWorkspacesQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const workspacesQuery = useWorkspacesQuery();

  return (
    <main className="space-y-5">
      <section>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Signed in as {currentUser?.firstName} {currentUser?.lastName}.
        </p>
      </section>
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Workspaces</h2>
            <p className="mt-1 text-sm text-muted">
              {workspacesQuery.isSuccess
                ? `${workspacesQuery.data.length} workspace records available from the backend.`
                : "Workspace records load from the backend."}
            </p>
          </div>
          <Link
            className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-background"
            href="/workspaces"
          >
            Manage
          </Link>
        </div>
      </section>
    </main>
  );
}
