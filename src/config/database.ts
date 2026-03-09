import { PrismaClient } from "../generated/prisma/client";
import { logger } from "@utils/logger";
import { environment } from "./environment";

/**
 * Prisma Manager - Singleton Pattern
 *
 * Class ini mengelola Prisma Client dengan pola Singleton.
 *
 * KONSEP SINGLETON:
 * - Hanya ada SATU instance PrismaClient selama aplikasi berjalan
 * - Setiap pemanggilan getInstance() akan mengembalikan instance yang sama
 *
 * KENAPA SINGLETON?
 * ❌ TANPA SINGLETON:
 *    - Setiap import membuat koneksi database baru
 *    - Bisa menyebabkan connection pool exhausted
 *    - Memory leak dan performance drop
 *
 * ✅ DENGAN SINGLETON:
 *    - Satu koneksi di-share ke seluruh aplikasi
 *    - Efisien dan aman
 *    - Connection pool terkelola dengan baik
 */
class PrismaManager {
  /**
   * Instance variable untuk menyimpan single instance
   *
   * - private: Hanya bisa diakses dari dalam class ini
   * - static: Menempel ke class, bukan instance (bisa diakses tanpa new)
   * - PrismaClient: Tipe datanya
   *
   * Tidak diinisialisasi di sini (undefined), akan dibuat saat getInstance() dipanggil
   */
  private static instance: PrismaClient;

  /**
   * Constructor dibuat private untuk mencegah pembuatan instance baru
   *
   * private constructor = tidak bisa dipanggil dengan "new PrismaManager()"
   * Ini memaksa penggunaan getInstance() untuk mendapatkan instance
   */
  private constructor() {}

  /**
   * getInstance() - Mendapatkan single instance PrismaClient
   *
   * Method ini adalah satu-satunya cara untuk mendapatkan PrismaClient instance
   *
   * FLOW:
   * 1. Cek apakah instance sudah ada
   * 2. Jika belum, buat instance baru dengan konfigurasi logging
   * 3. Jika sudah ada, return instance yang ada
   *
   * @returns PrismaClient instance
   *
   * CONTOH PENGGUNAAN:
   * const prisma = PrismaManager.getInstance();
   * const users = await prisma.user.findMany();
   */
  public static getInstance(): PrismaClient {
    // Cek apakah instance sudah ada
    if (!PrismaManager.instance) {
      // Jika belum, buat instance baru dengan konfigurasi logging
      PrismaManager.instance = new PrismaClient({
        /**
         * Konfigurasi logging Prisma
         *
         * Prisma bisa log 4 level event:
         * - query: Setiap query yang dijalankan
         * - info: Informasi umum
         * - warn: Warning
         * - error: Error
         *
         * emit: "event" = event akan di-emit dan bisa di-listen
         */
        log: [
          { level: "query", emit: "event" },
          { level: "info", emit: "event" },
          { level: "warn", emit: "event" },
          { level: "error", emit: "event" },
        ],
      });

      // Setup logging untuk setiap event
      PrismaManager.setupLogging();
    }

    // Return instance (yang sudah ada atau baru dibuat)
    return PrismaManager.instance;
  }

  /**
   * setupLogging() - Mengatur listener untuk event Prisma
   *
   * Method ini men-setup listener untuk setiap event Prisma
   * dan mengirim log ke Winston logger
   *
   * LOG LEVEL:
   * - Development: Log semua termasuk query
   * - Production: Hanya log info, warn, error
   *
   * EVENT HANDLERS:
   * - $on("query"): Setiap query SQL yang dijalankan
   * - $on("info"): Informasi umum dari Prisma
   * - $on("warn"): Warning
   * - $on("error"): Error database
   */
  private static setupLogging(): void {
    /**
     * QUERY EVENT (hanya di development)
     *
     * Event ini di-trigger setiap kali Prisma menjalankan query
     * Berguna untuk debugging dan melihat performa query
     *
     * CONTOH OUTPUT:
     * [DEBUG] Query: SELECT `id`, `email` FROM `users` WHERE `id` = ?
     *        Params: ["123"]
     *        Duration: 5ms
     */
    if (process.env.NODE_ENV === "development") {
      // Hanya log query di development (biar production tidak lambat)
      PrismaManager.instance.$on("query" as never, (e: any) => {
        //                                ↑
        //                 "as never" = TypeScript trick untuk bypass type error
        //                 Prisma types belum lengkap untuk event handling

        logger.debug(
          `Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`,
          //      ↑           ↑              ↑                ↑
          //   Query SQL   Parameter yang dipakai   Waktu eksekusi
        );
      });
    }

    /**
     * INFO EVENT
     *
     * Event ini di-trigger untuk informasi umum dari Prisma
     * Contoh: "Starting migration", "Database connected", dll.
     */
    PrismaManager.instance.$on("info" as never, (e: any) => {
      logger.info(`Prisma Info: ${e.message}`);
      //   ↑
      // logger.info() = log ke console dan file dengan level INFO
    });

    /**
     * WARN EVENT
     *
     * Event ini di-trigger untuk warning dari Prisma
     * Contoh: "Deprecated feature", "Slow query", dll.
     */
    PrismaManager.instance.$on("warn" as never, (e: any) => {
      logger.warn(`Prisma Warning: ${e.message}`);
      //   ↑
      // logger.warn() = log ke console dan file dengan level WARN
    });

    /**
     * ERROR EVENT
     *
     * Event ini di-trigger untuk error dari Prisma
     * Contoh: "Connection lost", "Query failed", dll.
     */
    PrismaManager.instance.$on("error" as never, (e: any) => {
      logger.error(`Prisma Error: ${e.message}`);
      //   ↑
      // logger.error() = log ke console dan file dengan level ERROR
    });
  }

  /**
   * disconnect() - Menutup koneksi database dengan graceful
   *
   * Method ini dipanggil saat aplikasi akan shutdown
   * Penting untuk menutup koneksi dengan benar sebelum aplikasi mati
   *
   * KAPAN DIPANGGIL:
   * - Saat aplikasi menerima signal SIGTERM (misal: docker stop)
   * - Saat aplikasi menerima signal SIGINT (misal: Ctrl+C)
   * - Saat testing selesai
   *
   * CONTOH PENGGUNAAN:
   * process.on("SIGTERM", async () => {
   *   await prisma.$disconnect();
   *   process.exit(0);
   * });
   */
  public static async disconnect(): Promise<void> {
    if (PrismaManager.instance) {
      // $disconnect() = method Prisma untuk menutup koneksi
      await PrismaManager.instance.$disconnect();
      logger.info("Database disconnected");
    }
  }
}

/**
 * Export Prisma Client instance
 *
 * Ini adalah cara yang digunakan di seluruh aplikasi untuk mengakses Prisma
 *
 * CONTOH PENGGUNAAN:
 * ```typescript
 * import { prisma } from "@config/database";
 *
 * // Query
 * const users = await prisma.user.findMany();
 *
 * // Create
 * const user = await prisma.user.create({
 *   data: { email: "test@example.com", name: "Test" }
 * });
 *
 * // Update
 * await prisma.user.update({
 *   where: { id: "123" },
 *   data: { name: "Updated" }
 * });
 *
 * // Delete
 * await prisma.user.delete({ where: { id: "123" } });
 * ```
 */
export const prisma = PrismaManager.getInstance();
//               ↑
// getInstance() dipanggil sekali di sini
// Setiap import akan mendapatkan instance yang sama
