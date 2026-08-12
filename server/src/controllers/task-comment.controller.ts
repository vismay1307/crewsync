import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
  updateTaskComment,
} from "../services/task-comment.service.js";

export const createTaskCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await createTaskComment(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      req.user!._id,
      req.body
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Comment created successfully",
          comment
        )
      );
  }
);

export const getTaskCommentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const comments = await getTaskComments(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      Number(req.query.page ?? 1),
      Number(req.query.limit ?? 20)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Comments fetched successfully",
          comments
        )
      );
  }
);

export const updateTaskCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await updateTaskComment(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      new Types.ObjectId(String(req.params.commentId)),
      req.user!._id,
      req.body
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Comment updated successfully",
          comment
        )
      );
  }
);

export const deleteTaskCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteTaskComment(
      new Types.ObjectId(String(req.params.workspaceId)),
      new Types.ObjectId(String(req.params.projectId)),
      new Types.ObjectId(String(req.params.taskId)),
      new Types.ObjectId(String(req.params.commentId)),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Comment deleted successfully",
          null
        )
      );
  }
);
