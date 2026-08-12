import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  assignLabelsToTask,
  createLabel,
  deleteLabel,
  getLabels,
  removeLabelsFromTask,
  updateLabel,
} from "../services/label.service.js";

export const createLabelController = asyncHandler(
  async (req: Request, res: Response) => {
    const label = await createLabel(
      new Types.ObjectId(String(req.params.workspaceId)),
      req.user!._id,
      req.body
    );

    res
      .status(201)
      .json(new ApiResponse(201, "Label created successfully", label));
  }
);

export const getLabelsController = asyncHandler(
  async (req: Request, res: Response) => {
    const labels = await getLabels(
      new Types.ObjectId(String(req.params.workspaceId)),
      Number(req.query.page ?? 1),
      Number(req.query.limit ?? 20),
      String(req.query.sortBy ?? "createdAt"),
      (req.query.sortOrder ?? "desc") as "asc" | "desc"
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Labels fetched successfully", labels));
  }
);

export const updateLabelController = asyncHandler(
  async (req: Request, res: Response) => {
    const label = await updateLabel(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.labelId)),
      req.user!._id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Label updated successfully", label));
  }
);

export const deleteLabelController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteLabel(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.labelId)),
      req.user!._id
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Label deleted successfully", null));
  }
);

export const assignLabelsToTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await assignLabelsToTask(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id,
      req.body.labels
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Labels assigned successfully", task));
  }
);

export const removeLabelsFromTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await removeLabelsFromTask(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id,
      req.body.labels
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Labels removed successfully", task));
  }
);
