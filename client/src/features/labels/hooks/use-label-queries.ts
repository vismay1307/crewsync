"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { labelService } from "@/features/labels/services/label.service";
import type {
  CreateLabelRequest,
  GetLabelsParams,
  UpdateLabelRequest,
} from "@/features/labels/types/label.types";

export const labelsQueryKey = (
  workspaceId: string,
  params: GetLabelsParams = {}
) => ["labels", workspaceId, params] as const;

export function useLabelsQuery(workspaceId: string, params: GetLabelsParams = {}) {
  return useQuery({
    queryKey: labelsQueryKey(workspaceId, params),
    queryFn: () => labelService.list(workspaceId, params),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

export function useCreateLabelMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabelRequest) => labelService.create(workspaceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["labels", workspaceId] });
    },
  });
}

export function useUpdateLabelMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ labelId, data }: { labelId: string; data: UpdateLabelRequest }) =>
      labelService.update(workspaceId, labelId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["labels", workspaceId] });
    },
  });
}

export function useDeleteLabelMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelId: string) => labelService.delete(workspaceId, labelId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["labels", workspaceId] });
    },
  });
}
