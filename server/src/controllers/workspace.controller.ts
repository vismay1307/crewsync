import { Request, Response } from "express";
import  asyncHandler  from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {updateWorkspace, createWorkspace,getWorkspaces,getWorkspaceById } from "../services/workspace.service.js";
import { Types } from "mongoose";
import { deleteWorkspace } from "../validators/workspace.validator.js";

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

export const getWorkspacesController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user._id;

    const workspaces = await getWorkspaces(ownerId);

    res.status(200).json(
      new ApiResponse(
        200,
        "Workspaces fetched successfully",
        workspaces,
        
      )
    );
  }
);

export const getWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const workspaceId = req.params.workspaceId as string;

    const workspace = await getWorkspaceById(
      new Types.ObjectId(workspaceId),
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Workspace fetched successfully",
        workspace
      )
    );
  }
);

export const updateWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {

    const ownerId = req.user!._id;

    const workspaceId = req.params.workspaceId as string;

    const workspace = await updateWorkspace(
      new Types.ObjectId(workspaceId),
      ownerId,
      req.body
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Workspace updated successfully",
        workspace,
        
      )
    );

  }
);


export const deleteWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {

    const ownerId = req.user!._id;

    const workspaceId =
      req.params.workspaceId as string;

    await deleteWorkspace(
      new Types.ObjectId(workspaceId),
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Workspace deleted successfully",
        null,
        
      )
    );

  }
);