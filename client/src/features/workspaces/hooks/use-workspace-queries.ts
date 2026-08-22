"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { workspaceService } from "@/features/workspaces/services/workspace.service";
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  UpdateWorkspaceSettingsRequest,
} from "@/features/workspaces/types/workspace.types";

export const workspacesQueryKey = ["workspaces"] as const;

export const workspaceQueryKey = (workspaceId: string) =>
  ["workspace", workspaceId] as const;

export const workspaceSettingsQueryKey = (workspaceId: string) =>
  ["workspace", workspaceId, "settings"] as const;

export function useWorkspacesQuery() {
  return useQuery({
    queryKey: workspacesQueryKey,
    queryFn: workspaceService.list,
    staleTime: 60_000,
  });
}

export function useWorkspaceQuery(workspaceId: string) {
  return useQuery({
    queryKey: workspaceQueryKey(workspaceId),
    queryFn: () => workspaceService.get(workspaceId),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
  });
}

export function useWorkspaceSettingsQuery(workspaceId: string) {
  return useQuery({
    queryKey: workspaceSettingsQueryKey(workspaceId),
    queryFn: () => workspaceService.getSettings(workspaceId),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
  });
}

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => workspaceService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}

export function useUpdateWorkspaceMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceRequest) =>
      workspaceService.update(workspaceId, data),
    onSuccess: (workspace) => {
      queryClient.setQueryData(workspaceQueryKey(workspaceId), workspace);
      void queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}

export function useDeleteWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceService.delete(workspaceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}

export function useUpdateWorkspaceSettingsMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceSettingsRequest) =>
      workspaceService.updateSettings(workspaceId, data),
    onSuccess: (settings) => {
      queryClient.setQueryData(workspaceSettingsQueryKey(workspaceId), settings);
      void queryClient.invalidateQueries({ queryKey: workspaceQueryKey(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  });
}
