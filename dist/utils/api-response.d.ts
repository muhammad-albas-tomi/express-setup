import { IPaginatedResult } from "@/repositories/repository.inteface";
export declare class ApiResponse {
    static success<T>(message: string, data?: T, meta?: Record<string, any>): IApiResponse<T>;
    static error(message: string, errors?: any, statusCode?: number): IApiErrorResponse;
    static paginate<T>(data: T[], pagination: IPaginatedResult<T>["pagination"]): IApiPaginatedResponse<T>;
}
export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, any>;
    timestamp: string;
}
export interface IApiErrorResponse {
    success: boolean;
    message: string;
    statusCode: number;
    errors?: any;
    timestamp: string;
}
export interface IApiPaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: IPaginatedResult<T>["pagination"];
    timestamp: string;
}
//# sourceMappingURL=api-response.d.ts.map