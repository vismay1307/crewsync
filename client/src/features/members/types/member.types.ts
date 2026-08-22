import type { WorkspaceRole } from "@/types/entities";

export type GetMembersParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type AddWorkspaceMemberRequest = {
  email: string;
  role: WorkspaceRole;
};

export type UpdateWorkspaceMemberRequest = {
  role: WorkspaceRole;
};
