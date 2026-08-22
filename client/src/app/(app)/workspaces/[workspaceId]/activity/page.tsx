import { ActivityList } from "@/features/activity/components/activity-list";

export default async function WorkspaceActivityPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Activity</h1>
        <p className="mt-1 text-sm text-muted">Workspace audit trail from the backend activity log.</p>
      </div>
      <ActivityList workspaceId={workspaceId} />
    </main>
  );
}
