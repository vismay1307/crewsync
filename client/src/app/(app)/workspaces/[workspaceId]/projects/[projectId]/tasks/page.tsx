import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { projectId, workspaceId } = await params;

  return (
    <main className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="mt-1 text-sm text-muted">Tasks use the backend paginated project task endpoint.</p>
        </div>
        <TaskList projectId={projectId} workspaceId={workspaceId} />
        <div>
          <h2 className="mb-3 text-base font-semibold">Archived</h2>
          <TaskList archived projectId={projectId} workspaceId={workspaceId} />
        </div>
      </section>
      <aside className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold">Create task</h2>
        <TaskForm mode="create" projectId={projectId} workspaceId={workspaceId} />
      </aside>
    </main>
  );
}
