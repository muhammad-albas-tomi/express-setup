import { User } from "@/generated/prisma/client";
import { ILoginResponse, ITokens, ICreateUserInput } from "@/interfaces/user.interface";
interface Session {
    id: string;
    token: string;
    userId: string;
    ipAddress: string | null;
    userAgent: string | null;
    expiresAt: Date;
    createdAt: Date;
}
export declare class AuthService {
    private static readonly ACCESS_TOKEN_EXPIRY;
    private static readonly REFRESH_TOKEN_EXPIRY;
    private static readonly REFRESH_TOKEN_SIZE;
    private generateToken;
    private generateRefreshToken;
    private generateAuthTokens;
    register(userData: ICreateUserInput): Promise<ILoginResponse>;
    login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<ILoginResponse>;
    logout(token: string): Promise<void>;
    refreshAuth(refreshToken: string): Promise<ITokens>;
    verifyToken(token: string): Promise<User>;
    getActiveSessions(userId: string): Promise<Session[]>;
    revokeSession(sessionId: string): Promise<void>;
    revokeAllUserSessions(userId: string): Promise<void>;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map