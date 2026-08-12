import { Types } from "mongoose";

import { Label } from "../models/label.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.model.js";
import User from "../models/user.models.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import ApiError from "../utils/ApiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { getSort } from "../utils/sorting.js";
import { createActivity } from "./activity.service.js";
import { createNotification } from "./notification.service.js";
import {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validators/task.validator.js";

interface TaskListFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  priority?: string;
  assignee?: string;
  labels?: string | string[];
  createdBy?: string;
  overdue?: boolean;
  completed?: boolean;
  startFrom?: Date;
  startTo?: Date;
  dueFrom?: Date;
  dueTo?: Date;
  search?: string;
  archived?: boolean;
}

const ensureProject = async (projectId: Types.ObjectId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

const validateTaskDates = (
  startDate?: Date,
  dueDate?: Date
) => {
  if (startDate && dueDate && dueDate < startDate) {
    throw new ApiError(400, "Due date cannot be before start date");
  }
};

const withComputedTaskFields = (task: Record<string, unknown>) => ({
  ...task,
  isOverdue:
    Boolean(task.dueDate) &&
    task.status !== "done" &&
    new Date(task.dueDate as Date) < new Date(),
});

export const createTask = async (
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: CreateTaskInput
) => {
  const project = await ensureProject(projectId);

  validateTaskDates(data.startDate, data.dueDate);

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
    data.status === "done" ? new Date() : undefined;

  const task = await Task.create({
    ...data,
    project: projectId,
    createdBy: ownerId,
    completedAt,
  });

  await createActivity({
    workspace: project.workspace,
    actor: ownerId,
    action: "task.created",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { project: projectId, title: task.title },
  });

  if (task.assignee) {
    await createActivity({
      workspace: project.workspace,
      actor: ownerId,
      action: "task.assigned",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { assignee: task.assignee },
    });

    await createNotification({
      recipient: task.assignee,
      actor: ownerId,
      workspace: project.workspace,
      type: "task.assigned",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { title: task.title },
    });
  }

  return task;
};

export const getTasks = async (
  projectId: Types.ObjectId,
  ownerId: Types.ObjectId,
  filters: TaskListFilters = {}
) => {
  await ensureProject(projectId);

  const pagination = getPagination(filters);
  const query: Record<string, unknown> = {
    project: projectId,
    isDeleted: false,
    isArchived: filters.archived ?? false,
  };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignee) query.assignee = filters.assignee;
  if (filters.createdBy) query.createdBy = filters.createdBy;
  if (filters.completed !== undefined) {
    query.status = filters.completed ? "done" : { $ne: "done" };
  }
  if (filters.labels) {
    query.labels = {
      $all: Array.isArray(filters.labels)
        ? filters.labels
        : [filters.labels],
    };
  }
  if (filters.overdue) {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: "done" };
  }
  if (filters.startFrom || filters.startTo) {
    query.startDate = {
      ...(filters.startFrom ? { $gte: filters.startFrom } : {}),
      ...(filters.startTo ? { $lte: filters.startTo } : {}),
    };
  }
  if (filters.dueFrom || filters.dueTo) {
    query.dueDate = {
      ...(typeof query.dueDate === "object" ? query.dueDate : {}),
      ...(filters.dueFrom ? { $gte: filters.dueFrom } : {}),
      ...(filters.dueTo ? { $lte: filters.dueTo } : {}),
    };
  }
  if (filters.search) {
    const regex = new RegExp(filters.search, "i");
    const [matchingUsers, matchingLabels] = await Promise.all([
      User.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
        ],
      }).select("_id"),
      Label.find({ name: regex, isDeleted: false }).select("_id"),
    ]);

    query.$or = [
      { title: regex },
      { description: regex },
      { assignee: { $in: matchingUsers.map((user) => user._id) } },
      { createdBy: { $in: matchingUsers.map((user) => user._id) } },
      { labels: { $in: matchingLabels.map((label) => label._id) } },
    ];
  }

  const [items, totalItems] = await Promise.all([
    Task.find(query)
      .populate("assignee", "firstName lastName email avatar")
      .populate("createdBy", "firstName lastName email avatar")
      .populate("labels")
      .sort(getSort(filters.sortBy, filters.sortOrder))
      .skip(pagination.skip)
      .limit(pagination.limit),
    Task.countDocuments(query),
  ]);

  return {
    items: items.map((task) =>
      withComputedTaskFields(
        task.toObject() as unknown as Record<string, unknown>
      )
    ),
    pagination: buildPaginationMeta(
      totalItems,
      pagination.page,
      pagination.limit
    ),
  };
};

