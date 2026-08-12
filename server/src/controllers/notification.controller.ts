import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notification.service.js";

export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await getNotifications(
      req.user!._id,
      Number(req.query.page ?? 1),
      Number(req.query.limit ?? 20)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Notifications fetched successfully",
          notifications
        )
      );
  }
);

export const markNotificationReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await markNotificationRead(
      new Types.ObjectId(String(req.params.notificationId)),
      req.user!._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Notification marked as read",
          notification
        )
      );
  }
);

export const markAllNotificationsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await markAllNotificationsRead(req.user!._id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Notifications marked as read",
          result
        )
      );
  }
);

export const getUnreadNotificationCountController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getUnreadNotificationCount(req.user!._id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Unread notification count fetched successfully",
          result
        )
      );
  }
);
