"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { useAddMemberMutation } from "@/features/members/hooks/use-member-queries";
import type { WorkspaceRole } from "@/types/entities";

export function MemberForm({ workspaceId }: { workspaceId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<WorkspaceRole, "owner">>("member");
  const addMutation = useAddMemberMutation(workspaceId);
  const emailError =
    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Enter a valid email."
      : undefined;
  const canSubmit = email.length > 0 && !emailError && !addMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    addMutation.mutate({ email, role });
  }

  const apiError =
    addMutation.error instanceof ApiError
      ? addMutation.error.message
      : addMutation.error?.message;

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
      <div className="space-y-1.5">
        <label className="block text-sm font-medium" htmlFor="memberRole">
          Role
        </label>
        <select
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          id="memberRole"
          onChange={(event) => setRole(event.target.value as Exclude<WorkspaceRole, "owner">)}
          value={role}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
      <Button disabled={!canSubmit} type="submit">
        {addMutation.isPending ? "Adding" : "Add member"}
      </Button>
    </form>
  );
}
