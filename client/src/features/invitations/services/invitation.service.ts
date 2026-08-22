import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { WorkspaceInvitation, WorkspaceMember } from "@/types/entities";
import type {
  CreateInvitationRequest,
  GetInvitationsParams,
} from "@/features/invitations/types/invitation.types";

function toQuery(params: GetInvitationsParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

const invitationsPath = (workspaceId: string) => `/workspaces/${workspaceId}/invitations`;

export const invitationService = {
  list(workspaceId: string, params: GetInvitationsParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<WorkspaceInvitation>>(
      `${invitationsPath(workspaceId)}${query ? `?${query}` : ""}`
    );
  },

  create(workspaceId: string, data: CreateInvitationRequest) {
    return apiClient.post<WorkspaceInvitation>(invitationsPath(workspaceId), data);
  },

  cancel(workspaceId: string, invitationId: string) {
    return apiClient.patch<WorkspaceInvitation>(
      `${invitationsPath(workspaceId)}/${invitationId}/cancel`
    );
  },

  resend(workspaceId: string, invitationId: string) {
    return apiClient.post<WorkspaceInvitation>(
      `${invitationsPath(workspaceId)}/${invitationId}/resend`
    );
  },

  preview(token: string) {
    return apiClient.get<WorkspaceInvitation>(`/invitations/${token}/preview`);
  },

  accept(token: string) {
    return apiClient.post<WorkspaceMember>(`/invitations/${token}/accept`);
  },

  reject(token: string) {
    return apiClient.post<WorkspaceInvitation>(`/invitations/${token}/reject`);
  },
};
