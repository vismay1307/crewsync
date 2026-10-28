"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Select } from "@/components/ui/select";
import {
  MemberAvatar,
  MemberRowSkeleton,
  PendingBadge,
  RoleBadge,
  memberEmail,
  memberName,
} from "@/features/members/components/member-parts";
import {
  useMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberMutation,
} from "@/features/members/hooks/use-member-queries";
import type { WorkspaceRole } from "@/types/entities";

export function MemberList({
  onInvite,
  workspaceId,
}: {
  onInvite?: () => void;
  workspaceId: string;
}) {
  const membersQuery = useMembersQuery(workspaceId, { limit: 50 });
  const updateMutation = useUpdateMemberMutation(workspaceId);
  const removeMutation = useRemoveMemberMutation(workspaceId);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const anyPending = updateMutation.isPending || removeMutation.isPending;
  const actionError = updateMutation.error ?? removeMutation.error;

  function clearActionErrors() {
    updateMutation.reset();
    removeMutation.reset();
  }

  function cancelRemove() {
    setConfirmingId(null);
    clearActionErrors();
  }

  function confirmRemove(memberId: string) {
    removeMutation.mutate(memberId, {
      onSuccess: () => setConfirmingId(null),
    });
  }

  if (membersQuery.isPending) {
    return (
      <Card aria-busy="true" variant="list">
        {[0, 1, 2].map((index) => (
          <MemberRowSkeleton key={index} />
        ))}
        <span className="sr-only" role="status">
          Loading members
        </span>
      </Card>
    );
  }

  if (membersQuery.isError) {
    return (
      <ErrorAlert
        action={
          <Button
            loading={membersQuery.isFetching}
            onClick={() => void membersQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            Try again
          </Button>
        }
      >
        {membersQuery.error.message}
      </ErrorAlert>
    );
  }

  if (!membersQuery.data.items.length) {
    return (
      <Card className="p-6" variant="empty">
        <p className="cs-section-title">No members found</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Invite people to this workspace to see them listed here.
        </p>
        {onInvite ? (
          <Button className="mt-4" onClick={onInvite}>
            Invite member
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {actionError ? (
        <ErrorAlert>Could not update the member. {actionError.message}</ErrorAlert>
      ) : null}

      <Card variant="list">
        <ul>
          {membersQuery.data.items.map((member) => {
            const name = memberName(member.user);
            const email = memberEmail(member.user);
            const isOwner = member.role === "owner";
            const confirming = confirmingId === member._id;
            const removing =
              removeMutation.isPending && removeMutation.variables === member._id;

            return (
              <li
                className="cs-row flex flex-wrap items-center gap-x-4 gap-y-3 p-4"
                key={member._id}
              >
                <MemberAvatar user={member.user} />

                <div className="min-w-0 flex-1 basis-56">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {name}
                    </p>
                    {member.status === "pending" ? <PendingBadge /> : null}
                  </div>
                  {email ? (
                    <p className="mt-0.5 truncate text-sm text-muted">{email}</p>
                  ) : null}
                </div>

                <div
                  className="flex shrink-0 items-center gap-2"
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && confirming && !removing) {
                      cancelRemove();
                    }
                  }}
                >
                  {confirming ? (
                    <>
                      <span className="hidden text-sm text-muted sm:inline">
                        Remove from workspace?
                      </span>
                      <Button
                        disabled={removing}
                        onClick={cancelRemove}
                        size="sm"
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        aria-label={`Confirm remove ${name}`}
                        loading={removing}
                        onClick={() => confirmRemove(member._id)}
                        size="sm"
                        variant="danger"
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex w-36 items-center">
                        {isOwner ? (
                          <RoleBadge role={member.role} />
                        ) : (
                          <Select
                            aria-label={`Role for ${name}`}
                            className="h-9"
                            disabled={anyPending}
                            onChange={(event) => {
                              clearActionErrors();
                              updateMutation.mutate({
                                memberId: member._id,
                                data: { role: event.target.value as WorkspaceRole },
                              });
                            }}
                            value={member.role}
                          >
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                          </Select>
                        )}
                      </div>

                      {isOwner ? (
                        <span aria-hidden="true" className="hidden h-9 w-24 sm:block" />
                      ) : (
                        <Button
                          aria-label={`Remove ${name}`}
                          className="w-24"
                          disabled={anyPending}
                          onClick={() => {
                            clearActionErrors();
                            setConfirmingId(member._id);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <FiTrash2 aria-hidden="true" size={15} />
                          Remove
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}