export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export interface IPaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
export interface IFindAllOptions extends IPaginationOptions {
    include?: Record<string, any>;
    select?: Record<string, any>;
}
export interface IRepository<T, CreateInput, UpdateInput> {
    create(data: CreateInput): Promise<T>;
    createMany(data: CreateInput[]): Promise<{
        count: number;
    }>;
    findById(id: string, include?: any, select?: any): Promise<T | null>;
    findOne(where: any, include?: any, select?: any): Promise<T | null>;
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
}
//# sourceMappingURL=repository.inteface.d.ts.map