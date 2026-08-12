import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getNotificationsSchema,
  markNotificationReadSchema,
} from "../validators/notification.validator.js";
import {
  getNotificationsController,
  getUnreadNotificationCountController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../controllers/notification.controller.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  validate(getNotificationsSchema),
  getNotificationsController
);

router.get(
  "/unread-count",
  verifyJWT,
  getUnreadNotificationCountController
);

router.patch(
  "/read-all",
  verifyJWT,
  markAllNotificationsReadController
);

router.patch(
  "/:notificationId/read",
  verifyJWT,
  validate(markNotificationReadSchema),
  markNotificationReadController
);

export default router;
