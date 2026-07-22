import { Schema, model, Types } from "mongoose";

export interface IProject {

  _id: Types.ObjectId;

  name: string;

  description?: string;

  emoji?: string;

  workspace: Types.ObjectId;

  owner: Types.ObjectId;

  status: "active" | "archived";

  isDeleted: boolean;

  deletedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    emoji: {
      type: String,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

projectSchema.index({
  workspace: 1,
});

projectSchema.index({
  owner: 1,
});

export const Project = model<IProject>(
  "Project",
  projectSchema
);