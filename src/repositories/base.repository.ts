import { prisma } from "@config/database";
import {
  IFindAllOptions,
  IPaginatedResult,
  IRepository,
} from "./repository.inteface";
import { ApiError } from "@/utils/api-error";
import { Prisma } from "@/generated/prisma/client";
import { httpStatus } from "@/utils/http-status";

export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
> implements IRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly model: keyof typeof prisma,
    protected readonly modelName: string,
  ) {}

  protected get prismaModel(): any {
    return (prisma as any)[this.model];
  }

  async create(data: CreateInput): Promise<T> {
    try {
      return await this.prismaModel.create({
        data,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMany(data: CreateInput[]): Promise<{ count: number }> {
    try {
      return await this.prismaModel.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findById(
    id: string,
    include?: Record<string, any>,
    select?: Record<string, any>,
  ): Promise<T | null> {
    try {
      return await this.prismaModel.findUnique({
        where: { id },
        include,
        select,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findOne(
    where: any,
    include?: Record<string, any>,
    select?: Record<string, any>,
  ): Promise<T | null> {
    try {
      return await this.prismaModel.findFirst({
        where,
        include,
        select,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(
    filter: any = {},
    options: IFindAllOptions = {},
  ): Promise<IPaginatedResult<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        include,
        select,
      } = options;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prismaModel.findMany({
          where: filter,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include,
          select,
        }),
        this.prismaModel.count({ where: filter }),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      return await this.prismaModel.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMany(where: any, data: any): Promise<{ count: number }> {
    try {
      const result = await this.prismaModel.updateMany({
        where,
        data,
      });
      return { count: result.count };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await this.prismaModel.delete({
        where: { id },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMany(where: any): Promise<{ count: number }> {
    try {
      const result = await this.prismaModel.deleteMany({
        where,
      });
      return { count: result.count };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async count(where: any = {}): Promise<number> {
    try {
      return await this.prismaModel.count({ where });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exists(where: any): Promise<boolean> {
    try {
      const count = await this.prismaModel.count({ where });
      return count > 0;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ApiError(
            httpStatus.CONFLICT,
            `Duplicate field value: ${(error.meta?.target as string[])?.join(", ")}`,
          );
        case "P2014":
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Invalid ID: ${error.meta?.target}`,
          );
        case "P2003":
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Foreign key constraint failed",
          );
        case "P2025":
          throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
        default:
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            `Database error: ${error.message}`,
          );
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid data provided to database",
      );
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An unexpected error occurred",
    );
  }
}
