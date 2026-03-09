import { BaseRepository } from "./base.repository";
import { ICreateUserInput, IUpdateUserInput } from "@interfaces/user.interface";
import { User } from "@/generated/prisma/client";
export declare class UserRepository extends BaseRepository<User, ICreateUserInput, IUpdateUserInput> {
    constructor();
    findByEmail(email: string): Promise<User | null>;
    findWithPosts(id: string): Promise<User | null>;
    findActiveUsers(options?: any): Promise<any>;
    updateLastLogin(id: string): Promise<User>;
    getUsersWithStats(): Promise<any[]>;
    searchUsers(searchTerm: string, options?: any): Promise<any>;
    bulkUpdateStatus(userIds: string[], isActive: boolean): Promise<{
        count: number;
    }>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map