"use client";

import { Dialog } from "@/components/ui/dialog";
import { TaskForm } from "@/features/tasks/components/task-form";

export function CreateTaskDialog({
  onClose,
  open,
  projectId,
  workspaceId,
}: {
  onClose: () => void;
  open: boolean;
  projectId: string;
  workspaceId: string;
}) {
  return (
    <Dialog
      description="Add a task to track work in this project."
      onClose={onClose}
      open={open}
      title="Create task"
    >
      <TaskForm
        mode="create"
        onCancel={onClose}
        onSuccess={onClose}
        projectId={projectId}
        workspaceId={workspaceId}
      />
    </Dialog>
  );
}