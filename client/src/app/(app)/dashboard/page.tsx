"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiActivity,
  FiChevronRight,
  FiFolder,
  FiPlus,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { CreateWorkspaceDialog } from "@/features/workspaces/components/workspace-create-dialog";
import {
  VisibilityBadge,
  WorkspaceAvatar,
  WorkspaceRowSkeleton,
} from "@/features/workspaces/components/workspace-parts";
import { useWorkspacesQuery } from "@/features/workspaces/hooks/use-workspace-queries";
import { useAppSelector } from "@/store/hooks";

const WORKSPACE_LIMIT = 5;

export default function DashboardPage() {
  const currentUser = useAppSelector(
    (state) => state.auth.currentUser,
  );

  const activeWorkspaceId = useAppSelector(
    (state) => state.ui.activeWorkspaceId,
  );

  const workspacesQuery = useWorkspacesQuery();
  const [createOpen, setCreateOpen] = useState(false);

  const workspaces = workspacesQuery.data ?? [];
  const shownWorkspaces = workspaces.slice(0, WORKSPACE_LIMIT);

  const activeWorkspaceName =
    workspaces.find(
      (workspace) => workspace._id === activeWorkspaceId,
    )?.name ?? "Selected workspace";

  let workspaceSummary = "Loading your workspaces.";

  if (workspacesQuery.isSuccess) {
    workspaceSummary =
      workspaces.length > WORKSPACE_LIMIT
        ? `Showing ${WORKSPACE_LIMIT} of ${workspaces.length} workspaces.`
        : `${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"}.`;
  } else if (workspacesQuery.isError) {
    workspaceSummary = "Your workspaces could not be loaded.";
  }

  return (
    <div className="cs-page">
      <header className="cs-page-header">
        <h1 className="cs-page-title">
          {currentUser?.firstName
            ? `Welcome back, ${currentUser.firstName}`
            : "Welcome back"}
        </h1>

        <p className="cs-page-description">
          Open a workspace to pick up where you left off, or start a new one.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        {/* Your workspaces */}
        <Card variant="list">
          <CardHeader className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle>Your workspaces</CardTitle>
              <CardDescription>{workspaceSummary}</CardDescription>
            </div>

            <Link
              className="cs-link-button shrink-0"
              href="/workspaces"
            >
              View all
            </Link>
          </CardHeader>

          {workspacesQuery.isPending ? (
            <div aria-busy="true">
              {[0, 1, 2].map((index) => (
                <WorkspaceRowSkeleton key={index} />
              ))}

              <span className="sr-only" role="status">
                Loading workspaces
              </span>
            </div>
          ) : null}

          {workspacesQuery.isError ? (
            <div className="p-4">
              <ErrorAlert
                action={
                  <Button
                    loading={workspacesQuery.isFetching}
                    onClick={() => void workspacesQuery.refetch()}
                    size="sm"
                    variant="secondary"
                  >
                    Try again
                  </Button>
                }
              >
                {workspacesQuery.error.message}
              </ErrorAlert>
            </div>
          ) : null}

          {workspacesQuery.isSuccess && workspaces.length === 0 ? (
            <div className="p-5">
              <div className="cs-empty">
                <h3 className="cs-section-title">No workspaces yet</h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-muted">
                  Create your first workspace to start organizing projects
                  and tasks with your team.
                </p>

                <Button
                  className="mt-4"
                  onClick={() => setCreateOpen(true)}
                >
                  <FiPlus aria-hidden="true" size={16} />
                  Create your first workspace
                </Button>
              </div>
            </div>
          ) : null}

          {shownWorkspaces.length > 0 ? (
            <ul>
              {shownWorkspaces.map((workspace) => (
                <li className="cs-row" key={workspace._id}>
                  <Link
                    className="flex items-center gap-4 p-4 focus-visible:-outline-offset-2"
                    href={`/workspaces/${workspace._id}`}
                  >
                    <WorkspaceAvatar name={workspace.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {workspace.name}
                      </p>

                      <p className="mt-1 line-clamp-1 text-sm text-muted">
                        {workspace.description || "No description"}
                      </p>
                    </div>

                    <span className="hidden sm:block">
                      <VisibilityBadge visibility={workspace.visibility} />
                    </span>

                    <FiChevronRight
                      aria-hidden="true"
                      className="shrink-0 text-muted"
                      size={16}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        {/* Quick actions */}
        <Card className="p-5">
          <h2 className="cs-section-title">Quick actions</h2>

          <div className="mt-4 grid gap-2">
            <Button
              className="w-full justify-start"
              onClick={() => setCreateOpen(true)}
              size="sm"
            >
              <FiPlus aria-hidden="true" size={16} />
              Create workspace
            </Button>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            {activeWorkspaceId ? (
              <>
                <p className="mb-2 truncate text-xs font-medium text-muted">
                  {activeWorkspaceName}
                </p>

                <div className="grid gap-2">
                  <Link
                    className="cs-link-button w-full justify-start"
                    href={`/workspaces/${activeWorkspaceId}/projects`}
                  >
                    <FiFolder aria-hidden="true" size={15} />
                    Projects
                  </Link>

                  <Link
                    className="cs-link-button w-full justify-start"
                    href={`/workspaces/${activeWorkspaceId}/activity`}
                  >
                    <FiActivity aria-hidden="true" size={15} />
                    Activity
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm leading-6 text-muted">
                Choose a workspace from the selector at the top to see
                shortcuts to its projects and activity here.
              </p>
            )}
          </div>
        </Card>
      </div>

      <CreateWorkspaceDialog
        onClose={() => setCreateOpen(false)}
        open={createOpen}
      />
    </div>
  );
}