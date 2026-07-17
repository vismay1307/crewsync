import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .trim(),

  email: z
    .email("Invalid email address")
    .transform((email) => email.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type SignupData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),

  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;