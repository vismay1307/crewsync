"use client";

import Link from "next/link";
import { use, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "@/features/members/components/member-invite-dialog";
import { MemberList } from "@/features/members/components/member-list";

export default function MembersPage({
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
          <h1 className="cs-page-title">Members</h1>
          <p className="cs-page-description">
            Everyone with access to this workspace, and the role they hold.
            New people join by accepting an email invitation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className="cs-link-button h-10"
            href={`/workspaces/${workspaceId}/invitations`}
          >
            View invitations
          </Link>
          <Button onClick={() => setInviteOpen(true)}>
            <FiPlus aria-hidden="true" size={16} />
            Invite member
          </Button>
        </div>
      </header>

      <MemberList
        onInvite={() => setInviteOpen(true)}
        workspaceId={workspaceId}
      />

      <InviteMemberDialog
        onClose={() => setInviteOpen(false)}
        open={inviteOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}