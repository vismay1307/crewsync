import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  addWorkspaceMember,
  getWorkspaceMembers,
  updateWorkspaceMember,
  removeWorkspaceMember,
} from "../services/workspace-member.service.js";

const getObjectIdFromParam = (
  param: string | string[] | undefined
): Types.ObjectId => {
  const value = Array.isArray(param) ? param[0] : param;

  if (!value) {
    throw new Error("Missing required ID parameter");
  }

  return new Types.ObjectId(value);
};

export const addWorkspaceMemberController =
  asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = getObjectIdFromParam(req.params.workspaceId);

    const ownerId = req.user!._id;

    const member = await addWorkspaceMember(
      workspaceId,
      ownerId,
      req.body
    );

    res.status(201).json(
      new ApiResponse(
        201,
        "Member added successfully",
        member
      )
    );
  });

export const getWorkspaceMembersController =
  asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = getObjectIdFromParam(req.params.workspaceId);

    const ownerId = req.user!._id;

    const members = await getWorkspaceMembers(
      workspaceId,
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Workspace members fetched successfully",
        members
      )
    );
  });

export const updateWorkspaceMemberController =
  asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = getObjectIdFromParam(
      req.params.workspaceId
    );

    const memberId = getObjectIdFromParam(
      req.params.memberId
    );

    const ownerId = req.user!._id;

    const member = await updateWorkspaceMember(
      workspaceId,
      memberId,
      ownerId,
      req.body
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Member role updated successfully",
        member
      )
    );
  });

export const removeWorkspaceMemberController =
  asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = getObjectIdFromParam(
      req.params.workspaceId
    );

    const memberId = getObjectIdFromParam(
      req.params.memberId
    );

    const ownerId = req.user!._id;

    await removeWorkspaceMember(
      workspaceId,
      memberId,
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Member removed successfully",
        null
      )
    );
  });