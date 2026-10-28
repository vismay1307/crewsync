"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth-mutations";
import { AuthAlert, AuthCard } from "@/features/auth/components/auth-card";
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

function LoadingLines() {
  return (
    <div aria-busy="true" className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
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
    return (
      <AuthCard subtitle="Checking your account." title="Workspace invitation">
        <LoadingLines />
      </AuthCard>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <AuthCard
        subtitle="Redirecting you to sign up so you can accept it."
        title="Workspace invitation"
      >
        <LoadingLines />
      </AuthCard>
    );
  }

  if (rejectMutation.isSuccess) {
    return (
      <AuthCard
        subtitle={
          previewQuery.data
            ? `You declined the invitation to ${workspaceName(previewQuery.data.workspace)}.`
            : "You declined this invitation."
        }
        title="Invitation declined"
      >
        <Link
          className="cs-link-button h-10 w-full"
          href="/dashboard"
        >
          Go to dashboard
        </Link>
      </AuthCard>
    );
  }

  if (previewQuery.isPending) {
    return (
      <AuthCard subtitle="Loading the invitation details." title="Workspace invitation">
        <LoadingLines />
      </AuthCard>
    );
  }

  if (previewQuery.isError) {
    return (
      <AuthCard
        subtitle="This invitation could not be opened."
        title="Invitation unavailable"
      >
        <div className="space-y-4">
          <AuthAlert>{previewQuery.error.message}</AuthAlert>
          <Link className="cs-link-button h-10 w-full" href="/dashboard">
            Go to dashboard
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      subtitle={`${invitedByName(previewQuery.data.invitedBy)} invited ${previewQuery.data.email} as ${previewQuery.data.role}.`}
      title={`Join ${workspaceName(previewQuery.data.workspace)}`}
    >
      <div className="space-y-4">
        {emailMatches ? (
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={
                acceptMutation.isPending || rejectMutation.isPending
              }
              loading={acceptMutation.isPending}
              onClick={() =>
                acceptMutation.mutate(undefined, {
                  onSuccess: () => router.push("/workspaces"),
                })
              }
            >
              {acceptMutation.isPending ? "Accepting" : "Accept invitation"}
            </Button>

            <Button
              disabled={
                acceptMutation.isPending || rejectMutation.isPending
              }
              loading={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
              variant="secondary"
            >
              {rejectMutation.isPending ? "Rejecting" : "Reject"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AuthAlert>
              This invitation was sent to {previewQuery.data.email}. You are
              logged in with a different email address.
            </AuthAlert>

            <Button
              disabled={logoutMutation.isPending}
              loading={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              {logoutMutation.isPending
                ? "Switching account"
                : "Switch account"}
            </Button>

            {logoutMutation.error ? (
              <AuthAlert>{logoutMutation.error.message}</AuthAlert>
            ) : null}
          </div>
        )}

        {acceptMutation.error ? (
          <AuthAlert>{acceptMutation.error.message}</AuthAlert>
        ) : null}

        {rejectMutation.error ? (
          <AuthAlert>{rejectMutation.error.message}</AuthAlert>
        ) : null}
      </div>
    </AuthCard>
  );
}