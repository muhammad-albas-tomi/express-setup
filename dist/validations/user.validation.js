"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.getUsersSchema = exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@/generated/prisma/client");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        role: zod_1.z.nativeEnum(client_1.Role).optional(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format").optional(),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters").optional(),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
        role: zod_1.z.nativeEnum(client_1.Role).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid user ID format"),
    }),
});
exports.getUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
        role: zod_1.z.nativeEnum(client_1.Role).optional(),
        isActive: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(1, "Old password is required"),
        newPassword: zod_1.z.string().min(8, "New password must be at least 8 characters"),
    }),
});
//# sourceMappingURL=user.validation.js.map