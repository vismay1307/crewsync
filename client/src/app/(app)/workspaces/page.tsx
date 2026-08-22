import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";

export default function WorkspacesPage() {
  return (
    <main className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Workspaces</h1>
          <p className="mt-1 text-sm text-muted">Create and manage backend-backed workspaces.</p>
        </div>
        <WorkspaceList />
      </section>
      <aside className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Create workspace</h2>
        <WorkspaceForm mode="create" />
      </aside>
    </main>
  );
}
