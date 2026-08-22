import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { ActivityLogEntry } from "@/types/entities";
import type { GetActivityParams } from "@/features/activity/types/activity.types";

function toQuery(params: GetActivityParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

export const activityService = {
  list(workspaceId: string, params: GetActivityParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<ActivityLogEntry>>(
      `/workspaces/${workspaceId}/activity${query ? `?${query}` : ""}`
    );
  },
};
