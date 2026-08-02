import { Schema, model, Types } from "mongoose";

export interface IWorkspaceInvitation {
  workspace: Types.ObjectId;

  email: string;

  invitedUser?: Types.ObjectId;

  invitedBy: Types.ObjectId;

  role: "admin" | "member";

  token: string;

  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "expired"
    | "cancelled";

  expiresAt: Date;

  acceptedAt?: Date;

  rejectedAt?: Date;

  cancelledAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const workspaceInvitationSchema =
  new Schema<IWorkspaceInvitation>(
    {
      workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      invitedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      invitedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },

      token: {
        type: String,
        required: true,
        unique: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "accepted",
          "rejected",
          "expired",
          "cancelled",
        ],
        default: "pending",
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      acceptedAt: Date,

      rejectedAt: Date,

      cancelledAt: Date,
    },
    {
      timestamps: true,
    }
  );

workspaceInvitationSchema.index({
  workspace: 1,
  email: 1,
  status: 1,
});

export const WorkspaceInvitation =
  model<IWorkspaceInvitation>(
    "WorkspaceInvitation",
    workspaceInvitationSchema
  );