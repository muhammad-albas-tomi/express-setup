import { CookieOptions } from "express";

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true, // JS tidak bisa baca
  secure: true, // Hanya HTTPS
  sameSite: "strict", // Mencegah CSRF
  path: "/", // Available di semua path
  maxAge: 7 * 24 * 60 * 60, // 7 hari (detik)
};

export const REFRESH_TOKEN_COOKIE = "refresh_token";
