declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
    /**
     * Cookies from request (dari cookie-parser)
     * Contoh: req.cookies?.refresh_token
     */
    cookies?: {
      [key: string]: string | undefined;
    };
    /**
     * Signed cookies from request (dari cookie-parser dengan secret)
     */
    signedCookies?: {
      [key: string]: string | undefined;
    };
  }
}
