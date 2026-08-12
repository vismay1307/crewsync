import { Schema, model, Types } from "mongoose";

export type ActivityAction =
  | "workspace.created"
  | "workspace.updated"
  | "invitation.sent"
  | "invitation.accepted"
  | "invitation.rejected"
  | "invitation.cancelled"
  | "invitation.resent"
  | "project.created"
  | "project.updated"
  | "project.deleted"
  | "task.created"
  | "task.updated"
  | "task.deleted"
  | "task.assigned"
  | "comment.added"
  | "comment.edited"
  | "comment.deleted"
  | "label.created"
  | "label.updated"
  | "label.deleted"
  | "label.assigned"
  | "label.removed"
  | "task.due_date_updated"
  | "task.due_date_removed"
  | "task.start_date_updated"
  | "task.archived"
  | "task.restored"
  | "project.archived"
  | "project.restored"
  | "workspace.settings_updated";

export interface IActivity {
  workspace: Types.ObjectId;
  actor?: Types.ObjectId;
  action: ActivityAction;
  resourceType: string;
  resourceId: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      trim: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

activitySchema.index({ workspace: 1, createdAt: -1 });
activitySchema.index({ resourceType: 1, resourceId: 1 });

export const Activity = model<IActivity>("Activity", activitySchema);
