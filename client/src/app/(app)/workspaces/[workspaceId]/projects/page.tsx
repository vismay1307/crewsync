import { ProjectForm } from "@/features/projects/components/project-form";
import { ProjectList } from "@/features/projects/components/project-list";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted">Project data is loaded from the workspace projects API.</p>
        </div>
        <ProjectList workspaceId={workspaceId} />
        <div>
          <h2 className="mb-3 text-base font-semibold">Archived</h2>
          <ProjectList archived workspaceId={workspaceId} />
        </div>
      </section>
      <aside className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Create project</h2>
        <ProjectForm mode="create" workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
