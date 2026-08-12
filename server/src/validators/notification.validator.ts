import { z } from "zod";

import {
  objectIdSchema,
  paginationQuerySchema,
} from "./pagination.validator.js";

export const getNotificationsSchema = z.object({
  query: paginationQuerySchema,
});

export const markNotificationReadSchema = z.object({
  params: z.object({
    notificationId: objectIdSchema,
  }),
});
