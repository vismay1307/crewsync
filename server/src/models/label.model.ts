import { Schema, model, Types } from "mongoose";

export interface ILabel {
  _id: Types.ObjectId;
  workspace: Types.ObjectId;
  name: string;
  color: string;
  description?: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const labelSchema = new Schema<ILabel>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      default: "#64748b",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

labelSchema.index(
  { workspace: 1, name: 1, isDeleted: 1 },
  { unique: true }
);

export const Label = model<ILabel>("Label", labelSchema);
