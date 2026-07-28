import { Types } from "mongoose";

import { Task } from "../models/task.model.js";
import { Project } from "../models/project.models.js";
import User from "../models/user.models.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import ApiError from "../utils/ApiError.js";

import {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validators/task.validator.js";

export const createTask = async (
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: CreateTaskInput
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (data.assignee) {
  const member = await WorkspaceMember.findOne({
    workspace: project.workspace,
    user: data.assignee,
    isDeleted: false,
  });

  if (!member) {
    throw new ApiError(
      404,
      "Assignee is not a member of this workspace."
    );
  }
}

  const completedAt =
    data.status === "done"
      ? new Date()
      : undefined;

  const task = await Task.create({
    ...data,
    project: projectId,
    createdBy: ownerId,
    completedAt,
  });

  return task;
};

export const getTasks = async (
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: projectId,
    isDeleted: false,
  });

  return tasks;
};

export const getTaskById = async (
  taskId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  })
    .populate(
      "project",
      "name emoji"
    )
    .populate(
      "createdBy",
      "firstName lastName email avatar"
    )
    .populate(
      "assignee",
      "firstName lastName email avatar"
    );

  if (!task) {
    throw new ApiError(
      404,
      "Task not found"
    );
  }

  const project = await Project.findOne({
    _id: task.project,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(
      403,
      "You are not authorized to access this task."
    );
  }

  return task;
};

export const updateTask = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: UpdateTaskInput
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(
      404,
      "Task not found"
    );
  }

 if (data.assignee) {
  const member = await WorkspaceMember.findOne({
    workspace: project.workspace,
    user: data.assignee,
    isDeleted: false,
  });

  if (!member) {
    throw new ApiError(
      404,
      "Assignee is not a member of this workspace."
    );
  }
}

  Object.assign(task, data);

  if (task.status === "done") {
    task.completedAt = new Date();
  } else {
    task.completedAt = undefined;
  }

  await task.save();

  return task;
};

export const deleteTask = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(
      404,
      "Task not found"
    );
  }

  task.isDeleted = true;

  task.deletedAt = new Date();

  await task.save();
};