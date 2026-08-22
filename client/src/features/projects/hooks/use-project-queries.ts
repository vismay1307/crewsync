"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { projectService } from "@/features/projects/services/project.service";
import type {
  CreateProjectRequest,
  GetProjectsParams,
  UpdateProjectRequest,
} from "@/features/projects/types/project.types";

export const projectsQueryKey = (
  workspaceId: string,
  params: GetProjectsParams = {}
) => ["projects", workspaceId, params] as const;

export const projectQueryKey = (projectId: string) => ["project", projectId] as const;

export function useProjectsQuery(workspaceId: string, params: GetProjectsParams = {}) {
  return useQuery({
    queryKey: projectsQueryKey(workspaceId, params),
    queryFn: () => projectService.list(workspaceId, params),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

export function useProjectQuery(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: projectQueryKey(projectId),
    queryFn: () => projectService.get(workspaceId, projectId),
    enabled: Boolean(workspaceId && projectId),
    staleTime: 30_000,
  });
}

export function useCreateProjectMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.create(workspaceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}

export function useUpdateProjectMutation(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) =>
      projectService.update(workspaceId, projectId, data),
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueryKey(projectId), project);
      void queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}

export function useArchiveProjectMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.archive(workspaceId, projectId),
    onSuccess: (_, projectId) => {
      void queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      void queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
    },
  });
}

export function useRestoreProjectMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.restore(workspaceId, projectId),
    onSuccess: (_, projectId) => {
      void queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      void queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
    },
  });
}

export function useDeleteProjectMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.delete(workspaceId, projectId),
    onSuccess: (_, projectId) => {
      void queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      void queryClient.removeQueries({ queryKey: projectQueryKey(projectId) });
    },
  });
}
