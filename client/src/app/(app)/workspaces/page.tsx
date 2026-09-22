import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";

export default function WorkspacesPage() {
  return (
    <main className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Workspaces</h1>
          <p className="cs-page-description">Create and manage backend-backed workspaces.</p>
        </div>
        <WorkspaceList />
      </section>
      <aside className="cs-form-card p-5">
        <h2 className="mb-4 cs-section-title">Create workspace</h2>
        <WorkspaceForm mode="create" />
      </aside>
    </main>
  );
}
