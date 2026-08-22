import type { ProjectStatus } from "@/types/entities";

export type GetProjectsParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  archived?: boolean;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
  emoji?: string;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  status?: ProjectStatus;
};
