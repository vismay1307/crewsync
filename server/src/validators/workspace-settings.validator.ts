import { z } from "zod";

import { objectIdSchema } from "./pagination.validator.js";

export const getWorkspaceSettingsSchema = z.object({
  params: z.object({ workspaceId: objectIdSchema }),
});

export const updateWorkspaceSettingsSchema = z.object({
  params: z.object({ workspaceId: objectIdSchema }),
  body: z.object({
    logo: z.string().trim().url().optional(),
    description: z.string().trim().max(500).optional(),
    timezone: z.string().trim().min(1).max(100).optional(),
    defaultRole: z.enum(["admin", "member"]).optional(),
    visibility: z.enum(["private", "public"]).optional(),
    colorTheme: z.string().trim().min(1).max(50).optional(),
  }),
});
