import { WorkspaceDetail } from "@/features/workspaces/components/workspace-detail";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return <WorkspaceDetail workspaceId={workspaceId} />;
}
