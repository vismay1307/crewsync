"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateInvitationMutation } from "@/features/invitations/hooks/use-invitation-queries";
import { ApiError } from "@/lib/api/client";
import type { WorkspaceRole } from "@/types/entities";

export function InvitationForm({ workspaceId }: { workspaceId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<WorkspaceRole, "owner">>("member");
  const createMutation = useCreateInvitationMutation(workspaceId);
  const canSubmit = /\S+@\S+\.\S+/.test(email) && !createMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    createMutation.mutate(
      { email, role },
      {
        onSuccess: () => setEmail(""),
      }
    );
  }

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error?.message;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        value={email}
      />
      <Select
        label="Role"
        name="invitationRole"
        onChange={(event) => setRole(event.target.value as Exclude<WorkspaceRole, "owner">)}
        value={role}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </Select>
      {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
      <Button disabled={!canSubmit} type="submit">
        {createMutation.isPending ? "Sending" : "Send invitation"}
      </Button>
    </form>
  );
}
