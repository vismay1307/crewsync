import { Schema, model, Types } from "mongoose";

export interface IWorkspaceMember {
  _id: Types.ObjectId;

  workspace: Types.ObjectId;

  user: Types.ObjectId;

  role: "owner" | "admin" | "member";

  status: "pending" | "accepted";

  invitedBy: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "accepted",
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

workspaceMemberSchema.index(
  {
    workspace: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

export const WorkspaceMember = model<IWorkspaceMember>(
  "WorkspaceMember",
  workspaceMemberSchema
);