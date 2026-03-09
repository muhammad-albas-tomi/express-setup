import { BaseRepository } from "@repositories/base.repository";
import { IService } from "./service.interface";
import { IFindAllOptions, IPaginatedResult } from "@/repositories/repository.inteface";
export declare abstract class BaseService<T, CreateInput, UpdateInput> implements IService<T, CreateInput, UpdateInput> {
    protected readonly repository: BaseRepository<T, CreateInput, UpdateInput>;
    protected readonly modelName: string;
    constructor(repository: BaseRepository<T, CreateInput, UpdateInput>, modelName: string);
    create(data: CreateInput): Promise<T>;
    getById(id: string, include?: any): Promise<T>;
    getAll(filter?: any, options?: IFindAllOptions): Promise<IPaginatedResult<T>>;
    update(id: string, data: UpdateInput): Promise<T>;
    delete(id: string): Promise<T>;
    softDelete(id: string): Promise<T>;
    exists(where: any): Promise<boolean>;
    protected validateId(id: string): void;
}
//# sourceMappingURL=base.service.d.ts.map