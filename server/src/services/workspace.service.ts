import { Types } from "mongoose";
import { Workspace } from "../models/workspace.model.js";
import { CreateWorkspaceInput } from "../validators/workspace.validator.js";
import  ApiError  from "../utils/ApiError.js";

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