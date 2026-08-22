"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { useWorkspacesQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const workspacesQuery = useWorkspacesQuery();
  const workspaces = workspacesQuery.data ?? [];
  const recentWorkspaces = workspaces.slice(0, 5);

  return (
    <main className="space-y-5">
      <section>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Signed in as {currentUser?.firstName} {currentUser?.lastName}.
        </p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-5">
            <div>
              <h2 className="text-base font-semibold">Recent workspaces</h2>
              <p className="mt-1 text-sm text-muted">
                {workspacesQuery.isSuccess
                  ? `${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"} available.`
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
          <div className="divide-y divide-border">
            {workspacesQuery.isPending ? (
              <p className="p-5 text-sm text-muted">Loading workspaces</p>
            ) : null}
            {workspacesQuery.isError ? (
              <p className="p-5 text-sm text-destructive">{workspacesQuery.error.message}</p>
            ) : null}
            {workspacesQuery.isSuccess && recentWorkspaces.length === 0 ? (
              <div className="p-5">
                <h3 className="text-sm font-semibold">No workspaces yet</h3>
                <p className="mt-1 text-sm text-muted">Create a workspace to start organizing projects.</p>
              </div>
            ) : null}
            {recentWorkspaces.map((workspace) => (
              <Link
                className="flex items-center justify-between gap-4 p-4 hover:bg-background"
                href={`/workspaces/${workspace._id}`}
                key={workspace._id}
              >
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{workspace.name}</h3>
                  <p className="mt-1 truncate text-sm text-muted">
                    {workspace.description || workspace.visibility || "Workspace"}
                  </p>
                </div>
                <FiArrowRight className="shrink-0 text-muted" size={16} />
              </Link>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link
              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-background"
              href="/workspaces"
            >
              Create workspace
            </Link>
            {recentWorkspaces[0] ? (
              <Link
                className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-background"
                href={`/workspaces/${recentWorkspaces[0]._id}/projects`}
              >
                Open projects
              </Link>
            ) : null}
          </div>
        </aside>
      </section>
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Backend data only</h2>
            <p className="mt-1 text-sm text-muted">
              This dashboard summarizes real workspace records already loaded through TanStack Query.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
