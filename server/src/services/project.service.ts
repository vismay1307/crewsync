import { Types } from "mongoose";

import { Project } from "../models/project.models.js";
import { Workspace } from "../models/workspace.model.js";

import  ApiError  from "../utils/ApiError.js";

import { CreateProjectInput,UpdateProjectInput } from "../validators/project.validators.js";

export const createProject = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: CreateProjectInput
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const existingProject = await Project.findOne({
    workspace: workspaceId,
    name: data.name,
    isDeleted: false,
  });

  if (existingProject) {
    throw new ApiError(
      409,
      "Project with this name already exists"
    );
  }

  const project = await Project.create({
    ...data,
    workspace: workspaceId,
    owner: ownerId,
  });

  return project;
};

export const getProjects = async (
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

  const projects = await Project.find({
    workspace: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  return projects;
};

export const getProjectById = async (
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {

  const project = await Project.findOne({
    _id: projectId,
    owner: ownerId,
    isDeleted: false,
  })
    .populate("workspace", "name emoji")
    .populate(
      "owner",
      "firstName lastName email avatar"
    );

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  return project;
};
export const updateProject = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: UpdateProjectInput
) => {

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (
    data.name &&
    data.name !== project.name
  ) {

    const existingProject =
      await Project.findOne({
        workspace: workspaceId,
        name: data.name,
        isDeleted: false,
      });

    if (existingProject) {
      throw new ApiError(
        409,
        "Project with this name already exists"
      );
    }
  }

  Object.assign(project, data);

  await project.save();

  return project;
};

export const deleteProject = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(
      404,
      "Workspace not found"
    );
  }

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  project.isDeleted = true;
  project.deletedAt = new Date();

  await project.save();
};