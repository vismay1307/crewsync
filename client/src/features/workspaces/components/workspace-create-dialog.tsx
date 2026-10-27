"use client";

import { Dialog } from "@/components/ui/dialog";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";

export function CreateWorkspaceDialog({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  return (
    <Dialog
      description="Workspaces hold your projects, members, and labels."
      onClose={onClose}
      open={open}
      title="Create workspace"
    >
      <WorkspaceForm
        mode="create"
        onCancel={onClose}
        onSuccess={onClose}
      />
    </Dialog>
  );
}