import { Types } from "mongoose";

import { Activity, ActivityAction } from "../models/activity.model.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

interface CreateActivityInput {
  workspace: Types.ObjectId;
  actor?: Types.ObjectId;
  action: ActivityAction;
  resourceType: string;
  resourceId: Types.ObjectId;
  metadata?: Record<string, unknown>;
}

export const createActivity = async (data: CreateActivityInput) => {
  return Activity.create(data);
};

export const getWorkspaceActivity = async (
  workspaceId: Types.ObjectId,
  page = 1,
  limit = 20
) => {
  const pagination = getPagination({ page, limit });

  const [items, totalItems] = await Promise.all([
    Activity.find({ workspace: workspaceId })
      .populate("actor", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Activity.countDocuments({ workspace: workspaceId }),
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
