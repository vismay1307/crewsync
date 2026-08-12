import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getWorkspaceSettings,
  updateWorkspaceSettings,
} from "../services/workspace-settings.service.js";

export const getWorkspaceSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await getWorkspaceSettings(
      new Types.ObjectId(String(req.params.workspaceId))
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Workspace settings fetched successfully",
          settings
        )
      );
  }
);

export const updateWorkspaceSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await updateWorkspaceSettings(
      new Types.ObjectId(String(req.params.workspaceId)),
      req.user!._id,
      req.body
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Workspace settings updated successfully",
          settings
        )
      );
  }
);
