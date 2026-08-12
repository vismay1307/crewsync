import { z } from "zod";

import {
  objectIdSchema,
  paginationQuerySchema,
} from "./pagination.validator.js";

export const getWorkspaceActivitySchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
  }),
  query: paginationQuerySchema,
});
