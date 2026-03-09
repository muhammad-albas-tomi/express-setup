// src/config/environment.ts
import dotenv from "dotenv";
import path from "path";

/**
 * Load environment variables dari file .env
 *
 * dotenv.config() membaca file .env dan memuatnya ke process.env
 * path.join(__dirname, "../../.env") = path ke file .env dari config folder
 */
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Environment Configuration Object
 *
 * Object ini berisi semua konfigurasi yang diambil dari environment variables
 * Nilai default diberikan dengan || (OR operator)
 *
 * CONTOH PENGGUNAAN:
 * import { environment } from "@config/environment";
 * console.log(environment.port); // 3000
 */
export const environment = {
  // ============================================
  // APP CONFIGURATION
  // ============================================
  /**
   * Node environment: development, production, atau test
   * Default: "development" jika tidak di-set
   */
  nodeEnv: process.env.NODE_ENV || "development",

  /**
   * Port tempat server berjalan
   * Default: 3000
   */
  port: parseInt(process.env.PORT || "3000", 10),
  //       ↑
  // parseInt(string, radix) = convert string ke number
  // radix 10 = base 10 (desimal)

  /**
   * Nama aplikasi untuk logging dan identifikasi
   * Default: "Express App"
   */
  appName: process.env.APP_NAME || "Express App",

  /**
   * Prefix untuk semua API routes
   * Default: "/api/v1"
   * Contoh: http://localhost:3000/api/v1/users
   */
  apiPrefix: process.env.API_PREFIX || "/api/v1",

  // ============================================
  // JWT CONFIGURATION
  // ============================================
  /**
   * Secret key untuk signing JWT tokens
   * WAJIB di-set! (tanda ! artinya pasti ada nilainya)
   *
   * ⚠️ JANGAN hardcode secret ini di code!
   * ⚠️ Gunakan env variable dan jangan commit ke git!
   *
   * Cara generate secret:
   * - Terminal: openssl rand -base64 32
   * - Online: https://www.uuidgenerator.net/api/guid
   */
  jwtSecret: process.env.JWT_SECRET!,

  /**
   * Masa berlaku access token (dalam menit)
   * Default: 30 menit
   *
   * Setelah 30 menit, user harus login lagi atau pakai refresh token
   */
  jwtAccessExpirationMinutes: parseInt(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES || "30",
    10,
  ),

  /**
   * Masa berlaku refresh token (dalam hari)
   * Default: 7 hari
   *
   * Refresh token dipakai untuk mendapatkan access token baru
   * tanpa user harus login ulang dengan password
   */
  jwtRefreshExpirationDays: parseInt(
    process.env.JWT_REFRESH_EXPIRATION_DAYS || "7",
    10,
  ),

  // ============================================
  // DATABASE CONFIGURATION
  // ============================================
  /**
   * Connection string ke PostgreSQL database
   * WAJIB di-set!
   *
   * FORMAT: postgresql://user:password@host:port/database?schema=public
   *
   * CONTOH:
   * - Local: postgresql://postgres:postgres@localhost:5432/mydb?schema=public
   * - Supabase: postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   */
  databaseUrl: process.env.DATABASE_URL!,

  // ============================================
  // REDIS CONFIGURATION (Optional)
  // ============================================
  /**
   * Connection string ke Redis
   * Opsional, undefined jika tidak dipakai
   *
   * Digunakan untuk:
   * - Caching
   * - Rate limiting
   * - Session storage
   */
  redisUrl: process.env.REDIS_URL,

  // ============================================
  // CORS CONFIGURATION
  // ============================================
  /**
   * Origins yang diizinkan untuk mengakses API
   * Bisa multiple origins, dipisah dengan koma
   *
   * Default: ["http://localhost:3000"]
   *
   * CONTOH DI .ENV:
   * CORS_ORIGIN="http://localhost:3000,http://localhost:5173,https://myapp.com"
   *
   * HASIL:
   * environment.corsOrigin = ["http://localhost:3000", "http://localhost:5173", "https://myapp.com"]
   */
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    // ↑ .split(",") = pecah string jadi array berdasarkan koma
    : ["http://localhost:3000"],

  // ============================================
  // RATE LIMITING CONFIGURATION
  // ============================================
  /**
   * Window time untuk rate limiting (dalam milliseconds)
   * Default: 900000 ms = 15 menit
   *
   * Dalam 15 menit, user hanya bisa request sebanyak RATE_LIMIT_MAX
   */
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),

  /**
   * Maksimal request per window time
   * Default: 100 request per 15 menit
   *
   * Lewat dari ini, user dapat status 429 (Too Many Requests)
   */
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),

  // ============================================
  // FILE UPLOAD CONFIGURATION
  // ============================================
  /**
   * Maksimal ukuran file yang bisa diupload (dalam bytes)
   * Default: 5242880 bytes = 5 MB
   *
   * 1 KB = 1024 bytes
   * 1 MB = 1024 KB = 1048576 bytes
   */
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),

  /**
   * Tipe MIME yang diizinkan untuk upload
   * Default: image/jpeg, image/png
   *
   * CONTOH DI .ENV:
   * ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"
   */
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(",")
    : ["image/jpeg", "image/png"],

  // ============================================
  // EMAIL/SMTP CONFIGURATION
  // ============================================
  /**
   * Konfigurasi SMTP untuk mengirim email
   * Menggunakan Nodemailer
   *
   * HOST: Server SMTP (contoh: smtp.gmail.com)
   * PORT: Port SMTP (587 untuk TLS, 465 untuk SSL)
   * SECURE: true untuk SSL, false untuk TLS
   * USER: Email untuk authentication
   * PASS: Password atau App Password
   */
  smtp: {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    //      ↑
    // Convert string "true"/"false" ke boolean
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  },

  /**
   * Email pengirim untuk email yang dikirim aplikasi
   * Default: "noreply@yourapp.com"
   */
  emailFrom: process.env.EMAIL_FROM || "noreply@yourapp.com",

  // ============================================
  // ENVIRONMENT FLAGS
  // ============================================
  /**
   * Flags untuk conditional logic berdasarkan environment
   *
   * Digunakan untuk:
   * - Log detail query di development
   * - Sembunyikan stack trace di production
   * - Enable/disable fitur tertentu
   *
   * CONTOH PENGGUNAAN:
   * if (environment.isDevelopment) {
   *   console.log("Debug mode");
   * }
   */
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;
// ↑
// as const = membuat object menjadi readonly (tidak bisa diubah)

// ============================================
// VALIDASI REQUIRED VARIABLES
// ============================================
/**
 * Validasi environment variables yang WAJIB ada
 *
 * Jika variable tidak ada, aplikasi akan CRASH dengan pesan error
 * Ini mencegah aplikasi jalan tanpa konfigurasi penting
 *
 * REQUIRED VARIABLES:
 * - DATABASE_URL: Untuk koneksi ke database
 * - JWT_SECRET: Untuk signing JWT tokens
 */
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"] as const;
//                             ↑                      ↑
//                        as const = array readonly

/**
 * Filter untuk menemukan required variables yang TIDAK ADA
 *
 * .filter() = buat array baru dengan elemen yang lolos test
 * !process.env[envVar] = true jika variable undefined/null/empty
 */
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

/**
 * Jika ada variable yang hilang, throw error dan crash aplikasi
 *
 * Alasan crash lebih baik daripada jalan tanpa config penting:
 * - Mencegah error misterius di kemudian hari
 * - Forced developer untuk fix config sebelum deploy
 */
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    //                                                   ↑
    //                                .join() = gabung array jadi string
  );
}
