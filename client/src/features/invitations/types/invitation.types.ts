import type { WorkspaceRole } from "@/types/entities";

export type GetInvitationsParams = {
  page?: number;
  limit?: number;
};

export type CreateInvitationRequest = {
  email: string;
  role: Exclude<WorkspaceRole, "owner">;
};
