"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { memberService } from "@/features/members/services/member.service";
import type {
  AddWorkspaceMemberRequest,
  GetMembersParams,
  UpdateWorkspaceMemberRequest,
} from "@/features/members/types/member.types";

export const membersQueryKey = (workspaceId: string, params: GetMembersParams = {}) =>
  ["members", workspaceId, params] as const;

export function useMembersQuery(workspaceId: string, params: GetMembersParams = {}) {
  return useQuery({
    queryKey: membersQueryKey(workspaceId, params),
    queryFn: () => memberService.list(workspaceId, params),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
  });
}

export function useAddMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddWorkspaceMemberRequest) => memberService.add(workspaceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
    },
  });
}

export function useUpdateMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      memberId,
    }: {
      memberId: string;
      data: UpdateWorkspaceMemberRequest;
    }) => memberService.update(workspaceId, memberId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
    },
  });
}

export function useRemoveMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => memberService.remove(workspaceId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
    },
  });
}
