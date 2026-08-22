import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { WorkspaceMember } from "@/types/entities";
import type {
  AddWorkspaceMemberRequest,
  GetMembersParams,
  UpdateWorkspaceMemberRequest,
} from "@/features/members/types/member.types";

function toQuery(params: GetMembersParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  return query.toString();
}

export const memberService = {
  list(workspaceId: string, params: GetMembersParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members${query ? `?${query}` : ""}`
    );
  },

  add(workspaceId: string, data: AddWorkspaceMemberRequest) {
    return apiClient.post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, data);
  },

  update(workspaceId: string, memberId: string, data: UpdateWorkspaceMemberRequest) {
    return apiClient.patch<WorkspaceMember>(
      `/workspaces/${workspaceId}/members/${memberId}`,
      data
    );
  },

  remove(workspaceId: string, memberId: string) {
    return apiClient.delete<null>(`/workspaces/${workspaceId}/members/${memberId}`);
  },
};
