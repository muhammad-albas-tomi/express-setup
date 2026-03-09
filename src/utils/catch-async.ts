import { AsyncRequestHandler } from "@/controllers/controller.interface";
import { Request, Response, NextFunction } from "express";

/**
 * Catch Async Wrapper
 *
 * Fungsi wrapper untuk menangani error di async route handler.
 * Tanpa wrapper ini, jika ada error di async function, error tidak akan tertangkap.
 *
 * PROBLEM (tanpa wrapper):
 * - Error di async function tidak otomatis masuk ke error middleware Express
 * - Aplikasi bisa hang/crash
 *
 * SOLUTION (dengan wrapper):
 * - Menangkap error dengan .catch()
 * - Mengirim error ke next() untuk diproses error middleware
 *
 * CONTOH PENGGUNAAN:
 * ```typescript
 * // ❌ TANPA WRAPPER (Error tidak tertangkap dengan benar)
 * router.get("/users", async (req, res) => {
 *   const users = await userService.getAll(); // Jika error, bisa jadi masalah
 *   res.json(users);
 * });
 *
 * // ✅ DENGAN WRAPPER (Error tertangkap dan dikirim ke error middleware)
 * router.get("/users", catchAsync(async (req, res) => {
 *   const users = await userService.getAll(); // Error akan di-catch
 *   res.json(users);
 * }));
 * ```
 */
export const catchAsync = (fn: AsyncRequestHandler) => {
  // Mengembalikan function baru yang membungkus async function
  return (req: Request, res: Response, next: NextFunction): void => {
    // Jalankan async function dan tangkap error dengan .catch()
    // Jika ada error, kirim ke next() untuk diproses error middleware
    fn(req, res, next).catch(next);
    //                   ↑
    //         next() di sini akan mengirim error ke error middleware
  };
};
