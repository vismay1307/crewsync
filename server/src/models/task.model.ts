import { Schema, model, Types } from "mongoose";

export interface ITask {
  _id: Types.ObjectId;

  title: string;

  description?: string;

  project: Types.ObjectId;

  assignee?: Types.ObjectId;
  labels: Types.ObjectId[];

  createdBy: Types.ObjectId;

  status: "todo" | "in_progress" | "review" | "done";

  priority: "low" | "medium" | "high" | "critical";

  startDate?: Date;

  dueDate?: Date;

  completedAt?: Date;
  archivedAt?: Date;
  archivedBy?: Types.ObjectId;
  isArchived: boolean;

  isDeleted: boolean;

  deletedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    labels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Label",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    startDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
    archivedAt: Date,
    archivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: {
      type: Boolean,
      default: false,
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

taskSchema.index({ project: 1, isDeleted: 1, isArchived: 1 });
taskSchema.index({ assignee: 1, status: 1, priority: 1 });
taskSchema.index({ labels: 1 });
taskSchema.index({ title: "text", description: "text" });

export const Task = model<ITask>("Task", taskSchema);
