import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            readonly ADMIN: "ADMIN";
            readonly USER: "USER";
            readonly MODERATOR: "MODERATOR";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<{
            readonly ADMIN: "ADMIN";
            readonly USER: "USER";
            readonly MODERATOR: "MODERATOR";
        }>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getUsersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        role: z.ZodOptional<z.ZodEnum<{
            readonly ADMIN: "ADMIN";
            readonly USER: "USER";
            readonly MODERATOR: "MODERATOR";
        }>>;
        isActive: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        oldPassword: z.ZodString;
        newPassword: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
//# sourceMappingURL=user.validation.d.ts.map