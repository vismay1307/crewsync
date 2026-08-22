"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { taskService } from "@/features/tasks/services/task.service";
import type {
  CreateTaskRequest,
  GetTasksParams,
  UpdateTaskRequest,
} from "@/features/tasks/types/task.types";

export const tasksQueryKey = (
  workspaceId: string,
  projectId: string,
  params: GetTasksParams = {}
) => ["tasks", workspaceId, projectId, params] as const;

export const taskQueryKey = (taskId: string) => ["task", taskId] as const;

export function useTasksQuery(
  workspaceId: string,
  projectId: string,
  params: GetTasksParams = {}
) {
  return useQuery({
    queryKey: tasksQueryKey(workspaceId, projectId, params),
    queryFn: () => taskService.list(workspaceId, projectId, params),
    enabled: Boolean(workspaceId && projectId),
    staleTime: 10_000,
  });
}

export function useTaskQuery(workspaceId: string, projectId: string, taskId: string) {
  return useQuery({
    queryKey: taskQueryKey(taskId),
    queryFn: () => taskService.get(workspaceId, projectId, taskId),
    enabled: Boolean(workspaceId && projectId && taskId),
    staleTime: 10_000,
  });
}

export function useCreateTaskMutation(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) =>
      taskService.create(workspaceId, projectId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    },
  });
}

export function useUpdateTaskMutation(workspaceId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskRequest) =>
      taskService.update(workspaceId, projectId, taskId, data),
    onSuccess: (task) => {
      queryClient.setQueryData(taskQueryKey(taskId), task);
      void queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    },
  });
}

export function useTaskActionMutations(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  const invalidate = (taskId: string) => {
    void queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    void queryClient.invalidateQueries({ queryKey: taskQueryKey(taskId) });
  };

  return {
    archive: useMutation({
      mutationFn: (taskId: string) => taskService.archive(workspaceId, projectId, taskId),
      onSuccess: (_, taskId) => invalidate(taskId),
    }),
    restore: useMutation({
      mutationFn: (taskId: string) => taskService.restore(workspaceId, projectId, taskId),
      onSuccess: (_, taskId) => invalidate(taskId),
    }),
    delete: useMutation({
      mutationFn: (taskId: string) => taskService.delete(workspaceId, projectId, taskId),
      onSuccess: (_, taskId) => invalidate(taskId),
    }),
    removeDueDate: useMutation({
      mutationFn: (taskId: string) => taskService.removeDueDate(workspaceId, projectId, taskId),
      onSuccess: (_, taskId) => invalidate(taskId),
    }),
  };
}
