import { Types } from "mongoose";
import { Workspace } from "../models/workspace.model.js";
import {UpdateWorkspaceInput, CreateWorkspaceInput } from "../validators/workspace.validator.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import  ApiError  from "../utils/ApiError.js";
import { createActivity } from "./activity.service.js";

export const createWorkspace = async (
  data: CreateWorkspaceInput,
  ownerId: Types.ObjectId
) => {
  const existingWorkspace = await Workspace.findOne({
    owner: ownerId,
    name: data.name,
    isDeleted: false,
  });

  if (existingWorkspace) {
    throw new ApiError(409, "Workspace with this name already exists.");
  } 

  const workspace = await Workspace.create({
  name: data.name,
  description: data.description,
  visibility: data.visibility,
  owner: ownerId,
});

await WorkspaceMember.create({
  workspace: workspace._id,
  user: ownerId,
  role: "owner",
  status: "accepted",
  invitedBy: ownerId,
});

await createActivity({
  workspace: workspace._id,
  actor: ownerId,
  action: "workspace.created",
  resourceType: "Workspace",
  resourceId: workspace._id,
  metadata: { name: workspace.name },
});

return workspace;
};

export const getWorkspaces = async (
  ownerId: Types.ObjectId
) => {
  const workspaces = await Workspace.find({
    owner: ownerId,
    isDeleted: false,
  }).sort({
    createdAt: -1,
  });

  return workspaces;
};

export const getWorkspaceById = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  return workspace;
};

export const updateWorkspace = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: UpdateWorkspaceInput
) => {

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (data.name && data.name !== workspace.name) {

   const existingWorkspace = await Workspace.findOne({
  owner: workspace.owner,
  name: data.name,
  isDeleted: false,
});

    if (existingWorkspace) {
      throw new ApiError(
        409,
        "Workspace with this name already exists"
      );
    }
  }

  Object.assign(workspace, data);

  await workspace.save();

  await createActivity({
    workspace: workspace._id,
    actor: ownerId,
    action: "workspace.updated",
    resourceType: "Workspace",
    resourceId: workspace._id,
    metadata: data,
  });

  return workspace;
};

export const deleteWorkspace = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  workspace.isDeleted = true;
  workspace.deletedAt = new Date();

  await workspace.save();

  await createActivity({
    workspace: workspace._id,
    actor: ownerId,
    action: "workspace.updated",
    resourceType: "Workspace",
    resourceId: workspace._id,
    metadata: { isDeleted: true },
  });
};
