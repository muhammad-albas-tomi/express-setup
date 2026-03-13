import { CookieOptions } from "express";

/**
 * Cookie configuration untuk refresh token
 *
 * Kenapa httpOnly?
 * - JavaScript tidak bisa akses cookie (mencegah XSS mencuri token)
 * - Browser otomatis kirim cookie di setiap request
 *
 * Kenapa secure?
 * - Hanya kirim cookie via HTTPS (mencegah MITM attack)
 *
 * Kenapa sameSite strict?
 * - Mencegah CSRF attack
 * - Cookie hanya dikirim untuk same-site request
 */
export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true, // JS tidak bisa baca cookie
  secure: true, // Hanya kirim via HTTPS (untuk dev, bisa set false)
  sameSite: "strict", // Mencegah CSRF
  path: "/", // Available di semua path
  maxAge: 7 * 24 * 60 * 60, // 7 hari (detik) - sesuai refresh token expiry
};

/**
 * Nama cookie untuk refresh token
 */
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/**
 * Cookie config untuk development (secure: false untuk HTTP)
 */
export const getCookieConfig = (): CookieOptions => {
  return {
    ...COOKIE_CONFIG,
    secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
  };
};
