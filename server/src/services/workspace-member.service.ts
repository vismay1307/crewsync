import { Types } from "mongoose";

import { Workspace } from "../models/workspace.model.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import User from "../models/user.models.js";

import ApiError from "../utils/ApiError.js";

import {
  AddWorkspaceMemberInput,
  UpdateWorkspaceMemberInput,
} from "../validators/workspace-member.validator.js";

export const addWorkspaceMember = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId,
  data: AddWorkspaceMemberInput
) => {
  // Check workspace exists and belongs to owner
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  // Find user by email
  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent owner from adding himself again
  if (user._id.equals(ownerId)) {
    throw new ApiError(
      409,
      "Owner is already a member of this workspace."
    );
  }

  // Check existing membership
  const existingMember = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: user._id,
    isDeleted: false,
  });

  if (existingMember) {
    throw new ApiError(
      409,
      "User is already a member of this workspace."
    );
  }

  // Create membership
  const workspaceMember =
    await WorkspaceMember.create({
      workspace: workspaceId,
      user: user._id,
      role: data.role,
      status: "accepted",
      invitedBy: ownerId,
    });

  await workspaceMember.populate(
    "user",
    "firstName lastName email avatar"
  );

  return workspaceMember;
};

export const getWorkspaceMembers = async (
  workspaceId: Types.ObjectId,
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

  // Fetch members
  const members = await WorkspaceMember.find({
    workspace: workspaceId,
    isDeleted: false,
  })
    .populate(
      "user",
      "firstName lastName email avatar"
    )
    .populate(
      "invitedBy",
      "firstName lastName email"
    )
    .sort({
      createdAt: 1,
    });

  return members;
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