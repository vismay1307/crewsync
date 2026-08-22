"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { commentService } from "@/features/comments/services/comment.service";
import type {
  CreateCommentRequest,
  GetCommentsParams,
  UpdateCommentRequest,
} from "@/features/comments/types/comment.types";

export const commentsQueryKey = (taskId: string, params: GetCommentsParams = {}) =>
  ["comments", taskId, params] as const;

export function useCommentsQuery(
  workspaceId: string,
  projectId: string,
  taskId: string,
  params: GetCommentsParams = {}
) {
  return useQuery({
    queryKey: commentsQueryKey(taskId, params),
    queryFn: () => commentService.list(workspaceId, projectId, taskId, params),
    enabled: Boolean(workspaceId && projectId && taskId),
    staleTime: 10_000,
  });
}

export function useCreateCommentMutation(workspaceId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      commentService.create(workspaceId, projectId, taskId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}

export function useUpdateCommentMutation(workspaceId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentRequest }) =>
      commentService.update(workspaceId, projectId, taskId, commentId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}

export function useDeleteCommentMutation(workspaceId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.delete(workspaceId, projectId, taskId, commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
