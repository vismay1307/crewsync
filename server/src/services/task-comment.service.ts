import { Types } from "mongoose";

import { Project } from "../models/project.models.js";
import { Task } from "../models/task.model.js";
import { TaskComment } from "../models/task-comment.model.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import ApiError from "../utils/ApiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { createActivity } from "./activity.service.js";
import { createNotification } from "./notification.service.js";
import {
  CreateTaskCommentInput,
  UpdateTaskCommentInput,
} from "../validators/task-comment.validator.js";

const getTaskInWorkspace = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId
) => {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const createTaskComment = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId,
  data: CreateTaskCommentInput
) => {
  const task = await getTaskInWorkspace(workspaceId, projectId, taskId);

  const comment = await TaskComment.create({
    task: taskId,
    workspace: workspaceId,
    user: userId,
    body: data.body,
  });

  await comment.populate("user", "firstName lastName email avatar");

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "comment.added",
    resourceType: "TaskComment",
    resourceId: comment._id,
    metadata: { task: taskId },
  });

  if (task.assignee) {
    await createNotification({
      recipient: task.assignee,
      actor: userId,
      workspace: workspaceId,
      type: "comment.added",
      resourceType: "TaskComment",
      resourceId: comment._id,
      metadata: { task: taskId },
    });
  }

  return comment;
};

export const getTaskComments = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  page = 1,
  limit = 20
) => {
  await getTaskInWorkspace(workspaceId, projectId, taskId);

  const pagination = getPagination({ page, limit });
  const query = {
    task: taskId,
    workspace: workspaceId,
    isDeleted: false,
  };

  const [items, totalItems] = await Promise.all([
    TaskComment.find(query)
      .populate("user", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    TaskComment.countDocuments(query),
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

export const updateTaskComment = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  commentId: Types.ObjectId,
  userId: Types.ObjectId,
  data: UpdateTaskCommentInput
) => {
  await getTaskInWorkspace(workspaceId, projectId, taskId);

  const comment = await TaskComment.findOne({
    _id: commentId,
    task: taskId,
    workspace: workspaceId,
    isDeleted: false,
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const member = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
    isDeleted: false,
  });

  const canModerate =
    member?.role === "owner" || member?.role === "admin";

  if (!comment.user.equals(userId) && !canModerate) {
    throw new ApiError(403, "Permission denied");
  }

  comment.body = data.body;
  await comment.save();

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "comment.edited",
    resourceType: "TaskComment",
    resourceId: comment._id,
    metadata: { task: taskId },
  });

  return comment.populate("user", "firstName lastName email avatar");
};

export const deleteTaskComment = async (
  workspaceId: Types.ObjectId,
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  commentId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  await getTaskInWorkspace(workspaceId, projectId, taskId);

  const comment = await TaskComment.findOne({
    _id: commentId,
    task: taskId,
    workspace: workspaceId,
    isDeleted: false,
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const member = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
    isDeleted: false,
  });

  const canModerate =
    member?.role === "owner" || member?.role === "admin";

  if (!comment.user.equals(userId) && !canModerate) {
    throw new ApiError(403, "Permission denied");
  }

  comment.isDeleted = true;
  comment.deletedAt = new Date();
  await comment.save();

  await createActivity({
    workspace: workspaceId,
    actor: userId,
    action: "comment.deleted",
    resourceType: "TaskComment",
    resourceId: comment._id,
    metadata: { task: taskId },
  });
};
