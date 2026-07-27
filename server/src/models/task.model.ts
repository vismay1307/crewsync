import { Schema, model, Types } from "mongoose";

export interface ITask {
  _id: Types.ObjectId;

  title: string;

  description?: string;

  project: Types.ObjectId;

  assignee?: Types.ObjectId;

  createdBy: Types.ObjectId;

  status: "todo" | "in_progress" | "review" | "done";

  priority: "low" | "medium" | "high" | "critical";

  startDate?: Date;

  dueDate?: Date;

  completedAt?: Date;

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

export const Task = model<ITask>("Task", taskSchema);