export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly status: string;
    constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
    toJSON(): {
        stack?: string | undefined;
        status: string;
        statusCode: number;
        message: string;
    };
}
//# sourceMappingURL=api-error.d.ts.map