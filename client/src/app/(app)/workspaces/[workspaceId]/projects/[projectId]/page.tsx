import { ProjectDetail } from "@/features/projects/components/project-detail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { projectId, workspaceId } = await params;

  return <ProjectDetail projectId={projectId} workspaceId={workspaceId} />;
}
