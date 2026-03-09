import { z } from "zod";
import { Role } from "@/generated/prisma/client";

// Schema for creating a user
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.nativeEnum(Role).optional(),
  }),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
  }),
});

// Schema for getting a user by ID
export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
});

// Schema for getting all users with query parameters
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    role: z.nativeEnum(Role).optional(),
    isActive: z.string().optional(),
    search: z.string().optional(),
  }),
});

// Schema for changing password
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
  }),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
