import { TaskDetail } from "@/features/tasks/components/task-detail";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string; taskId: string }>;
}) {
  const { projectId, taskId, workspaceId } = await params;

  return <TaskDetail projectId={projectId} taskId={taskId} workspaceId={workspaceId} />;
}
