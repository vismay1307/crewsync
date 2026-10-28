"use client";

import { Dialog } from "@/components/ui/dialog";
import { LabelForm } from "@/features/labels/components/label-form";

/**
 * Create-label dialog for the Labels page.
 * The form only mounts while the dialog is open, so it starts fresh every time.
 * The list refreshes through the existing create mutation's cache invalidation.
 */
export function CreateLabelDialog({
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
      description="Labels can be added to tasks to group and filter them."
      onClose={onClose}
      open={open}
      title="Create label"
    >
      <LabelForm
        onCancel={onClose}
        onSuccess={onClose}
        workspaceId={workspaceId}
      />
    </Dialog>
  );
}