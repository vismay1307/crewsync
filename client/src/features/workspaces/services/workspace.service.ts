import { apiClient } from "@/lib/api/client";
import type { Workspace } from "@/types/entities";
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  UpdateWorkspaceSettingsRequest,
  WorkspaceSettings,
} from "@/features/workspaces/types/workspace.types";

export const workspaceService = {
  list() {
    return apiClient.get<Workspace[]>("/workspaces");
  },

  get(workspaceId: string) {
    return apiClient.get<Workspace>(`/workspaces/${workspaceId}`);
  },

  create(data: CreateWorkspaceRequest) {
    return apiClient.post<Workspace>("/workspaces", data);
  },

  update(workspaceId: string, data: UpdateWorkspaceRequest) {
    return apiClient.patch<Workspace>(`/workspaces/${workspaceId}`, data);
  },

  delete(workspaceId: string) {
    return apiClient.delete<null>(`/workspaces/${workspaceId}`);
  },

  getSettings(workspaceId: string) {
    return apiClient.get<WorkspaceSettings>(`/workspaces/${workspaceId}/settings`);
  },

  updateSettings(workspaceId: string, data: UpdateWorkspaceSettingsRequest) {
    return apiClient.patch<WorkspaceSettings>(
      `/workspaces/${workspaceId}/settings`,
      data
    );
  },
};
