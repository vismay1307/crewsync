import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const roleSchema = z.enum(["owner", "admin", "member"]);

export const addWorkspaceMemberSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
  }),

  body: z.object({
    email: z.string().email("Invalid email address"),
    role: roleSchema.default("member"),
  }),
});

export const getWorkspaceMembersSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
  }),
});

export const updateWorkspaceMemberSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    memberId: objectIdSchema,
  }),

  body: z.object({
    role: roleSchema,
  }),
});

export const deleteWorkspaceMemberSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
    memberId: objectIdSchema,
  }),
});

export type AddWorkspaceMemberInput =
  z.infer<typeof addWorkspaceMemberSchema>["body"];

export type UpdateWorkspaceMemberInput =
  z.infer<typeof updateWorkspaceMemberSchema>["body"];