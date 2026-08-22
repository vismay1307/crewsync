"use client";

import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  useMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberMutation,
} from "@/features/members/hooks/use-member-queries";
import type { User, WorkspaceRole } from "@/types/entities";

function userName(user: string | User) {
  if (typeof user === "string") return user;
  return `${user.firstName} ${user.lastName}`;
}

function userEmail(user: string | User) {
  return typeof user === "string" ? "" : user.email;
}

export function MemberList({ workspaceId }: { workspaceId: string }) {
  const membersQuery = useMembersQuery(workspaceId, { limit: 50 });
  const updateMutation = useUpdateMemberMutation(workspaceId);
  const removeMutation = useRemoveMemberMutation(workspaceId);

  if (membersQuery.isPending) {
    return <p className="text-sm text-muted">Loading members</p>;
  }

  if (membersQuery.isError) {
    return <p className="text-sm text-destructive">{membersQuery.error.message}</p>;
  }

  if (!membersQuery.data.items.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">No members found</h2>
        <p className="mt-1 text-sm text-muted">Members returned by the backend will appear here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {membersQuery.data.items.map((member) => (
        <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_160px_110px] sm:items-center" key={member._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{userName(member.user)}</h2>
            <p className="mt-1 truncate text-sm text-muted">{userEmail(member.user)}</p>
          </div>
          <select
            className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            disabled={member.role === "owner" || updateMutation.isPending}
            onChange={(event) =>
              updateMutation.mutate({
                memberId: member._id,
                data: { role: event.target.value as WorkspaceRole },
              })
            }
            value={member.role}
          >
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <Button
            disabled={member.role === "owner" || removeMutation.isPending}
            onClick={() => removeMutation.mutate(member._id)}
            variant="ghost"
          >
            <FiTrash2 size={15} />
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
