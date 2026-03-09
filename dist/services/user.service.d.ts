import { User } from "@/generated/prisma/client";
import { BaseService } from "./base.service";
import { ICreateUserInput, IUpdateUserInput, IUserResponse } from "@interfaces/user.interface";
export declare class UserService extends BaseService<User, ICreateUserInput, IUpdateUserInput> {
    constructor();
    private sanitizeUser;
    createUser(userData: ICreateUserInput): Promise<IUserResponse>;
    getUserById(id: string): Promise<IUserResponse>;
    getUserByEmail(email: string): Promise<IUserResponse | null>;
    getAllUsers(query: any): Promise<any>;
    updateUser(id: string, updateData: IUpdateUserInput): Promise<IUserResponse>;
    deleteUser(id: string): Promise<IUserResponse>;
    validatePassword(email: string, password: string): Promise<User | false>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>;
    getUsersWithStats(): Promise<any[]>;
    searchUsers(searchTerm: string, options: any): Promise<any>;
    bulkUpdateStatus(userIds: string[], isActive: boolean): Promise<{
        count: number;
    }>;
    getUserWithPosts(id: string): Promise<any>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map