export const getTaskById = async (
  taskId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
    isArchived: false,
  })
    .populate("project", "name emoji")
    .populate("createdBy", "firstName lastName email avatar")
    .populate("assignee", "firstName lastName email avatar")
    .populate("labels");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return withComputedTaskFields(
    task.toObject() as unknown as Record<string, unknown>
  );
};

export const updateTask = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: UpdateTaskInput
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  validateTaskDates(
    data.startDate ?? task.startDate,
    data.dueDate ?? task.dueDate
  );

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

  const previousAssignee = task.assignee;
  const previousStatus = task.status;

  Object.assign(task, data);

  if (task.status === "done" && previousStatus !== "done") {
    task.completedAt = new Date();
  }
  if (task.status !== "done") {
    task.completedAt = undefined;
  }

  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: ownerId,
    action: "task.updated",
    resourceType: "Task",
    resourceId: task._id,
    metadata: data,
  });

  if (
    data.assignee &&
    (!previousAssignee || !previousAssignee.equals(data.assignee))
  ) {
    await createActivity({
      workspace: project.workspace,
      actor: ownerId,
      action: "task.assigned",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { assignee: data.assignee },
    });

    await createNotification({
      recipient: new Types.ObjectId(data.assignee),
      actor: ownerId,
      workspace: project.workspace,
      type: "task.assigned",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { title: task.title },
    });
  }

  if (data.status && data.status !== previousStatus && task.assignee) {
    await createNotification({
      recipient: task.assignee,
      actor: ownerId,
      workspace: project.workspace,
      type: "task.status_updated",
      resourceType: "Task",
      resourceId: task._id,
      metadata: {
        title: task.title,
        from: previousStatus,
        to: data.status,
      },
    });
  }

  return task;
};

export const deleteTask = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.isDeleted = true;
  task.deletedAt = new Date();

  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: ownerId,
    action: "task.deleted",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { project: projectId, title: task.title },
  });
};

export const updateTaskDueDate = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId,
  dueDate: Date
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) throw new ApiError(404, "Task not found");

  validateTaskDates(task.startDate, dueDate);
  task.dueDate = dueDate;
  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: userId,
    action: "task.due_date_updated",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { dueDate },
  });

  if (task.assignee) {
    await createNotification({
      recipient: task.assignee,
      actor: userId,
      workspace: project.workspace,
      type: "task.due_date_updated",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { dueDate },
    });
  }

  return task;
};

export const removeTaskDueDate = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) throw new ApiError(404, "Task not found");

  task.dueDate = undefined;
  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: userId,
    action: "task.due_date_removed",
    resourceType: "Task",
    resourceId: task._id,
    metadata: {},
  });

  return task;
};

export const updateTaskStartDate = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId,
  startDate: Date
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) throw new ApiError(404, "Task not found");

  validateTaskDates(startDate, task.dueDate);
  task.startDate = startDate;
  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: userId,
    action: "task.start_date_updated",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { startDate },
  });

  return task;
};

export const archiveTask = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: false,
  });

  if (!task) throw new ApiError(404, "Task not found");

  task.isArchived = true;
  task.archivedAt = new Date();
  task.archivedBy = userId;
  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: userId,
    action: "task.archived",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { title: task.title },
  });

  if (task.assignee) {
    await createNotification({
      recipient: task.assignee,
      actor: userId,
      workspace: project.workspace,
      type: "task.archived",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { title: task.title },
    });
  }

  return task;
};

export const restoreTask = async (
  projectId: Types.ObjectId,
  taskId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const project = await ensureProject(projectId);
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
    isDeleted: false,
    isArchived: true,
  });

  if (!task) throw new ApiError(404, "Task not found");

  task.isArchived = false;
  task.archivedAt = undefined;
  task.archivedBy = undefined;
  await task.save();

  await createActivity({
    workspace: project.workspace,
    actor: userId,
    action: "task.restored",
    resourceType: "Task",
    resourceId: task._id,
    metadata: { title: task.title },
  });

  if (task.assignee) {
    await createNotification({
      recipient: task.assignee,
      actor: userId,
      workspace: project.workspace,
      type: "task.restored",
      resourceType: "Task",
      resourceId: task._id,
      metadata: { title: task.title },
    });
  }

  return task;
};
