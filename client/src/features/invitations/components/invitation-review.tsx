
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useAcceptInvitationMutation,
  useInvitationPreviewQuery,
  useRejectInvitationMutation,
} from "@/features/invitations/hooks/use-invitation-queries";
import { useAppSelector } from "@/store/hooks";
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

  const authStatus = useAppSelector((state) => state.auth.status);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const returnTo = `/invitations/${encodeURIComponent(token)}`;

  const previewQuery = useInvitationPreviewQuery(token);
  const acceptMutation = useAcceptInvitationMutation(token);
  const rejectMutation = useRejectInvitationMutation(token);
  const logoutMutation = useLogoutMutation(returnTo);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace(
        `/signup?returnTo=${encodeURIComponent(returnTo)}`,
      );
    }
  }, [authStatus, returnTo, router]);

  const invitedEmail = previewQuery.data?.email?.trim().toLowerCase();
  const currentEmail = currentUser?.email?.trim().toLowerCase();

  const emailMatches =
    Boolean(invitedEmail) &&
    Boolean(currentEmail) &&
    invitedEmail === currentEmail;

  if (authStatus === "idle" || authStatus === "loading") {
    return <p className="text-sm text-muted">Checking your account...</p>;
  }

  if (authStatus === "unauthenticated") {
    return <p className="text-sm text-muted">Redirecting to sign up...</p>;
  }

  if (previewQuery.isPending) {
    return <p className="text-sm text-muted">Loading invitation...</p>;
  }

  if (previewQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {previewQuery.error.message}
      </p>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-8">
      <Card className="p-6">
        <h1 className="cs-page-title">
          {workspaceName(previewQuery.data.workspace)}
        </h1>

        <p className="mt-2 text-sm text-muted">
          {invitedByName(previewQuery.data.invitedBy)} invited{" "}
          {previewQuery.data.email} as {previewQuery.data.role}.
        </p>

        {emailMatches ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              disabled={
                acceptMutation.isPending || rejectMutation.isPending
              }
              onClick={() =>
                acceptMutation.mutate(undefined, {
                  onSuccess: () => router.push("/workspaces"),
                })
              }
            >
              {acceptMutation.isPending ? "Accepting..." : "Accept"}
            </Button>

            <Button
              disabled={
                acceptMutation.isPending || rejectMutation.isPending
              }
              onClick={() => rejectMutation.mutate()}
              variant="secondary"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        ) : (
          
<div className="mt-5 space-y-3">
  <p className="text-sm text-destructive">
    This invitation was sent to {previewQuery.data.email}.
    You are logged in with a different email address.
  </p>

  <Button
    disabled={logoutMutation.isPending}
    onClick={() => logoutMutation.mutate()}
  >
    {logoutMutation.isPending
      ? "Switching account..."
      : "Switch account"}
  </Button>

  {logoutMutation.error ? (
    <p className="text-sm text-destructive">
      {logoutMutation.error.message}
    </p>
  ) : null}
</div>

        )}

        {acceptMutation.error ? (
          <p className="mt-3 text-sm text-destructive">
            {acceptMutation.error.message}
          </p>
        ) : null}

        {rejectMutation.error ? (
          <p className="mt-3 text-sm text-destructive">
            {rejectMutation.error.message}
          </p>
        ) : null}
      </Card>
    </main>
  );
}
