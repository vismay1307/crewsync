import { Types } from "mongoose";

import { Workspace } from "../models/workspace.model.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import User from "../models/user.models.js";

import ApiError from "../utils/ApiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { getSort } from "../utils/sorting.js";
import { WorkspaceInvitation } from "../models/workspace-invitation.model.js";
import {
  AddWorkspaceMemberInput,
  UpdateWorkspaceMemberInput,
} from "../validators/workspace-member.validator.js";


export const addWorkspaceMember = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: AddWorkspaceMemberInput
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const email = data.email.trim().toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      404,
      "No registered user found with this email. Invite them to CrewSync first."
    );
  }

  if (user._id.equals(ownerId)) {
    throw new ApiError(
      409,
      "The workspace owner is already a member."
    );
  }

  const invitation = await WorkspaceInvitation.findOne({
    workspace: workspaceId,
    email,
    status: "accepted",
    invitedUser: user._id,
  });

  if (!invitation) {
    const pendingInvitation = await WorkspaceInvitation.findOne({
      workspace: workspaceId,
      email,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (pendingInvitation) {
      throw new ApiError(
        409,
        "This user has not accepted the workspace invitation yet."
      );
    }

    throw new ApiError(
      404,
      "This user has not been invited to this workspace. Please send an invitation first."
    );
  }

  const existingMember = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: user._id,
    isDeleted: false,
  }).populate("user", "firstName lastName email avatar");

  if (!existingMember) {
    throw new ApiError(
      409,
      "The invitation is accepted, but the membership record is missing. Please review the invitation acceptance flow."
    );
  }

  if (existingMember.status !== "accepted") {
    throw new ApiError(
      409,
      "This user's workspace membership has not been accepted."
    );
  }

  return existingMember;
};


export const getWorkspaceMembers = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
) => {
  // Check workspace exists and belongs to owner
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const pagination = getPagination(options);
  const query = {
    workspace: workspaceId,
    isDeleted: false,
  };

  const [items, totalItems] = await Promise.all([
    WorkspaceMember.find(query)
      .populate("user", "firstName lastName email avatar")
      .populate("invitedBy", "firstName lastName email")
      .sort(getSort(options.sortBy ?? "createdAt", options.sortOrder))
      .skip(pagination.skip)
      .limit(pagination.limit),
    WorkspaceMember.countDocuments(query),
  ]);

  return {
    items,
    pagination: buildPaginationMeta(
      totalItems,
      pagination.page,
      pagination.limit
    ),
  };
};


export const updateWorkspaceMember = async (
  workspaceId: Types.ObjectId,
  memberId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: UpdateWorkspaceMemberInput
) => {
  // Check workspace exists and belongs to owner
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  // Find workspace member
  const member = await WorkspaceMember.findOne({
    _id: memberId,
    workspace: workspaceId,
    isDeleted: false,
  }).populate(
    "user",
    "firstName lastName email avatar"
  );

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  // Owner role cannot be updated
  if (member.role === "owner") {
    throw new ApiError(
      403,
      "Workspace owner role cannot be changed."
    );
  }

  // Prevent assigning same role
  if (member.role === data.role) {
    throw new ApiError(
      409,
      "Member already has this role."
    );
  }

  member.role = data.role;

  await member.save();

  return member;
};

export const removeWorkspaceMember = async (
  workspaceId: Types.ObjectId,
  memberId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {
  // Check workspace exists and belongs to owner
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  // Find workspace member
  const member = await WorkspaceMember.findOne({
    _id: memberId,
    workspace: workspaceId,
    isDeleted: false,
  });

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  // Owner cannot be removed
  if (member.role === "owner") {
    throw new ApiError(
      403,
      "Workspace owner cannot be removed."
    );
  }

  member.isDeleted = true;
  member.deletedAt = new Date();

  await member.save();

  return;
};
