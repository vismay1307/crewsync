import crypto from "crypto";
import mongoose, { Types } from "mongoose";

import env from "../config/env.js";
import User from "../models/user.models.js";
import { Workspace } from "../models/workspace.model.js";
import { WorkspaceInvitation } from "../models/workspace-invitation.model.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import ApiError from "../utils/ApiError.js";
import { sendMail } from "./mail.service.js";
import { createActivity } from "./activity.service.js";
import { createNotification } from "./notification.service.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { CreateWorkspaceInvitationInput } from "../validators/workspace-invitation.validator.js";

const INVITATION_EXPIRY_MS = 48 * 60 * 60 * 1000;

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createInvitationToken = () => crypto.randomBytes(32).toString("hex");

const buildInvitationEmail = (
  workspaceName: string,
  token: string,
  role: string
) => {
  const acceptUrl = `${env.CLIENT_URL}/invitations/${token}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>You have been invited to ${workspaceName}</h2>
      <p>You were invited as a ${role}. This invitation expires in 48 hours.</p>
      <p><a href="${acceptUrl}">Review invitation</a></p>
    </div>
  `;
};

const sanitizeInvitation = (invitation: {
  toObject: () => Record<string, unknown>;
}) => {
  const data = invitation.toObject();
  delete data.tokenHash;
  return data;
};

export const createWorkspaceInvitation = async (
  workspaceId: Types.ObjectId,
  invitedBy: Types.ObjectId,
  data: CreateWorkspaceInvitationInput
) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const email = data.email.toLowerCase();
  const invitedUser = await User.findOne({ email });

  if (invitedUser) {
    const existingMember = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: invitedUser._id,
      isDeleted: false,
    });

    if (existingMember) {
      throw new ApiError(409, "Already member");
    }
  }

  const duplicateInvitation = await WorkspaceInvitation.findOne({
    workspace: workspaceId,
    email,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  if (duplicateInvitation) {
    throw new ApiError(409, "Duplicate invitation");
  }

  const token = createInvitationToken();
  const invitation = await WorkspaceInvitation.create({
    workspace: workspaceId,
    email,
    invitedUser: invitedUser?._id,
    invitedBy,
    role: data.role,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + INVITATION_EXPIRY_MS),
  });

  await sendMail({
    to: email,
    subject: `Invitation to join ${workspace.name}`,
    html: buildInvitationEmail(workspace.name, token, data.role),
  });

  await createActivity({
    workspace: workspaceId,
    actor: invitedBy,
    action: "invitation.sent",
    resourceType: "WorkspaceInvitation",
    resourceId: invitation._id,
    metadata: { email, role: data.role },
  });

  return sanitizeInvitation(invitation);
};

