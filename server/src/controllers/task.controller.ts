import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  archiveTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  removeTaskDueDate,
  restoreTask,
  updateTask,
  updateTaskDueDate,
  updateTaskStartDate,
} from "../services/task.service.js";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await createTask(
      new Types.ObjectId(String(req.params.projectId)),
      req.user!._id,
      req.body
    );

    res
      .status(201)
      .json(new ApiResponse(201, "Task created successfully", task));
  }
);

export const getTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const tasks = await getTasks(
      new Types.ObjectId(String(req.params.projectId)),
      req.user!._id,
      req.query
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Tasks fetched successfully", tasks));
  }
);

export const getArchivedTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const tasks = await getTasks(
      new Types.ObjectId(String(req.params.projectId)),
      req.user!._id,
      { ...req.query, archived: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Archived tasks fetched successfully",
          tasks
        )
      );
  }
);

export const getTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await getTaskById(
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Task fetched successfully", task));
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await updateTask(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Task updated successfully", task));
  }
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteTask(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Task deleted successfully", null));
  }
);

export const updateTaskDueDateController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await updateTaskDueDate(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id,
      req.body.dueDate
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Task due date updated successfully",
          task
        )
      );
  }
);

export const removeTaskDueDateController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await removeTaskDueDate(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Task due date removed successfully",
          task
        )
      );
  }
);

export const updateTaskStartDateController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await updateTaskStartDate(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id,
      req.body.startDate
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Task start date updated successfully",
          task
        )
      );
  }
);

export const archiveTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await archiveTask(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Task archived successfully", task));
  }
);

export const restoreTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await restoreTask(
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Task restored successfully", task));
  }
);
