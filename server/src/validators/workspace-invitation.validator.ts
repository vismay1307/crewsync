import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const roleSchema = z.enum([
  "admin",
  "member",
]);

export const createWorkspaceInvitationSchema =
  z.object({
    params: z.object({
      workspaceId: objectIdSchema,
    }),

    body: z.object({
      email: z
        .string()
        .trim()
        .email("Invalid email address"),

      role: roleSchema.default("member"),
    }),
  });

export const getWorkspaceInvitationsSchema =
  z.object({
    params: z.object({
      workspaceId: objectIdSchema,
    }),
  });

export const acceptWorkspaceInvitationSchema =
  z.object({
    params: z.object({
      token: z.string().min(1),
    }),
  });

export const rejectWorkspaceInvitationSchema =
  z.object({
    params: z.object({
      token: z.string().min(1),
    }),
  });

export const cancelWorkspaceInvitationSchema =
  z.object({
    params: z.object({
      invitationId: objectIdSchema,
    }),
  });

export const resendWorkspaceInvitationSchema =
  z.object({
    params: z.object({
      invitationId: objectIdSchema,
    }),
  });

export type CreateWorkspaceInvitationInput =
  z.infer<
    typeof createWorkspaceInvitationSchema
  >["body"];