import { WorkspaceSettingsForm } from "@/features/workspaces/components/workspace-settings-form";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="cs-page">
      <div className="cs-page-header">
        <h1 className="cs-page-title">Workspace settings</h1>
        <p className="cs-page-description">Settings use the backend workspace settings endpoint.</p>
      </div>
      <WorkspaceSettingsForm workspaceId={workspaceId} />
    </main>
  );
}
