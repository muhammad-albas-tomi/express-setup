// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "@utils/logger";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";

/**
 * Error Converter Middleware
 *
 * Mengkonversi error apapun menjadi ApiError agar format konsisten
 * Ini adalah middleware PERTAMA yang menangani error
 *
 * FLOW:
 * 1. Terima error apapun (Error, ApiError, dll.)
 * 2. Konversi menjadi ApiError jika belum
 * 3. Kirim ke error middleware berikutnya
 *
 * CONTOH:
 * - Error biasa → ApiError dengan status 500
 * - Error dengan statusCode → ApiError dengan status tersebut
 * - ApiError → Lewati saja
 */
export const errorConverter = (
  err: any, // Error apapun dari middleware/controller sebelumnya
  _req: Request,
  _res: Response,
  next: NextFunction, // next() dengan error akan skip ke error handler middleware
): void => {
  let error = err;

  // Cek apakah error sudah berupa ApiError
  if (!(error instanceof ApiError)) {
    // Jika bukan, konversi menjadi ApiError
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    //                                           ↑ 500
    // Gunakan statusCode dari error jika ada, default 500

    const message = error.message || "Internal server error";

    // Buat ApiError baru
    error = new ApiError(statusCode, message, false, err.stack);
    //                                                   ↑
    //             Kirim stack trace asli untuk debugging
  }

  // Kirim error ke error handler middleware
  next(error);
};

/**
 * Error Handler Middleware
 *
 * Middleware terakhir yang menangani error dan mengirim response ke client
 * Harus didaftarkan PALING AKHIR setelah semua route
 *
 * FLOW:
 * 1. Terima ApiError dari error converter
 * 2. Log error (hanya di development)
 * 3. Kirim response error ke client
 *
 * PERBEDAAN DEVELOPMENT vs PRODUCTION:
 * - Development: Kirim stack trace untuk debugging
 * - Production: JANGAN kirim stack trace (bisa bocorkan info sensitif)
 *
 * CARA PAKAI DI APP.TS:
 * ```typescript
 * // Routes harus sebelum error handler
 * app.use("/api/v1", routes);
 *
 * // Error handler harus PALING AKHIR
 * app.use(errorConverter); // Konversi error
 * app.use(errorHandler);   // Kirim response
 * ```
 */
export const errorHandler = (
  err: ApiError, // Error yang sudah dikonversi oleh errorConverter
  _req: Request,
  res: Response, // Res untuk kirim response ke client
  _next: NextFunction, // Tidak digunakan karena ini middleware terakhir
): void => {
  // Ambil status code dan message dari error
  const { statusCode, message } = err;

  // Log error hanya di development (untuk debugging)
  if (process.env.NODE_ENV === "development") {
    logger.error(err);
    // Di development, log seluruh error object termasuk stack trace
  }

  // Siapkan response object
  const response = {
    code: statusCode, // 400, 404, 500, dll.
    message, // Pesan error
    // Di development, tambahkan stack trace untuk debugging
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    // ↑ Spread operator: tambahkan property stack hanya jika development
  };

  // Kirim response dengan status code yang sesuai
  res.status(statusCode).json(response);
  // Contoh response:
  // {
  //   "code": 404,
  //   "message": "User not found",
  //   "stack": "Error: User not found\n    at ..." (hanya di development)
  // }
};
