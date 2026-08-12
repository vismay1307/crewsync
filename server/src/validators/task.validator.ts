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
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    assignee: objectIdSchema.optional(),
    project: objectIdSchema.optional(),
    labels: z.union([objectIdSchema, z.array(objectIdSchema)]).optional(),
    createdBy: objectIdSchema.optional(),
    overdue: z.coerce.boolean().optional(),
    completed: z.coerce.boolean().optional(),
    startFrom: z.coerce.date().optional(),
    startTo: z.coerce.date().optional(),
    dueFrom: z.coerce.date().optional(),
    dueTo: z.coerce.date().optional(),
    search: z.string().trim().min(1).max(100).optional(),
    archived: z.coerce.boolean().optional(),
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

export const updateTaskDueDateSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
  body: z.object({
    dueDate: z.coerce.date(),
  }),
});

export const updateTaskStartDateSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
  body: z.object({
    startDate: z.coerce.date(),
  }),
});

export const taskArchiveSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
});

export const archivedTasksSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    projectId: objectIdSchema,
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>["body"];

export type UpdateTaskInput = z.infer<
  typeof updateTaskSchema
>["body"];
