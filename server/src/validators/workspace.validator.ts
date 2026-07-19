import { z } from "zod";

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Workspace name must be at least 3 characters")
      .max(100, "Workspace name cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    logo: z
      .string()
      .url("Logo must be a valid URL")
      .optional(),

    visibility: z
      .enum(["private", "public"])
      .optional(),
  }),
});