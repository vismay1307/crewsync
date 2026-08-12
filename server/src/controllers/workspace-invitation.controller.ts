import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  acceptWorkspaceInvitation,
  cancelWorkspaceInvitation,
  createWorkspaceInvitation,
  getWorkspaceInvitations,
  previewWorkspaceInvitation,
  rejectWorkspaceInvitation,
  resendWorkspaceInvitation,
} from "../services/workspace-invitation.service.js";

export const createWorkspaceInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createWorkspaceInvitation(
      new Types.ObjectId(String(req.params.workspaceId)),
      req.user!._id,
      req.body
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Invitation sent successfully",
          result
        )
      );
  }
);

export const getWorkspaceInvitationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const invitations = await getWorkspaceInvitations(
      new Types.ObjectId(String(req.params.workspaceId)),
      Number(req.query.page ?? 1),
      Number(req.query.limit ?? 20)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Invitations fetched successfully",
          invitations
        )
      );
  }
);

export const previewWorkspaceInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await previewWorkspaceInvitation(
      String(req.params.token)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Invitation preview fetched successfully",
          invitation
        )
      );
  }
);

export const acceptWorkspaceInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const member = await acceptWorkspaceInvitation(
      String(req.params.token),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Invitation accepted successfully",
          member
        )
      );
  }
);

export const rejectWorkspaceInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await rejectWorkspaceInvitation(
      String(req.params.token),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Invitation rejected successfully",
          invitation
        )
      );
  }
);

export const cancelWorkspaceInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await cancelWorkspaceInvitation(
      new Types.ObjectId(String(req.params.invitationId)),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Invitation cancelled successfully",
          invitation
        )
      );
  }
);

export const resendWorkspaceInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await resendWorkspaceInvitation(
      new Types.ObjectId(String(req.params.invitationId)),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Invitation resent successfully",
          result
        )
      );
  }
);
