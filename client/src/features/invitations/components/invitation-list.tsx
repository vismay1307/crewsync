"use client";

import { FiRefreshCw, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";
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
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">No invitations</h2>
        <p className="mt-1 text-sm text-muted">Sent workspace invitations appear here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {invitationsQuery.data.items.map((invitation) => (
        <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_120px_120px_120px]" key={invitation._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{invitation.email}</h2>
            <p className="mt-1 text-sm text-muted">Expires {new Date(invitation.expiresAt).toLocaleDateString()}</p>
          </div>
          <span className="text-sm text-muted">{invitation.role}</span>
          <span className="text-sm text-muted">{invitation.status}</span>
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
    </div>
  );
}
