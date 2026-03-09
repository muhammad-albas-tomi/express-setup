import { prisma } from "@config/database";
import { IFindAllOptions, IPaginatedResult, IRepository } from "./repository.inteface";
export declare abstract class BaseRepository<T, CreateInput, UpdateInput> implements IRepository<T, CreateInput, UpdateInput> {
    protected readonly model: keyof typeof prisma;
    protected readonly modelName: string;
    constructor(model: keyof typeof prisma, modelName: string);
    protected get prismaModel(): any;
    create(data: CreateInput): Promise<T>;
    createMany(data: CreateInput[]): Promise<{
        count: number;
    }>;
    findById(id: string, include?: Record<string, any>, select?: Record<string, any>): Promise<T | null>;
    findOne(where: any, include?: Record<string, any>, select?: Record<string, any>): Promise<T | null>;
    findAll(filter?: any, options?: IFindAllOptions): Promise<IPaginatedResult<T>>;
    update(id: string, data: UpdateInput): Promise<T>;
    updateMany(where: any, data: any): Promise<{
        count: number;
    }>;
    delete(id: string): Promise<T>;
    deleteMany(where: any): Promise<{
        count: number;
    }>;
    count(where?: any): Promise<number>;
    exists(where: any): Promise<boolean>;
    protected handleError(error: any): never;
}
//# sourceMappingURL=base.repository.d.ts.map