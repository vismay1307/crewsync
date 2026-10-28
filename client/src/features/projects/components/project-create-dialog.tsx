"use client";

import { Dialog } from "@/components/ui/dialog";
import { ProjectForm } from "@/features/projects/components/project-form";

export function CreateProjectDialog({
  onClose,
  open,
  workspaceId,
}: {
  onClose: () => void;
  open: boolean;
  workspaceId: string;
}) {
  return (
    <Dialog
      description="Projects group the tasks for one piece of work."
      onClose={onClose}
      open={open}
      title="Create project"
    >
      <ProjectForm
        mode="create"
        onCancel={onClose}
        onSuccess={onClose}
        workspaceId={workspaceId}
      />
    </Dialog>
  );
}