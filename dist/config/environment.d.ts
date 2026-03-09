export declare const environment: {
    readonly nodeEnv: string;
    readonly port: number;
    readonly appName: string;
    readonly apiPrefix: string;
    readonly jwtSecret: string;
    readonly jwtAccessExpirationMinutes: number;
    readonly jwtRefreshExpirationDays: number;
    readonly databaseUrl: string;
    readonly redisUrl: string | undefined;
    readonly corsOrigin: string[];
    readonly rateLimitWindowMs: number;
    readonly rateLimitMax: number;
    readonly maxFileSize: number;
    readonly allowedFileTypes: string[];
    readonly smtp: {
        readonly host: string;
        readonly port: number;
        readonly secure: boolean;
        readonly auth: {
            readonly user: string;
            readonly pass: string;
        };
    };
    readonly emailFrom: string;
    readonly isDevelopment: boolean;
    readonly isProduction: boolean;
    readonly isTest: boolean;
};
//# sourceMappingURL=environment.d.ts.map