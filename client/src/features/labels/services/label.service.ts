import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { Label } from "@/types/entities";
import type {
  CreateLabelRequest,
  GetLabelsParams,
  UpdateLabelRequest,
} from "@/features/labels/types/label.types";

function toQuery(params: GetLabelsParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  return query.toString();
}

const labelsPath = (workspaceId: string) => `/workspaces/${workspaceId}/labels`;

export const labelService = {
  list(workspaceId: string, params: GetLabelsParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<Label>>(
      `${labelsPath(workspaceId)}${query ? `?${query}` : ""}`
    );
  },

  create(workspaceId: string, data: CreateLabelRequest) {
    return apiClient.post<Label>(labelsPath(workspaceId), data);
  },

  update(workspaceId: string, labelId: string, data: UpdateLabelRequest) {
    return apiClient.patch<Label>(`${labelsPath(workspaceId)}/${labelId}`, data);
  },

  delete(workspaceId: string, labelId: string) {
    return apiClient.delete<null>(`${labelsPath(workspaceId)}/${labelId}`);
  },
};
