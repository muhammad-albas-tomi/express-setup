"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
const database_1 = require("@config/database");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super("user", "User");
    }
    async findByEmail(email) {
        return this.findOne({ email });
    }
    async findWithPosts(id) {
        return this.findById(id, {
            posts: {
                where: { published: true },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        });
    }
    async findActiveUsers(options) {
        return this.findAll({ isActive: true }, options);
    }
    async updateLastLogin(id) {
        return this.update(id, { lastLogin: new Date() });
    }
    async getUsersWithStats() {
        try {
            const users = await database_1.prisma.user.findMany({
                include: {
                    _count: {
                        select: {
                            posts: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return users.map((user) => ({
                ...user,
                password: undefined,
                postsCount: user._count.posts,
            }));
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async searchUsers(searchTerm, options) {
        return this.findAll({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
            ],
        }, options);
    }
    async bulkUpdateStatus(userIds, isActive) {
        return this.updateMany({ id: { in: userIds } }, { isActive });
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map