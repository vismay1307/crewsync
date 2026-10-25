
"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { useCreateInvitationMutation } from "@/features/invitations/hooks/use-invitation-queries";
import type { WorkspaceRole } from "@/types/entities";

type InviteRole = Exclude<WorkspaceRole, "owner">;

export function MemberForm({ workspaceId }: { workspaceId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("member");
  const [successMessage, setSuccessMessage] = useState("");

  const invitationMutation = useCreateInvitationMutation(workspaceId);

  const emailError =
    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Enter a valid email."
      : undefined;

  const canSubmit =
    email.trim().length > 0 &&
    !emailError &&
    !invitationMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setSuccessMessage("");

    invitationMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        role,
      },
      {
        onSuccess: () => {
          setSuccessMessage(
            "Invitation sent successfully. The user will become a workspace member after accepting it."
          );
          setEmail("");
          setRole("member");
        },
      }
    );
  }

  const apiError =
    invitationMutation.error instanceof ApiError
      ? invitationMutation.error.message
      : invitationMutation.error?.message;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={emailError}
        label="User email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        value={email}
      />

      <Select
        label="Role"
        name="memberRole"
        onChange={(event) => setRole(event.target.value as InviteRole)}
        value={role}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </Select>

      {apiError ? (
        <p className="text-sm text-destructive">{apiError}</p>
      ) : null}

      {successMessage ? (
        <p className="text-sm text-green-700">{successMessage}</p>
      ) : null}

      <Button disabled={!canSubmit} type="submit">
        {invitationMutation.isPending ? "Sending invitation..." : "Send invitation"}
      </Button>
    </form>
  );
}
