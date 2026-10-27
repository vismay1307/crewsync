import Link from "next/link";

import { WorkspaceSettingsForm } from "@/features/workspaces/components/workspace-settings-form";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="cs-page">
      <div className="space-y-4">
        <Link
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          href={`/workspaces/${workspaceId}`}
        >
          <span aria-hidden="true">←</span>
          Back to workspace
        </Link>

        <header className="cs-page-header">
          <h1 className="cs-page-title">Workspace settings</h1>

          <p className="cs-page-description">
            Manage the timezone, default invitation role, and color theme for
            this workspace.
          </p>
        </header>
      </div>

      <WorkspaceSettingsForm workspaceId={workspaceId} />
    </div>
  );
}