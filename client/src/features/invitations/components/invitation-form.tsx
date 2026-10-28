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

export function InvitationForm({
  onCancel,
  onSuccess,
  workspaceId,
}: {
  onCancel?: () => void;
  onSuccess?: () => void;
  workspaceId: string;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<WorkspaceRole, "owner">>("member");
  const createMutation = useCreateInvitationMutation(workspaceId);
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const emailError = email && !emailValid ? "Enter a valid email." : undefined;
  const canSubmit = emailValid && !createMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    createMutation.mutate(
      { email, role },
      {
        onSuccess: () => {
          setEmail("");
          onSuccess?.();
        },
      }
    );
  }

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error?.message;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        error={emailError}
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

      {apiError ? <ErrorAlert>{apiError}</ErrorAlert> : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 pt-1",
          onCancel ? "justify-end" : "justify-start",
        )}
      >
        {onCancel ? (
          <Button
            disabled={createMutation.isPending}
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          disabled={!canSubmit}
          loading={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Sending" : "Send invitation"}
        </Button>
      </div>
    </form>
  );
}