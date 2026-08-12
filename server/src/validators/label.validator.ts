import { z } from "zod";

import {
  objectIdSchema,
  paginationQuerySchema,
} from "./pagination.validator.js";

const sortQuerySchema = paginationQuerySchema.extend({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const createLabelSchema = z.object({
  params: z.object({ workspaceId: objectIdSchema }),
  body: z.object({
    name: z.string().trim().min(1).max(50),
    color: z
      .string()
      .trim()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      .default("#64748b"),
    description: z.string().trim().max(250).optional(),
  }),
});

export const getLabelsSchema = z.object({
  params: z.object({ workspaceId: objectIdSchema }),
  query: sortQuerySchema,
});

export const updateLabelSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    labelId: objectIdSchema,
  }),
  body: createLabelSchema.shape.body.partial(),
});

export const deleteLabelSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    labelId: objectIdSchema,
  }),
});

export const taskLabelsSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
  body: z.object({
    labels: z.array(objectIdSchema).min(1).max(25),
  }),
});

export type CreateLabelInput = z.infer<
  typeof createLabelSchema
>["body"];

export type UpdateLabelInput = z.infer<
  typeof updateLabelSchema
>["body"];
