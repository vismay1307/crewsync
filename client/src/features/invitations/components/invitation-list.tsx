"use client";

import { FiRefreshCw, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useInvitationActionMutations,
  useInvitationsQuery,
} from "@/features/invitations/hooks/use-invitation-queries";

export function InvitationList({ workspaceId }: { workspaceId: string }) {
  const invitationsQuery = useInvitationsQuery(workspaceId, { limit: 50 });
  const actions = useInvitationActionMutations(workspaceId);

  if (invitationsQuery.isPending) {
    return <p className="text-sm text-muted">Loading invitations</p>;
  }

  if (invitationsQuery.isError) {
    return <p className="text-sm text-destructive">{invitationsQuery.error.message}</p>;
  }

  if (!invitationsQuery.data.items.length) {
    return (
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">No invitations</h2>
        <p className="mt-1 text-sm leading-6 text-muted">Sent workspace invitations appear here.</p>
      </Card>
    );
  }

  return (
    <Card variant="list">
      {invitationsQuery.data.items.map((invitation) => (
        <div className="cs-row grid gap-3 p-4 transition-colors md:grid-cols-[minmax(0,1fr)_120px_120px_120px]" key={invitation._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-foreground">{invitation.email}</h2>
            <p className="mt-1 text-sm text-muted">Expires {new Date(invitation.expiresAt).toLocaleDateString()}</p>
          </div>
          <span className="cs-meta-pill justify-center">{invitation.role}</span>
          <span className="cs-meta-pill justify-center">{invitation.status}</span>
          <div className="flex items-center gap-2">
            <Button
              disabled={actions.resend.isPending || invitation.status !== "pending"}
              onClick={() => actions.resend.mutate(invitation._id)}
              variant="ghost"
            >
              <FiRefreshCw size={15} />
            </Button>
            <Button
              disabled={actions.cancel.isPending || invitation.status !== "pending"}
              onClick={() => actions.cancel.mutate(invitation._id)}
              variant="ghost"
            >
              <FiX size={15} />
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
