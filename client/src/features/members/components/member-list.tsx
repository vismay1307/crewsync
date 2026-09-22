"use client";

import { FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
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
      <Card className="p-5" variant="empty">
        <h2 className="cs-section-title">No members found</h2>
        <p className="mt-1 text-sm leading-6 text-muted">Members returned by the backend will appear here.</p>
      </Card>
    );
  }

  return (
    <Card variant="list">
      {membersQuery.data.items.map((member) => (
        <div className="cs-row grid gap-3 p-4 transition-colors sm:grid-cols-[minmax(0,1fr)_160px_110px] sm:items-center" key={member._id}>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-foreground">{userName(member.user)}</h2>
            <p className="mt-1 truncate text-sm text-muted">{userEmail(member.user)}</p>
          </div>
          <Select
            className="h-9"
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
          </Select>
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
    </Card>
  );
}
