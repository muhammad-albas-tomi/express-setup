// src/validations/auth.validation.ts
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

/**
 * Refresh Token Validation
 *
 * NOTE: Refresh token sekarang diambil dari httpOnly cookie, bukan dari body!
 * - Body request TIDAK diperlukan untuk endpoint ini
 * - Browser/Postman otomatis mengirim cookie refresh_token
 * - Schema ini optional untuk compatibility, tapi tidak digunakan
 */
export const refreshTokenSchema = z.object({
  body: z.object({}).optional(), // Body tidak diperlukan - token dari cookie
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
