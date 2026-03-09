import { prisma } from "@config/database";
import {
  IFindAllOptions,
  IPaginatedResult,
  IRepository,
} from "./repository.inteface";
import { ApiError } from "@/utils/api-error";
import { Prisma } from "@/generated/prisma/client";
import { httpStatus } from "@/utils/http-status";

/**
 * Base Repository
 *
 * Class abstrak yang menyediakan operasi CRUD dasar untuk semua model.
 * Setiap repository harus extend class ini.
 *
 * KONSEP GENERIC TYPES:
 * <T, CreateInput, UpdateInput>
 * - T: Tipe data model (misal: User, Product)
 * - CreateInput: Tipe data untuk create (misal: Prisma.UserCreateInput)
 * - UpdateInput: Tipe data untuk update (misal: Prisma.UserUpdateInput)
 *
 * CONTOH PENGGUNAAN:
 * ```typescript
 * class UserRepository extends BaseRepository<
 *   User,                    // T = Model User
 *   Prisma.UserCreateInput,  // CreateInput = Input untuk create
 *   Prisma.UserUpdateInput   // UpdateInput = Input untuk update
 * > {
 *   constructor() {
 *     super("user", "User"); // Nama model di Prisma
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<
  T,           // Tipe data model (generic)
  CreateInput, // Tipe data untuk create (generic)
  UpdateInput, // Tipe data untuk update (generic)
> implements IRepository<T, CreateInput, UpdateInput> {
  /**
   * Constructor
   *
   * @param model - Nama model di Prisma (misal: "user", "product")
   * @param modelName - Nama model untuk pesan error (misal: "User", "Product")
   *
   * protected = bisa diakses dari child class
   * readonly = tidak bisa diubah setelah di-set
   */
  constructor(
    protected readonly model: keyof typeof prisma,
    //                    ↑
    //     keyof typeof prisma = kunci-kunci dari object prisma
    //     Jadi hanya bisa: "user", "post", "session", dll. (yang ada di prisma)
    protected readonly modelName: string,
  ) {}

  /**
   * Getter untuk Prisma Model
   *
   * Mengembalikan Prisma model berdasarkan nama model
   *
   * CONTOH:
   * - this.model = "user"
   * - this.prismaModel = prisma.user
   *
   * Kenapa pakai getter?
   * - Supaya akses ke Prisma model dinamis berdasarkan this.model
   * - Bisa dipanggil dengan this.prismaModel.findMany()
   */
  protected get prismaModel(): any {
    return (prisma as any)[this.model];
    //              ↑     ↑
    //         Cast ke any supaya bisa akses property dengan string key
    //         [this.model] = akses property dinamis (misal: "user")
  }

  /**
   * Create - Membuat record baru
   *
   * @param data - Data untuk record baru
   * @returns Record yang baru dibuat
   */
  async create(data: CreateInput): Promise<T> {
    try {
      return await this.prismaModel.create({
        data,
      });
    } catch (error) {
      // Konversi Prisma error menjadi ApiError
      throw this.handleError(error);
    }
  }

  /**
   * Create Many - Membuat banyak record sekaligus
   *
   * @param data - Array of data untuk dibuat
   * @returns Jumlah record yang berhasil dibuat
   */
  async createMany(data: CreateInput[]): Promise<{ count: number }> {
    try {
      return await this.prismaModel.createMany({
        data,
        skipDuplicates: true, // Lewati record yang duplicate (tidak error)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find By ID - Mencari record berdasarkan ID
   *
   * @param id - ID record
   * @param include - Relation yang ingin di-include (opsional)
   * @param select - Field yang ingin dipilih (opsional)
   * @returns Record atau null jika tidak ditemukan
   *
   * CONTOH:
   * findById("123", { posts: true }) → User dengan posts
   * findById("123", {}, { id: true, name: true }) → Hanya id dan name
   */
  async findById(
    id: string,
    include?: Record<string, any>,
    select?: Record<string, any>,
  ): Promise<T | null> {
    try {
      return await this.prismaModel.findUnique({
        // ↑
        // findUnique = cari berdasarkan unique field (ID, email, dll.)
        where: { id },
        include, // Include relation (misal: { posts: true })
        select,  // Select field spesifik (misal: { id: true, name: true })
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find One - Mencari SATU record berdasarkan kondisi
   *
   * @param where - Kondisi pencarian
   * @param include - Relation yang ingin di-include (opsional)
   * @param select - Field yang ingin dipilih (opsional)
   * @returns Record pertama yang cocok atau null
   *
   * CONTOH:
   * findOne({ email: "test@example.com" }) → User dengan email tersebut
   * findOne({ name: { contains: "John" } }) → User yang namanya mengandung "John"
   *
   * BEDANYA findUnique vs findFirst:
   * - findUnique: Hanya untuk field yang UNIQUE (ID, email, dll.)
   * - findFirst: Untuk kondisi apapun, ambil record pertama
   */
  async findOne(
    where: any,
    include?: Record<string, any>,
    select?: Record<string, any>,
  ): Promise<T | null> {
    try {
      return await this.prismaModel.findFirst({
        where, // Kondisi bebas (bukan harus unique)
        include,
        select,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find All - Mencari banyak record dengan PAGINASI
   *
   * @param filter - Kondisi filter (opsional, default: {})
   * @param options - Opsi paginasi (page, limit, sortBy, dll.)
   * @returns Data + pagination info
   *
   * CONTOH:
   * findAll({ isActive: true }, { page: 1, limit: 10 })
   * → 10 user aktif di halaman 1
   *
   * OUTPUT:
   * {
   *   data: [...],
   *   pagination: {
   *     page: 1,
   *     limit: 10,
   *     total: 100,
   *     totalPages: 10,
   *     hasNextPage: true,
   *     hasPrevPage: false
   *   }
   * }
   */
  async findAll(
    filter: any = {},
    options: IFindAllOptions = {},
  ): Promise<IPaginatedResult<T>> {
    try {
      // Destructure options dengan default values
      const {
        page = 1,           // Halaman ke-1
        limit = 10,         // 10 data per halaman
        sortBy = "createdAt", // Urut berdasarkan createdAt
        sortOrder = "desc", // Urutan descending (terbaru dulu)
        include,
        select,
      } = options;

      // Hitung skip (berapa data yang dilewati)
      // Page 1: skip 0
      // Page 2: skip 10
      // Page 3: skip 20
      const skip = (page - 1) * limit;

      // Jalankan 2 query secara PARALEL dengan Promise.all
      const [data, total] = await Promise.all([
        // Query 1: Ambil data dengan pagination
        this.prismaModel.findMany({
          where: filter,    // Filter data
          skip,            // Lewati N data
          take: limit,     // Ambil N data
          orderBy: { [sortBy]: sortOrder }, // Urut berdasarkan field
          //     ↑
          // [sortBy] = computed property name
          // sortBy = "createdAt" → { createdAt: "desc" }
          include,
          select,
        }),
        // Query 2: Hitung total data (tanpa pagination)
        this.prismaModel.count({ where: filter }),
      ]);
      // Promise.all = jalankan kedua query secara bersamaan (lebih cepat)

      // Return data + pagination info
      return {
        data,
        pagination: {
          page,
          limit,
          total, // Total semua data
          totalPages: Math.ceil(total / limit), // 100 / 10 = 10 halaman
          //           ↑
          // Math.ceil = pembulatan ke atas
          hasNextPage: page * limit < total, // Apakah ada halaman berikutnya?
          //                     ↑
          //         Jika (1 * 10) < 100, true = ada halaman 2
          hasPrevPage: page > 1, // Apakah ada halaman sebelumnya?
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update - Update record berdasarkan ID
   *
   * @param id - ID record
   * @param data - Data baru (hanya field yang berubah)
   * @returns Record yang sudah di-update
   *
   * CONTOH:
   * update("123", { name: "New Name" }) → Update nama user
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      return await this.prismaModel.update({
        where: { id },
        data, // Hanya field yang di-update (partial update)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update Many - Update banyak record sekaligus
   *
   * @param where - Kondisi record yang ingin di-update
   * @param data - Data baru
   * @returns Jumlah record yang di-update
   *
   * CONTOH:
   * updateMany({ isActive: false }, { isActive: true })
   * → Aktifkan semua user yang non-aktif
   */
  async updateMany(where: any, data: any): Promise<{ count: number }> {
    try {
      const result = await this.prismaModel.updateMany({
        where, // Filter record yang ingin di-update
        data,  // Data baru
      });
      return { count: result.count }; // Return jumlah yang di-update
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete - Hapus record berdasarkan ID
   *
   * @param id - ID record
   * @returns Record yang dihapus
   */
  async delete(id: string): Promise<T> {
    try {
      return await this.prismaModel.delete({
        where: { id },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete Many - Hapus banyak record sekaligus
   *
   * @param where - Kondisi record yang ingin dihapus
   * @returns Jumlah record yang dihapus
   *
   * CONTOH:
   * deleteMany({ isActive: false }) → Hapus semua user non-aktif
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    try {
      const result = await this.prismaModel.deleteMany({
        where,
      });
      return { count: result.count };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Count - Hitung jumlah record
   *
   * @param where - Kondisi filter (opsional)
   * @returns Jumlah record
   */
  async count(where: any = {}): Promise<number> {
    try {
      return await this.prismaModel.count({ where });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Exists - Cek apakah ada record yang cocok dengan kondisi
   *
   * @param where - Kondisi pencarian
   * @returns true jika ada, false jika tidak ada
   *
   * CONTOH:
   * exists({ email: "test@example.com" }) → true jika email sudah terdaftar
   */
  async exists(where: any): Promise<boolean> {
    try {
      const count = await this.prismaModel.count({ where });
      return count > 0; // true jika ada minimal 1 record
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle Error - Konversi Prisma error menjadi ApiError
   *
   * Method ini menangani error dari Prisma dan mengubahnya menjadi ApiError
   dengan status code yang sesuai.
   *
   * PRISMA ERROR CODES:
   * - P2002: Unique constraint violation (duplicate)
   * - P2014: ID tidak valid
   * - P2003: Foreign key constraint gagal
   * - P2025: Record tidak ditemukan
   *
   * @param error - Error dari Prisma
   * @returns ApiError (never return karena selalu throw)
   */
  protected handleError(error: any): never {
    // never = function ini tidak pernah return normal (selalu throw)

    // Jika error sudah ApiError, throw langsung
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle Prisma Known Request Error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        // ↑
        // error.code = kode error dari Prisma

        case "P2002":
          // Unique constraint violation
          // Contoh: Email duplicate
          throw new ApiError(
            httpStatus.CONFLICT, // 409 Conflict
            `Duplicate field value: ${(error.meta?.target as string[])?.join(", ")}`,
            //                                               ↑
            //                   meta.target = field yang duplicate
          );

        case "P2014":
          // ID tidak valid
          throw new ApiError(
            httpStatus.BAD_REQUEST, // 400 Bad Request
            `Invalid ID: ${error.meta?.target}`,
          );

        case "P2003":
          // Foreign key constraint gagal
          // Contoh: Insert post dengan userId yang tidak ada
          throw new ApiError(
            httpStatus.BAD_REQUEST, // 400 Bad Request
            "Foreign key constraint failed",
          );

        case "P2025":
          // Record tidak ditemukan
          throw new ApiError(httpStatus.NOT_FOUND, "Record not found");

        default:
          // Error Prisma lainnya
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR, // 500
            `Database error: ${error.message}`,
          );
      }
    }

    // Handle Prisma Validation Error
    if (error instanceof Prisma.PrismaClientValidationError) {
      // Terjadi jika data yang dikirim tidak valid sesuai schema
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid data provided to database",
      );
    }

    // Error lainnya
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An unexpected error occurred",
    );
  }
}
