"use client";

import { Dialog } from "@/components/ui/dialog";
import { InvitationForm } from "@/features/invitations/components/invitation-form";

/**
 * Invite dialog for the Invitations page.
 * The form only mounts while the dialog is open, so it starts fresh every time.
 * The list refreshes through the existing create mutation's cache invalidation.
 */
export function InviteByEmailDialog({
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
      description="Send an email invitation. They join the workspace once they accept it."
      onClose={onClose}
      open={open}
      title="Invite member"
    >
      <InvitationForm
        onCancel={onClose}
        onSuccess={onClose}
        workspaceId={workspaceId}
      />
    </Dialog>
  );
}