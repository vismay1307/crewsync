"use client";

import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectForm } from "@/features/projects/components/project-form";
import {
  ProjectAvatar,
  ProjectStatusBadge,
} from "@/features/projects/components/project-parts";
import { useProjectQuery } from "@/features/projects/hooks/use-project-queries";

function formatDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ProjectDetailSkeleton() {
  return (
    <div aria-busy="true" className="cs-page">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
      <Skeleton className="h-72 max-w-2xl rounded-xl" />
      <span className="sr-only" role="status">
        Loading project
      </span>
    </div>
  );
}

export function ProjectDetail({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) {
  const projectQuery = useProjectQuery(workspaceId, projectId);

  if (projectQuery.isPending) {
    return <ProjectDetailSkeleton />;
  }

  if (projectQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={projectQuery.isFetching}
            onClick={() => void projectQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {projectQuery.error.message}
      </ErrorAlert>
    );
  }

  const project = projectQuery.data;
  const createdOn = formatDate(project.createdAt);

  return (
    <div className="cs-page">
      <Link
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        href={`/workspaces/${workspaceId}/projects`}
      >
        <FiArrowLeft aria-hidden="true" size={15} />
        Projects
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <ProjectAvatar emoji={project.emoji} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="cs-page-title wrap-break-word">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="cs-page-description mt-1 max-w-2xl">
              {project.description || "No description yet."}
            </p>
            {createdOn ? (
              <p className="mt-2 text-xs text-muted">Created {createdOn}</p>
            ) : null}
          </div>
        </div>

        <Link
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
        >
          Open tasks
          <FiArrowRight aria-hidden="true" size={16} />
        </Link>
      </header>

      <Card className="max-w-2xl" variant="form">
        <CardHeader>
          <CardTitle>Project profile</CardTitle>
          <CardDescription>
            Update the name, emoji, and description of this project.
          </CardDescription>
        </CardHeader>
        <div className="p-5">
          <ProjectForm
            mode="update"
            project={project}
            workspaceId={workspaceId}
          />
        </div>
      </Card>
    </div>
  );
}