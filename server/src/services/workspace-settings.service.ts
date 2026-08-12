import { Types } from "mongoose";

import { Workspace } from "../models/workspace.model.js";
import ApiError from "../utils/ApiError.js";
import { createActivity } from "./activity.service.js";

interface UpdateWorkspaceSettingsInput {
  logo?: string;
  description?: string;
  timezone?: string;
  defaultRole?: "admin" | "member";
  visibility?: "private" | "public";
  colorTheme?: string;
}

export const getWorkspaceSettings = async (
  workspaceId: Types.ObjectId
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  }).select(
    "logo description timezone defaultRole visibility colorTheme"
  );

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  return workspace;
};

export const updateWorkspaceSettings = async (
  workspaceId: Types.ObjectId,
  userId: Types.ObjectId,
  data: UpdateWorkspaceSettingsInput
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  Object.assign(workspace, data);
  await workspace.save();

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "workspace.settings_updated",
    resourceType: "Workspace",
    resourceId: workspace._id,
    metadata: { ...data },
  });

  return getWorkspaceSettings(workspaceId);
};
