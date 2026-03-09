// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import { Role } from "@/generated/prisma/client";
import { authService } from "@/services/auth.service";

/**
 * Authentication Middleware
 *
 * Memvalidasi JWT token dari request header dan menambahkan user data ke req.user
 *
 * FLOW:
 * 1. Ambil token dari Authorization header (format: "Bearer <token>")
 * 2. Verifikasi token
 * 3. Tambahkan user data ke req.user untuk digunakan di handler berikutnya
 *
 * CONTOH PENGGUNAAN:
 * ```typescript
 * router.get("/profile", authenticate, userController.getProfile);
 * //                     ↑
 * //      Middleware ini akan berjalan sebelum controller
 * ```
 */
export const authenticate = async (
  req: Request,
  _res: Response, // _ prefix = parameter tidak digunakan (menghindari warning TypeScript)
  next: NextFunction, // Function untuk lanjut ke middleware berikutnya
): Promise<void> => {
  try {
    // Ambil token dari Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const token = req.headers.authorization?.replace("Bearer ", "");
    //                                     ↑
    //             Hapus prefix "Bearer " untuk dapat token murni

    // Jika token tidak ada, throw error
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    // Verifikasi token dan dapatkan user data
    const user = await authService.verifyToken(token);
    // verifyToken akan:
    // 1. Decode token
    // 2. Cek apakah token expired
    // 3. Cek apakah session ada di database
    // 4. Return user data jika valid

    // Hapus password dari user object sebelum disimpan ke req.user
    // { password: _, ...userWithoutPassword } = destructuring dengan exclude password
    const { password: _, ...userWithoutPassword } = user as any;
    //         ↑        ↑
    //      nama variable dengan _ = variable tidak digunakan
    req.user = userWithoutPassword;
    // ↑
    // req.user sekarang berisi data user tanpa password
    // Bisa diakses di controller: req.user.id, req.user.email, dll.

    // Lanjut ke middleware/controller berikutnya
    next();
  } catch (error) {
    // Jika ada error, kirim ke error middleware
    next(error);
  }
};

/**
 * Authorization Middleware Factory
 *
 * Membuat middleware untuk mengecek apakah user punya role yang sesuai
 * Harus digunakan SETELAH authenticate middleware
 *
 * FLOW:
 * 1. Cek apakah req.user ada (sudah authenticate)
 * 2. Cek apakah role user ada di daftar role yang diizinkan
 *
 * CONTOH PENGGUNAAN:
 * ```typescript
 * // Hanya admin yang bisa akses
 * router.delete("/users/:id", authenticate, authorize("ADMIN"), userController.delete);
 *
 * // Admin dan moderator yang bisa akses
 * router.post("/posts", authenticate, authorize("ADMIN", "MODERATOR"), postController.create);
 *
 * // Semua user yang sudah login bisa akses
 * router.get("/profile", authenticate, authorize(), userController.getProfile);
 * ```
 */
export const authorize = (...roles: Role[]) => {
  //            ↑
  //     ...roles = rest parameter, mengumpulkan semua argumen menjadi array
  //     authorize("ADMIN", "MODERATOR") → roles = ["ADMIN", "MODERATOR"]

  // Return middleware function
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Cek apakah user sudah authenticate (req.user ada)
    if (!req.user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Authentication required"),
      );
    }

    // Jika ada role yang diizinkan, cek apakah role user ada di dalamnya
    if (roles.length > 0 && !roles.includes(req.user.role as Role)) {
      //             ↑
      //      .includes() cek apakah array mengandung value tertentu
      return next(
        new ApiError(httpStatus.FORBIDDEN, "Insufficient permissions"),
        //                                      ↑
        //                         403 Forbidden = user sudah login tapi tidak punya akses
      );
    }

    // User punya role yang sesuai, lanjut ke controller
    next();
  };
};
