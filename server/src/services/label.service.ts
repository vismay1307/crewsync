import { Types } from "mongoose";

import { Label } from "../models/label.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.model.js";
import ApiError from "../utils/ApiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { getSort } from "../utils/sorting.js";
import { createActivity } from "./activity.service.js";
import { createNotification } from "./notification.service.js";
import {
  CreateLabelInput,
  UpdateLabelInput,
} from "../validators/label.validator.js";

export const createLabel = async (
  workspaceId: Types.ObjectId,
  userId: Types.ObjectId,
  data: CreateLabelInput
) => {
  const duplicate = await Label.findOne({
    workspace: workspaceId,
    name: data.name,
    isDeleted: false,
  });

  if (duplicate) {
    throw new ApiError(409, "Duplicate label name");
  }

  const label = await Label.create({
    ...data,
    workspace: workspaceId,
    createdBy: userId,
  });

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "label.created",
    resourceType: "Label",
    resourceId: label._id,
    metadata: { name: label.name },
  });

  return label;
};

export const getLabels = async (
  workspaceId: Types.ObjectId,
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const pagination = getPagination({ page, limit });
  const query = { workspace: workspaceId, isDeleted: false };
  const [items, totalItems] = await Promise.all([
    Label.find(query)
      .sort(getSort(sortBy, sortOrder))
      .skip(pagination.skip)
      .limit(pagination.limit),
    Label.countDocuments(query),
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

export const updateLabel = async (
  workspaceId: Types.ObjectId,
  labelId: Types.ObjectId,
  userId: Types.ObjectId,
  data: UpdateLabelInput
) => {
  const label = await Label.findOne({
    _id: labelId,
    workspace: workspaceId,
    isDeleted: false,
  });

  if (!label) {
    throw new ApiError(404, "Label not found");
  }

  if (data.name && data.name !== label.name) {
    const duplicate = await Label.findOne({
      workspace: workspaceId,
      name: data.name,
      isDeleted: false,
    });

    if (duplicate) {
      throw new ApiError(409, "Duplicate label name");
    }
  }

  Object.assign(label, data);
  await label.save();

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "label.updated",
    resourceType: "Label",
    resourceId: label._id,
    metadata: data,
  });

  return label;
};

export const deleteLabel = async (
  workspaceId: Types.ObjectId,
  labelId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const label = await Label.findOne({
    _id: labelId,
    workspace: workspaceId,
    isDeleted: false,
  });

  if (!label) {
    throw new ApiError(404, "Label not found");
  }

  label.isDeleted = true;
  label.deletedAt = new Date();
  await label.save();

  await Task.updateMany(
    { labels: labelId },
    { $pull: { labels: labelId } }
  );

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "label.deleted",
    resourceType: "Label",
    resourceId: label._id,
    metadata: { name: label.name },
  });
};

const getTaskForLabels = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId
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

  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return { task, project };
};

export const assignLabelsToTask = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId,
  labels: string[]
) => {
  const { task } = await getTaskForLabels(
    workspaceId,
    projectId,
    taskId
  );
  const labelIds = labels.map((label) => new Types.ObjectId(label));
  const validLabels = await Label.find({
    _id: { $in: labelIds },
    workspace: workspaceId,
    isDeleted: false,
  });

  if (validLabels.length !== labelIds.length) {
    throw new ApiError(404, "One or more labels not found");
  }

  await Task.updateOne(
    { _id: task._id },
    { $addToSet: { labels: { $each: labelIds } } }
  );

  const updatedTask = await Task.findById(task._id).populate("labels");

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "label.assigned",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { labels },
  });

  if (task.assignee) {
    await createNotification({
      recipient: task.assignee,
      actor: userId,
      workspace: workspaceId,
      type: "label.assigned",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { labels },
    });
  }

  return updatedTask;
};

export const removeLabelsFromTask = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId,
  labels: string[]
) => {
  const { task } = await getTaskForLabels(
    workspaceId,
    projectId,
    taskId
  );
  const labelIds = labels.map((label) => new Types.ObjectId(label));

  await Task.updateOne(
    { _id: task._id },
    { $pull: { labels: { $in: labelIds } } }
  );

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "label.removed",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { labels },
  });

  return Task.findById(task._id).populate("labels");
};
