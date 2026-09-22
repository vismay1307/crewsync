import { ActivityList } from "@/features/activity/components/activity-list";

export default async function WorkspaceActivityPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="cs-page">
      <div className="cs-page-header">
        <h1 className="cs-page-title">Activity</h1>
        <p className="cs-page-description">Workspace audit trail from the backend activity log.</p>
      </div>
      <ActivityList workspaceId={workspaceId} />
    </main>
  );
}
