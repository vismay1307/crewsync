import { Types } from "mongoose";
import { z } from "zod";
import { Workspace } from "../models/workspace.model.js";
import ApiError from "../utils/ApiError.js";

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
export type CreateWorkspaceInput =
  z.infer<typeof createWorkspaceSchema>["body"];

  export const getWorkspaceSchema = z.object({
  params: z.object({
    workspaceId: z.string().min(1),
  }),
});

export const updateWorkspaceSchema = z.object({
  params: z.object({
    workspaceId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "Invalid workspace id"),
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3, "Workspace name must be at least 3 characters")
        .max(100, "Workspace name cannot exceed 100 characters")
        .optional(),

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
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required",
      }
    ),
});

export type UpdateWorkspaceInput =
  z.infer<typeof updateWorkspaceSchema>["body"];

  export const deleteWorkspace = async (
  workspaceId: Types.ObjectId,
  ownerId: Types.ObjectId
) => {

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!workspace) {
    throw new ApiError(
      404,
      "Workspace not found"
    );
  }

  workspace.isDeleted = true;
  workspace.deletedAt = new Date();

  await workspace.save();

  return;
};