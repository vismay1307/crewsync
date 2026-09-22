"use client";

import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspacesQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const workspacesQuery = useWorkspacesQuery();
  const workspaces = workspacesQuery.data ?? [];
  const recentWorkspaces = workspaces.slice(0, 5);

  return (
    <main className="cs-page">
      <section className="cs-page-header">
        <h1 className="cs-page-title">Dashboard</h1>
        <p className="cs-page-description">
          Signed in as {currentUser?.firstName} {currentUser?.lastName}.
        </p>
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Recent workspaces</CardTitle>
              <CardDescription>
                {workspacesQuery.isSuccess
                  ? `${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"} available.`
                  : "Workspace records load from the backend."}
              </CardDescription>
            </div>
            <Link className="cs-link-button" href="/workspaces">
              Manage
            </Link>
          </CardHeader>
          <div>
            {workspacesQuery.isPending ? (
              <p className="p-5 text-sm text-muted">Loading workspaces</p>
            ) : null}
            {workspacesQuery.isError ? (
              <p className="p-5 text-sm text-destructive">{workspacesQuery.error.message}</p>
            ) : null}
            {workspacesQuery.isSuccess && recentWorkspaces.length === 0 ? (
              <div className="m-5 cs-empty">
                <h3 className="cs-section-title">No workspaces yet</h3>
                <p className="mt-1 text-sm leading-6 text-muted">Create a workspace to start organizing projects.</p>
              </div>
            ) : null}
            {recentWorkspaces.map((workspace) => (
              <Link
                className="cs-row flex items-center justify-between gap-4 p-4 transition-colors"
                href={`/workspaces/${workspace._id}`}
                key={workspace._id}
              >
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-foreground">{workspace.name}</h3>
                  <p className="mt-1 truncate text-sm text-muted">
                    {workspace.description || workspace.visibility || "Workspace"}
                  </p>
                </div>
                <span className="cs-meta-pill shrink-0">{workspace.visibility || "Workspace"}</span>
              </Link>
            ))}
          </div>
        </Card>
        <aside className="cs-form-card p-5">
          <h2 className="cs-section-title">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link className="cs-link-button justify-start" href="/workspaces">
              Create workspace
            </Link>
            {recentWorkspaces[0] ? (
              <Link
                className="cs-link-button justify-start"
                href={`/workspaces/${recentWorkspaces[0]._id}/projects`}
              >
                Open projects
              </Link>
            ) : null}
          </div>
        </aside>
      </section>
      <section className="cs-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="cs-section-title">Backend data only</h2>
            <p className="mt-1 text-sm text-muted">
              This dashboard summarizes real workspace records already loaded through TanStack Query.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
