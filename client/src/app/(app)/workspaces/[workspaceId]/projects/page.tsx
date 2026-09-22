import { ProjectForm } from "@/features/projects/components/project-form";
import { ProjectList } from "@/features/projects/components/project-list";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Projects</h1>
          <p className="cs-page-description">Project data is loaded from the workspace projects API.</p>
        </div>
        <ProjectList workspaceId={workspaceId} />
        <div>
          <h2 className="mb-3 cs-section-title">Archived</h2>
          <ProjectList archived workspaceId={workspaceId} />
        </div>
      </section>
      <aside className="cs-form-card p-5">
        <h2 className="mb-4 cs-section-title">Create project</h2>
        <ProjectForm mode="create" workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
