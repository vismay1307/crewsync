"use client";

import { Dialog } from "@/components/ui/dialog";
import { MemberForm } from "@/features/members/components/member-form";

/**
 * Invite dialog for the Members page. It sends an email invitation; the person
 * becomes a member once they accept. The form only mounts while the dialog is
 * open, so it starts fresh every time.
 */
export function InviteMemberDialog({
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
      <MemberForm onCancel={onClose} workspaceId={workspaceId} />
    </Dialog>
  );
}