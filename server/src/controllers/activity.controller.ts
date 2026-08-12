import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getWorkspaceActivity } from "../services/activity.service.js";

export const getWorkspaceActivityController = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await getWorkspaceActivity(
      new Types.ObjectId(String(req.params.workspaceId)),
      Number(req.query.page ?? 1),
      Number(req.query.limit ?? 20)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Workspace activity fetched successfully",
          activity
        )
      );
  }
);
