// src/utils/ApiResponse.ts

import { IPaginatedResult } from "@/repositories/repository.inteface";

export class ApiResponse {
  static success<T>(
    message: string,
    data?: T,
    meta?: Record<string, any>,
  ): IApiResponse<T> {
    const response: IApiResponse<T> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== undefined) response.data = data;
    if (meta !== undefined) response.meta = meta;

    return response;
  }

  static error(
    message: string,
    errors?: any,
    statusCode: number = 500,
  ): IApiErrorResponse {
    return {
      success: false,
      message,
      statusCode,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  static paginate<T>(
    data: T[],
    pagination: IPaginatedResult<T>["pagination"],
  ): IApiPaginatedResponse<T> {
    return {
      success: true,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    };
  }
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
