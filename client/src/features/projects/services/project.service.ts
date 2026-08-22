import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { Project } from "@/types/entities";
import type {
  CreateProjectRequest,
  GetProjectsParams,
  UpdateProjectRequest,
} from "@/features/projects/types/project.types";

function toQuery(params: GetProjectsParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  return query.toString();
}

export const projectService = {
  list(workspaceId: string, params: GetProjectsParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<Project>>(
      `/workspaces/${workspaceId}/projects${query ? `?${query}` : ""}`
    );
  },

  get(workspaceId: string, projectId: string) {
    return apiClient.get<Project>(`/workspaces/${workspaceId}/projects/${projectId}`);
  },

  create(workspaceId: string, data: CreateProjectRequest) {
    return apiClient.post<Project>(`/workspaces/${workspaceId}/projects`, data);
  },

  update(workspaceId: string, projectId: string, data: UpdateProjectRequest) {
    return apiClient.patch<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}`,
      data
    );
  },

  archive(workspaceId: string, projectId: string) {
    return apiClient.post<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}/archive`
    );
  },

  restore(workspaceId: string, projectId: string) {
    return apiClient.post<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}/restore`
    );
  },

  delete(workspaceId: string, projectId: string) {
    return apiClient.delete<null>(`/workspaces/${workspaceId}/projects/${projectId}`);
  },
};
