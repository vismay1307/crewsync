import type { Workspace } from "@/types/entities";

export type WorkspaceVisibility = "private" | "public";

export type CreateWorkspaceRequest = {
  name: string;
  description?: string;
  logo?: string;
  visibility?: WorkspaceVisibility;
};

export type UpdateWorkspaceRequest = Partial<CreateWorkspaceRequest>;

export type WorkspaceSettings = Pick<
  Workspace,
  "_id" | "description" | "logo" | "visibility"
> & {
  timezone?: string;
  defaultRole?: "admin" | "member";
  colorTheme?: string;
};

export type UpdateWorkspaceSettingsRequest = Partial<
  Omit<WorkspaceSettings, "_id">
>;
