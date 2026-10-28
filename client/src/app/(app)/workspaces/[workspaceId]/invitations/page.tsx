"use client";

import { use, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { InviteByEmailDialog } from "@/features/invitations/components/invitation-invite-dialog";
import { InvitationList } from "@/features/invitations/components/invitation-list";

export default function WorkspaceInvitationsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="cs-page">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="cs-page-header">
          <h1 className="cs-page-title">Invitations</h1>
          <p className="cs-page-description">
            Track the invitations you have sent. Pending ones can be resent or
            cancelled until they are accepted.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <FiPlus aria-hidden="true" size={16} />
          Invite member
        </Button>
      </header>

      <InvitationList
        onInvite={() => setInviteOpen(true)}
        workspaceId={workspaceId}
      />

      <InviteByEmailDialog
        onClose={() => setInviteOpen(false)}
        open={inviteOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}