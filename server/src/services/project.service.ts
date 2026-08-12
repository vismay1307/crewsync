import { Types } from "mongoose";

import { Project } from "../models/project.models.js";
import { Workspace } from "../models/workspace.model.js";

import  ApiError  from "../utils/ApiError.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import { createActivity } from "./activity.service.js";
import { createNotifications } from "./notification.service.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { getSort } from "../utils/sorting.js";

import { CreateProjectInput,UpdateProjectInput } from "../validators/project.validators.js";

export const createProject = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: CreateProjectInput
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
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

  await createActivity({
    workspace: workspaceId,
    actor: ownerId,
    action: "project.created",
    resourceType: "Project",
    resourceId: project._id,
    metadata: { name: project.name },
  });

  const members = await WorkspaceMember.find({
    workspace: workspaceId,
    isDeleted: false,
  }).select("user");

  await createNotifications(
    members.map((member) => ({
      recipient: member.user,
      actor: ownerId,
      workspace: workspaceId,
      type: "project.created",
      resourceType: "Project",
      resourceId: project._id,
      metadata: { name: project.name },
    }))
  );

  return project;
};

export const getProjects = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    archived?: boolean;
  } = {}
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const pagination = getPagination(options);
  const query = {
    workspace: workspaceId,
    isDeleted: false,
    isArchived: options.archived ?? false,
  };

  const [items, totalItems] = await Promise.all([
    Project.find(query)
      .sort(getSort(options.sortBy ?? "createdAt", options.sortOrder))
      .skip(pagination.skip)
      .limit(pagination.limit),
    Project.countDocuments(query),
  ]);

  return {
    items,
    pagination: buildPaginationMeta(
      totalItems,
      pagination.page,
      pagination.limit
    ),
  };
};

export const getProjectById = async (
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {

  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
    isArchived: false,
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
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    isDeleted: false,
    isArchived: false,
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

  await createActivity({
    workspace: workspaceId,
    actor: ownerId,
    action: "project.updated",
    resourceType: "Project",
    resourceId: project._id,
    metadata: data,
  });

  return project;
};

export const deleteProject = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {

  const workspace = await Workspace.findOne({
    _id: workspaceId,
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
    isArchived: false,
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

  await createActivity({
    workspace: workspaceId,
    actor: ownerId,
    action: "project.deleted",
    resourceType: "Project",
    resourceId: project._id,
    metadata: { name: project.name },
  });
};

export const archiveProject = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    isDeleted: false,
    isArchived: false,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.isArchived = true;
  project.archivedAt = new Date();
  project.archivedBy = userId;
  await project.save();

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "project.archived",
    resourceType: "Project",
    resourceId: project._id,
    metadata: { name: project.name },
  });

  const members = await WorkspaceMember.find({
    workspace: workspaceId,
    isDeleted: false,
  }).select("user");

  await createNotifications(
    members.map((member) => ({
      recipient: member.user,
      actor: userId,
      workspace: workspaceId,
      type: "project.archived",
      resourceType: "Project",
      resourceId: project._id,
      metadata: { name: project.name },
    }))
  );

  return project;
};

export const restoreProject = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    isDeleted: false,
    isArchived: true,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.isArchived = false;
  project.archivedAt = undefined;
  project.archivedBy = undefined;
  await project.save();

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "project.restored",
    resourceType: "Project",
    resourceId: project._id,
    metadata: { name: project.name },
  });

  const members = await WorkspaceMember.find({
    workspace: workspaceId,
    isDeleted: false,
  }).select("user");

  await createNotifications(
    members.map((member) => ({
      recipient: member.user,
      actor: userId,
      workspace: workspaceId,
      type: "project.restored",
      resourceType: "Project",
      resourceId: project._id,
      metadata: { name: project.name },
    }))
  );

  return project;
};
