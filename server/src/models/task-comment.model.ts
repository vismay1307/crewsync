import { Schema, model, Types } from "mongoose";

export interface ITaskComment {
  task: Types.ObjectId;
  workspace: Types.ObjectId;
  user: Types.ObjectId;
  parentComment?: Types.ObjectId;
  body: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskCommentSchema = new Schema<ITaskComment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "TaskComment",
      default: null,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

taskCommentSchema.index({ task: 1, createdAt: -1 });
taskCommentSchema.index({ workspace: 1, createdAt: -1 });

export const TaskComment = model<ITaskComment>(
  "TaskComment",
  taskCommentSchema
);
