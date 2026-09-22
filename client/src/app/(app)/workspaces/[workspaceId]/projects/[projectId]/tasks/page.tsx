import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { projectId, workspaceId } = await params;

  return (
    <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="space-y-5">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Tasks</h1>
          <p className="cs-page-description">Tasks use the backend paginated project task endpoint.</p>
        </div>
        <TaskList projectId={projectId} workspaceId={workspaceId} />
        <div>
          <h2 className="mb-3 cs-section-title">Archived</h2>
          <TaskList archived projectId={projectId} workspaceId={workspaceId} />
        </div>
      </section>
      <aside className="cs-form-card p-5">
        <h2 className="mb-4 cs-section-title">Create task</h2>
        <TaskForm mode="create" projectId={projectId} workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
