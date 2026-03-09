export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly status: string;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}
