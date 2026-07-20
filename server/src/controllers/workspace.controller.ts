import { Request, Response } from "express";
import  asyncHandler  from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createWorkspace } from "../services/workspace.service.js";

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const ownerId = req.user._id;

    const workspace = await createWorkspace(data, ownerId);

    res.status(201).json(
      new ApiResponse(
    201,
    "Workspace created successfully",
    workspace
)
    );
  }
);