import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { Workspace } from "../models/workspace.model.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";

type WorkspaceRole = "owner" | "admin" | "member";

const authorizeWorkspace = (
  allowedRoles: WorkspaceRole[]
) => {
  return asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {

      const workspaceId = req.params.workspaceId;

      if (!workspaceId || Array.isArray(workspaceId)) {
        throw new ApiError(
          400,
          "Workspace ID is required."
        );
      }

      const workspace = await Workspace.findOne({
        _id: new Types.ObjectId(workspaceId),
        isDeleted: false,
      });

      if (!workspace) {
        throw new ApiError(
          404,
          "Workspace not found."
        );
      }

      const member = await WorkspaceMember.findOne({
        workspace: workspace._id,
        user: req.user!._id,
        isDeleted: false,
      });

      if (!member) {
        throw new ApiError(
          403,
          "You are not a member of this workspace."
        );
      }

      if (!allowedRoles.includes(member.role)) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action."
        );
      }

      req.workspace = workspace;
      req.workspaceMember = member;

      next();
    }
  );
};

export default authorizeWorkspace;