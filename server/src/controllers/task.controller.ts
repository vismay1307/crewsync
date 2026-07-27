import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const projectId = req.params.projectId as string;

    const task = await createTask(
      new Types.ObjectId(projectId),
      ownerId,
      req.body
    );

    res.status(201).json(
      new ApiResponse(
        201,
        "Task created successfully",
        task
      )
    );
  }
);

export const getTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const projectId = req.params.projectId as string;

    const tasks = await getTasks(
      new Types.ObjectId(projectId),
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Tasks fetched successfully",
        tasks
      )
    );
  }
);

export const getTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const taskId = req.params.taskId as string;

    const task = await getTaskById(
      new Types.ObjectId(taskId),
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Task fetched successfully",
        task
      )
    );
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const projectId = req.params.projectId as string;

    const taskId = req.params.taskId as string;

    const task = await updateTask(
      new Types.ObjectId(projectId),
      new Types.ObjectId(taskId),
      ownerId,
      req.body
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Task updated successfully",
        task
      )
    );
  }
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const projectId = req.params.projectId as string;

    const taskId = req.params.taskId as string;

    await deleteTask(
      new Types.ObjectId(projectId),
      new Types.ObjectId(taskId),
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Task deleted successfully",
        null
      )
    );
  }
);