"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { invitationService } from "@/features/invitations/services/invitation.service";
import type {
  CreateInvitationRequest,
  GetInvitationsParams,
} from "@/features/invitations/types/invitation.types";

export const invitationsQueryKey = (
  workspaceId: string,
  params: GetInvitationsParams = {}
) => ["invitations", workspaceId, params] as const;

export const invitationPreviewQueryKey = (token: string) =>
  ["invitation-preview", token] as const;

export function useInvitationsQuery(workspaceId: string, params: GetInvitationsParams = {}) {
  return useQuery({
    queryKey: invitationsQueryKey(workspaceId, params),
    queryFn: () => invitationService.list(workspaceId, params),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

export function useCreateInvitationMutation(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvitationRequest) => invitationService.create(workspaceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invitations", workspaceId] });
    },
  });
}

export function useInvitationActionMutations(workspaceId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["invitations", workspaceId] });
  };

  return {
    cancel: useMutation({
      mutationFn: (invitationId: string) => invitationService.cancel(workspaceId, invitationId),
      onSuccess: invalidate,
    }),
    resend: useMutation({
      mutationFn: (invitationId: string) => invitationService.resend(workspaceId, invitationId),
      onSuccess: invalidate,
    }),
  };
}

export function useInvitationPreviewQuery(token: string) {
  return useQuery({
    queryKey: invitationPreviewQueryKey(token),
    queryFn: () => invitationService.preview(token),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useAcceptInvitationMutation(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => invitationService.accept(token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invitationPreviewQueryKey(token) });
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useRejectInvitationMutation(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => invitationService.reject(token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invitationPreviewQueryKey(token) });
    },
  });
}
