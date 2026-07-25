import { z } from "zod";

export const createProjectSchema = z.object({

    params: z.object({

        workspaceId: z
            .string()
            .regex(
                /^[a-f\d]{24}$/i,
                "Invalid workspace id"
            )

    }),

    body: z.object({

        name: z
            .string()
            .trim()
            .min(3)
            .max(100),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        emoji: z
            .string()
            .trim()
            .optional()

    })

});

export type CreateProjectInput =
    z.infer<typeof createProjectSchema>["body"];

    export const getProjectsSchema = z.object({
  params: z.object({
    workspaceId: z
      .string()
      .regex(
        /^[a-f\d]{24}$/i,
        "Invalid workspace id"
      ),
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    projectId: z
      .string()
      .regex(
        /^[a-f\d]{24}$/i,
        "Invalid project id"
      ),
  }),
});

export const updateProjectSchema = z.object({

    params: z.object({

        workspaceId: z
            .string()
            .regex(
                /^[a-f\d]{24}$/i,
                "Invalid workspace id"
            ),

        projectId: z
            .string()
            .regex(
                /^[a-f\d]{24}$/i,
                "Invalid project id"
            )

    }),

    body: z.object({

        name: z
            .string()
            .trim()
            .min(3)
            .max(100)
            .optional(),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        emoji: z
            .string()
            .trim()
            .optional(),

        status: z
            .enum([
                "active",
                "archived"
            ])
            .optional()

    })

});
export type UpdateProjectInput =
z.infer<
typeof updateProjectSchema
>["body"];