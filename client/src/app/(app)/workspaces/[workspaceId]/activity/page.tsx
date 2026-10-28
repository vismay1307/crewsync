import { ActivityList } from "@/features/activity/components/activity-list";

export default async function WorkspaceActivityPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="cs-page">
      <header className="cs-page-header">
        <h1 className="cs-page-title">Activity</h1>
        <p className="cs-page-description">
          A record of what changed in this workspace and who made the change,
          newest first.
        </p>
      </header>
      <ActivityList workspaceId={workspaceId} />
    </div>
  );
}