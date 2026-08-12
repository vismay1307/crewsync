import { Schema, model, Types } from "mongoose";

export type NotificationType =
  | "task.assigned"
  | "task.status_updated"
  | "comment.added"
  | "invitation.accepted"
  | "invitation.rejected"
  | "project.created"
  | "task.archived"
  | "task.restored"
  | "task.due_date_updated"
  | "label.assigned"
  | "project.archived"
  | "project.restored";

export interface INotification {
  recipient: Types.ObjectId;
  actor?: Types.ObjectId;
  workspace?: Types.ObjectId;
  type: NotificationType;
  resourceType?: string;
  resourceId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      trim: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    readAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, readAt: 1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
