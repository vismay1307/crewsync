import { Types } from "mongoose";

import {
  Notification,
  NotificationType,
} from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

interface CreateNotificationInput {
  recipient: Types.ObjectId;
  actor?: Types.ObjectId;
  workspace?: Types.ObjectId;
  type: NotificationType;
  resourceType?: string;
  resourceId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
}

export const createNotification = async (
  data: CreateNotificationInput
) => {
  if (data.actor && data.actor.equals(data.recipient)) {
    return null;
  }

  return Notification.create(data);
};

export const createNotifications = async (
  notifications: CreateNotificationInput[]
) => {
  const filtered = notifications.filter(
    (notification) =>
      !notification.actor ||
      !notification.actor.equals(notification.recipient)
  );

  if (!filtered.length) {
    return [];
  }

  return Notification.insertMany(filtered);
};

export const getNotifications = async (
  recipient: Types.ObjectId,
  page = 1,
  limit = 20
) => {
  const pagination = getPagination({ page, limit });

  const [items, totalItems] = await Promise.all([
    Notification.find({ recipient })
      .populate("actor", "firstName lastName email avatar")
      .populate("workspace", "name")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Notification.countDocuments({ recipient }),
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

export const markNotificationRead = async (
  notificationId: Types.ObjectId,
  recipient: Types.ObjectId
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (!notification.readAt) {
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
};

export const markAllNotificationsRead = async (
  recipient: Types.ObjectId
) => {
  const result = await Notification.updateMany(
    { recipient, readAt: { $exists: false } },
    { $set: { readAt: new Date() } }
  );

  return { modifiedCount: result.modifiedCount };
};

export const getUnreadNotificationCount = async (
  recipient: Types.ObjectId
) => {
  const count = await Notification.countDocuments({
    recipient,
    readAt: { $exists: false },
  });

  return { count };
};
