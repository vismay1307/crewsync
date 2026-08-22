import { WorkspaceSettingsForm } from "@/features/workspaces/components/workspace-settings-form";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Workspace settings</h1>
        <p className="mt-1 text-sm text-muted">Settings use the backend workspace settings endpoint.</p>
      </div>
      <WorkspaceSettingsForm workspaceId={workspaceId} />
    </main>
  );
}
