import { BaseRepository } from "@repositories/base.repository";
import { IService } from "./service.interface";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import {
  IFindAllOptions,
  IPaginatedResult,
} from "@/repositories/repository.inteface";

export abstract class BaseService<
  T,
  CreateInput,
  UpdateInput,
> implements IService<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly repository: BaseRepository<T, CreateInput, UpdateInput>,
    protected readonly modelName: string,
  ) {}

  async create(data: CreateInput): Promise<T> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string, include?: any): Promise<T> {
    const item = await this.repository.findById(id, include);
    if (!item) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `${this.modelName} not found with id: ${id}`,
      );
    }
    return item;
  }

  async getAll(
    filter: any = {},
    options: IFindAllOptions = {},
  ): Promise<IPaginatedResult<T>> {
    return this.repository.findAll(filter, options);
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    await this.getById(id); // Ensure exists
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<T> {
    await this.getById(id); // Ensure exists
    return this.repository.delete(id);
  }

  async softDelete(id: string): Promise<T> {
    await this.getById(id); // Ensure exists
    // Assuming the model has a deletedAt field
    return this.repository.update(id, {
      deletedAt: new Date(),
    } as unknown as UpdateInput);
  }

  async exists(where: any): Promise<boolean> {
    return this.repository.exists(where);
  }

  protected validateId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }
  }
}
