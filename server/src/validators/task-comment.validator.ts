import { z } from "zod";

import {
  objectIdSchema,
  paginationQuerySchema,
} from "./pagination.validator.js";

export const createTaskCommentSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
  body: z.object({
    body: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty.")
      .max(5000, "Comment cannot exceed 5000 characters."),
  }),
});

export const getTaskCommentsSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
  query: paginationQuerySchema,
});

export const updateTaskCommentSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
    commentId: objectIdSchema,
  }),
  body: z.object({
    body: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty.")
      .max(5000, "Comment cannot exceed 5000 characters."),
  }),
});

export const deleteTaskCommentSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
    commentId: objectIdSchema,
  }),
});

export type CreateTaskCommentInput = z.infer<
  typeof createTaskCommentSchema
>["body"];

export type UpdateTaskCommentInput = z.infer<
  typeof updateTaskCommentSchema
>["body"];
