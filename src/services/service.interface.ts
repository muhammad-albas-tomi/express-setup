import {
  IFindAllOptions,
  IPaginatedResult,
} from "@/repositories/repository.inteface";

export interface IService<T, CreateInput, UpdateInput> {
  create(data: CreateInput): Promise<T>;
  getById(id: string, include?: any): Promise<T>;
  getAll(filter?: any, options?: IFindAllOptions): Promise<IPaginatedResult<T>>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
  softDelete?(id: string): Promise<T>;
  exists(where: any): Promise<boolean>;
}
