import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(150, "Title cannot exceed 150 characters."),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters.")
      .optional(),

    assignee: objectIdSchema.optional(),

    status: z
      .enum(["todo", "in_progress", "review", "done"])
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "critical"])
      .optional(),

    startDate: z.coerce.date().optional(),

    dueDate: z.coerce.date().optional(),
  }),

  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
  }),
});

export const getTasksSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
});

export const updateTaskSchema = z.object({
  body: createTaskSchema.shape.body.partial(),

  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
});

export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>["body"];

export type UpdateTaskInput = z.infer<
  typeof updateTaskSchema
>["body"];