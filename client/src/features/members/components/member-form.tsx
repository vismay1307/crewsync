"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateInvitationMutation } from "@/features/invitations/hooks/use-invitation-queries";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/api/cn";
import type { WorkspaceRole } from "@/types/entities";

type InviteRole = Exclude<WorkspaceRole, "owner">;

export function MemberForm({
  onCancel,
  workspaceId,
}: {
  onCancel?: () => void;
  workspaceId: string;
}) {
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
    <form className="space-y-5" onSubmit={handleSubmit}>
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

      {apiError ? <ErrorAlert>{apiError}</ErrorAlert> : null}

      {successMessage ? (
        <p
          className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm leading-5 text-success"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 pt-1",
          onCancel ? "justify-end" : "justify-start",
        )}
      >
        {onCancel ? (
          <Button
            disabled={invitationMutation.isPending}
            onClick={onCancel}
            variant="secondary"
          >
            {successMessage ? "Done" : "Cancel"}
          </Button>
        ) : null}
        <Button
          disabled={!canSubmit}
          loading={invitationMutation.isPending}
          type="submit"
        >
          {invitationMutation.isPending ? "Sending invitation" : "Send invitation"}
        </Button>
      </div>
    </form>
  );
}