export const getWorkspaceInvitations = async (
  workspaceId: Types.ObjectId,
  page = 1,
  limit = 20
) => {
  const pagination = getPagination({ page, limit });
  const query = { workspace: workspaceId };

  const [items, totalItems] = await Promise.all([
    WorkspaceInvitation.find(query)
      .select("-tokenHash")
      .populate("invitedBy", "firstName lastName email avatar")
      .populate("invitedUser", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    WorkspaceInvitation.countDocuments(query),
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

const getPendingInvitationByToken = async (token: string) => {
  const invitation = await WorkspaceInvitation.findOne({
    tokenHash: hashToken(token),
    status: "pending",
  });

  if (!invitation) {
    throw new ApiError(404, "Invitation not found");
  }

  if (invitation.expiresAt <= new Date()) {
    invitation.status = "expired";
    await invitation.save();
    throw new ApiError(410, "Invitation expired");
  }

  return invitation;
};

export const previewWorkspaceInvitation = async (token: string) => {
  const invitation = await getPendingInvitationByToken(token);
  await invitation.populate("workspace", "name description");
  await invitation.populate("invitedBy", "firstName lastName email avatar");

  return sanitizeInvitation(invitation);
};

export const acceptWorkspaceInvitation = async (
  token: string,
  userId: Types.ObjectId
) => {
  const invitation = await getPendingInvitationByToken(token);
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.email.toLowerCase() !== invitation.email) {
    throw new ApiError(403, "This invitation belongs to another email.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingMember = await WorkspaceMember.findOne({
      workspace: invitation.workspace,
      user: userId,
      isDeleted: false,
    }).session(session);

    if (existingMember) {
      throw new ApiError(409, "Already member");
    }

    const [member] = await WorkspaceMember.create(
      [
        {
          workspace: invitation.workspace,
          user: userId,
          role: invitation.role,
          status: "accepted",
          invitedBy: invitation.invitedBy,
        },
      ],
      { session }
    );

    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    invitation.invitedUser = userId;
    await invitation.save({ session });

    await session.commitTransaction();

    await createActivity({
      workspace: invitation.workspace,
      actor: userId,
      action: "invitation.accepted",
      resourceType: "WorkspaceInvitation",
      resourceId: invitation._id,
      metadata: { email: invitation.email, role: invitation.role },
    });

    await createNotification({
      recipient: invitation.invitedBy,
      actor: userId,
      workspace: invitation.workspace,
      type: "invitation.accepted",
      resourceType: "WorkspaceInvitation",
      resourceId: invitation._id,
      metadata: { email: invitation.email },
    });

    return member.populate("user", "firstName lastName email avatar");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const rejectWorkspaceInvitation = async (
  token: string,
  userId: Types.ObjectId
) => {
  const invitation = await getPendingInvitationByToken(token);
  const user = await User.findById(userId);

  if (!user || user.email.toLowerCase() !== invitation.email) {
    throw new ApiError(403, "This invitation belongs to another email.");
  }

  invitation.status = "rejected";
  invitation.rejectedAt = new Date();
  invitation.invitedUser = userId;
  await invitation.save();

  await createActivity({
    workspace: invitation.workspace,
    actor: userId,
    action: "invitation.rejected",
    resourceType: "WorkspaceInvitation",
    resourceId: invitation._id,
    metadata: { email: invitation.email },
  });

  await createNotification({
    recipient: invitation.invitedBy,
    actor: userId,
    workspace: invitation.workspace,
    type: "invitation.rejected",
    resourceType: "WorkspaceInvitation",
    resourceId: invitation._id,
    metadata: { email: invitation.email },
  });

  return invitation;
};

export const cancelWorkspaceInvitation = async (
  invitationId: Types.ObjectId,
  actor: Types.ObjectId
) => {
  const invitation = await WorkspaceInvitation.findOne({
    _id: invitationId,
    status: "pending",
  });

  if (!invitation) {
    throw new ApiError(404, "Invitation not found");
  }

  invitation.status = "cancelled";
  invitation.cancelledAt = new Date();
  await invitation.save();

  await createActivity({
    workspace: invitation.workspace,
    actor,
    action: "invitation.cancelled",
    resourceType: "WorkspaceInvitation",
    resourceId: invitation._id,
    metadata: { email: invitation.email },
  });

  return invitation;
};

export const resendWorkspaceInvitation = async (
  invitationId: Types.ObjectId,
  actor: Types.ObjectId
) => {
  const invitation = await WorkspaceInvitation.findOne({
    _id: invitationId,
    status: "pending",
  })
    .select("+tokenHash")
    .populate("workspace", "name");

  if (!invitation) {
    throw new ApiError(404, "Invitation not found");
  }

  const token = createInvitationToken();
  invitation.tokenHash = hashToken(token);
  invitation.expiresAt = new Date(Date.now() + INVITATION_EXPIRY_MS);
  await invitation.save();

  const workspace = invitation.workspace as unknown as { name: string };

  await sendMail({
    to: invitation.email,
    subject: `Invitation to join ${workspace.name}`,
    html: buildInvitationEmail(workspace.name, token, invitation.role),
  });

  await createActivity({
    workspace: invitation.workspace as unknown as Types.ObjectId,
    actor,
    action: "invitation.resent",
    resourceType: "WorkspaceInvitation",
    resourceId: invitation._id,
    metadata: { email: invitation.email },
  });

  return sanitizeInvitation(invitation);
};
