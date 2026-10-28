"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { WorkspaceSettingsLink } from "@/components/layout/app-shell";
import {
  getWorkspaceNavItems,
  type NavKey,
} from "@/components/layout/nav-config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { VisibilityBadge } from "@/features/workspaces/components/workspace-parts";
import { useWorkspaceQuery } from "@/features/workspaces/hooks/use-workspace-queries";

const SECTION_DESCRIPTIONS: Partial<Record<NavKey, string>> = {
  projects: "Plan and organize the work.",
  members: "See who has access and their roles.",
  labels: "Categorize tasks with colors.",
  invitations: "Invite people and follow up on invites.",
  activity: "Review what changed and who changed it.",
};

function WorkspaceDetailSkeleton() {
  return (
    <div aria-busy="true" className="cs-page">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />

        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton className="h-20 rounded-xl" key={index} />
        ))}
      </div>

      <span className="sr-only" role="status">
        Loading workspace
      </span>
    </div>
  );
}

export function WorkspaceDetail({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const workspaceQuery = useWorkspaceQuery(workspaceId);

  if (workspaceQuery.isPending) {
    return <WorkspaceDetailSkeleton />;
  }

  if (workspaceQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={workspaceQuery.isFetching}
            onClick={() => void workspaceQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {workspaceQuery.error.message}
      </ErrorAlert>
    );
  }

  const workspace = workspaceQuery.data;
  const sections = getWorkspaceNavItems(workspaceId);

  return (
    <div className="cs-page">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span
            aria-hidden="true"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-xl font-semibold text-primary-soft-foreground"
          >
            {workspace.name.trim().charAt(0).toUpperCase() || "W"}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="cs-page-title wrap-break-word">
                {workspace.name}
              </h1>

              <VisibilityBadge visibility={workspace.visibility} />
            </div>

            <p className="cs-page-description mt-1 max-w-2xl">
              {workspace.description || "No description yet."}
            </p>
          </div>
        </div>

        <WorkspaceSettingsLink workspaceId={workspaceId} />
      </header>

      <section>
        <h2 className="cs-section-title mb-3">Explore</h2>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.key}>
                <Link
                  className="group flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:bg-surface-highlight"
                  href={item.href}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground"
                  >
                    <Icon size={16} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {item.label}
                    </span>

                    <span className="mt-0.5 block text-sm leading-5 text-muted">
                      {SECTION_DESCRIPTIONS[item.key]}
                    </span>
                  </span>

                  <FiArrowRight
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                    size={16}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Card className="max-w-2xl" variant="form">
        <CardHeader>
          <CardTitle>Workspace profile</CardTitle>

          <CardDescription>
            Update the name, description, and visibility of this workspace.
          </CardDescription>
        </CardHeader>

        <div className="p-5">
          <WorkspaceForm mode="update" workspace={workspace} />
        </div>
      </Card>
    </div>
  );
}