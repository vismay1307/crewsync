"use client";

import { useState } from "react";
import { FiMail, FiRefreshCw, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  InvitationRowSkeleton,
  InvitationStatusBadge,
  getInvitationTimeline,
} from "@/features/invitations/components/invitation-parts";
import {
  useInvitationActionMutations,
  useInvitationsQuery,
} from "@/features/invitations/hooks/use-invitation-queries";
import { RoleBadge } from "@/features/members/components/member-parts";
import { formatDateTime } from "@/lib/api/format";

export function InvitationList({
  onInvite,
  workspaceId,
}: {
  onInvite?: () => void;
  workspaceId: string;
}) {
  const invitationsQuery = useInvitationsQuery(workspaceId, { limit: 50 });
  const actions = useInvitationActionMutations(workspaceId);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const anyPending = actions.resend.isPending || actions.cancel.isPending;
  const actionError = actions.resend.error ?? actions.cancel.error;

  function clearActionState() {
    actions.resend.reset();
    actions.cancel.reset();
  }

  function cancelConfirm() {
    setConfirmingId(null);
    clearActionState();
  }

  function confirmCancel(invitationId: string) {
    actions.cancel.mutate(invitationId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  if (invitationsQuery.isPending) {
    return (
      <Card aria-busy="true" variant="list">
        {[0, 1, 2].map((index) => (
          <InvitationRowSkeleton key={index} />
        ))}
        <span className="sr-only" role="status">
          Loading invitations
        </span>
      </Card>
    );
  }

  if (invitationsQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={invitationsQuery.isFetching}
            onClick={() => void invitationsQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {invitationsQuery.error.message}
      </ErrorAlert>
    );
  }

  const items = invitationsQuery.data.items;

  if (!items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">No invitations</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Invitations you send to join this workspace will appear here.
        </p>
        {onInvite ? (
          <Button className="mt-4" onClick={onInvite}>
            Invite member
          </Button>
        ) : null}
      </Card>
    );
  }

  const pending = items.filter((invitation) => invitation.status === "pending");
  const history = items.filter((invitation) => invitation.status !== "pending");

  function renderRow(invitation: (typeof items)[number]) {
    const isPending = invitation.status === "pending";
    const confirming = confirmingId === invitation._id;
    const cancelling =
      actions.cancel.isPending && actions.cancel.variables === invitation._id;
    const resending =
      actions.resend.isPending && actions.resend.variables === invitation._id;
    const sentAt = formatDateTime(invitation.createdAt);
    const timeline = getInvitationTimeline(invitation);

    return (
      <li
        className="cs-row flex flex-wrap items-center gap-x-4 gap-y-3 p-4"
        key={invitation._id}
      >
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground"
        >
          <FiMail size={16} />
        </span>

        <div className="min-w-0 flex-1 basis-56">
          <p className="truncate text-sm font-medium text-foreground">
            {invitation.email}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {sentAt ? `Sent ${sentAt}` : null}
            {sentAt && timeline ? " · " : null}
            {timeline}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <RoleBadge role={invitation.role} />
          <InvitationStatusBadge status={invitation.status} />
        </div>

        {isPending ? (
          <div
            className="flex shrink-0 items-center gap-2"
            onKeyDown={(event) => {
              if (event.key === "Escape" && confirming && !cancelling) {
                cancelConfirm();
              }
            }}
          >
            {confirming ? (
              <>
                <span className="hidden text-sm text-muted sm:inline">
                  Cancel this invitation?
                </span>
                <Button
                  disabled={cancelling}
                  onClick={cancelConfirm}
                  size="sm"
                  variant="secondary"
                >
                  Keep
                </Button>
                <Button
                  aria-label={`Confirm cancel invitation for ${invitation.email}`}
                  loading={cancelling}
                  onClick={() => confirmCancel(invitation._id)}
                  size="sm"
                  variant="danger"
                >
                  Cancel invitation
                </Button>
              </>
            ) : (
              <>
                <Button
                  aria-label={`Resend invitation to ${invitation.email}`}
                  disabled={anyPending}
                  loading={resending}
                  onClick={() => {
                    clearActionState();
                    actions.resend.mutate(invitation._id);
                  }}
                  size="icon"
                  title="Resend"
                  variant="ghost"
                >
                  {resending ? null : <FiRefreshCw aria-hidden="true" size={15} />}
                </Button>
                <Button
                  aria-label={`Cancel invitation for ${invitation.email}`}
                  disabled={anyPending}
                  onClick={() => {
                    clearActionState();
                    setConfirmingId(invitation._id);
                  }}
                  size="icon"
                  title="Cancel invitation"
                  variant="ghost"
                >
                  <FiX aria-hidden="true" size={15} />
                </Button>
              </>
            )}
          </div>
        ) : null}
      </li>
    );
  }

  return (
    <div className="space-y-8">
      {actionError ? (
        <ErrorAlert>
          Could not update the invitation. {actionError.message}
        </ErrorAlert>
      ) : null}

      {actions.resend.isSuccess ? (
        <p
          className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm leading-5 text-success"
          role="status"
        >
          Invitation resent.
        </p>
      ) : null}

      <section>
        <h2 className="cs-section-title mb-3">Pending</h2>
        {pending.length ? (
          <Card variant="list">
            <ul>{pending.map(renderRow)}</ul>
          </Card>
        ) : (
          <p className="text-sm text-muted">No pending invitations.</p>
        )}
      </section>

      {history.length ? (
        <section>
          <h2 className="cs-section-title mb-3">History</h2>
          <Card variant="list">
            <ul>{history.map(renderRow)}</ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}