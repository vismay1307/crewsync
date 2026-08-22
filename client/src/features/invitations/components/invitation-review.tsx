"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  useAcceptInvitationMutation,
  useInvitationPreviewQuery,
  useRejectInvitationMutation,
} from "@/features/invitations/hooks/use-invitation-queries";
import type { User, Workspace } from "@/types/entities";

function workspaceName(workspace: string | Workspace) {
  return typeof workspace === "string" ? "Workspace" : workspace.name;
}

function invitedByName(user: string | User) {
  if (typeof user === "string") return "A workspace admin";
  return `${user.firstName} ${user.lastName}`;
}

export function InvitationReview({ token }: { token: string }) {
  const router = useRouter();
  const previewQuery = useInvitationPreviewQuery(token);
  const acceptMutation = useAcceptInvitationMutation(token);
  const rejectMutation = useRejectInvitationMutation(token);

  if (previewQuery.isPending) {
    return <p className="text-sm text-muted">Loading invitation</p>;
  }

  if (previewQuery.isError) {
    return <p className="text-sm text-destructive">{previewQuery.error.message}</p>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-8">
      <section className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">{workspaceName(previewQuery.data.workspace)}</h1>
        <p className="mt-2 text-sm text-muted">
          {invitedByName(previewQuery.data.invitedBy)} invited {previewQuery.data.email} as{" "}
          {previewQuery.data.role}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            disabled={acceptMutation.isPending || rejectMutation.isPending}
            onClick={() =>
              acceptMutation.mutate(undefined, {
                onSuccess: () => router.push("/workspaces"),
              })
            }
          >
            {acceptMutation.isPending ? "Accepting" : "Accept"}
          </Button>
          <Button
            disabled={acceptMutation.isPending || rejectMutation.isPending}
            onClick={() => rejectMutation.mutate()}
            variant="secondary"
          >
            {rejectMutation.isPending ? "Rejecting" : "Reject"}
          </Button>
        </div>
        {acceptMutation.error ? (
          <p className="mt-3 text-sm text-destructive">{acceptMutation.error.message}</p>
        ) : null}
        {rejectMutation.error ? (
          <p className="mt-3 text-sm text-destructive">{rejectMutation.error.message}</p>
        ) : null}
      </section>
    </main>
  );
}
