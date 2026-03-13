# Dokumentasi Teknis - Express.js Boilerplate

Dokumentasi teknis untuk developer dalam menggunakan dan mengembangkan boilerplate Express.js dengan TypeScript, Prisma ORM, dan Layered Architecture.

---

## Daftar Isi

1. [Ikhtisar Proyek](#1-ikhtisar-proyek)
2. [Arsitektur](#2-arsitektur)
3. [Struktur Direktori](#3-struktur-direktori)
4. [Standar Kode](#4-standar-kode)
5. [Pola Layered Architecture](#5-pola-layered-architecture)
6. [Menambahkan Fitur Baru](#6-menambahkan-fitur-baru)
7. [Standar API](#7-standar-api)
8. [Penanganan Error](#8-penanganan-error)
9. [Validasi](#9-validasi)
10. [Autentikasi & Autorisasi](#10-autentikasi--autorisasi)
11. [Panduan Database](#11-panduan-database)
12. [Pengujian](#12-pengujian)
13. [Deployment](#13-deployment)

---

## 1. Ikhtisar Proyek

### Tech Stack

| Teknologi  | Versi | Kegunaan        |
| ---------- | ----- | --------------- |
| Node.js    | ^22   | Runtime         |
| TypeScript | ^5.9  | Type Safety     |
| Express    | ^5.2  | Web Framework   |
| Prisma     | ^6.0  | ORM             |
| PostgreSQL | -     | Database        |
| Zod        | ^4.3  | Validasi        |
| Winston    | ^3.19 | Logging         |
| pnpm       | 10.30 | Package Manager |

### Fitur Utama

- ✅ Layered Architecture (Controller → Service → Repository)
- ✅ Type-safe dengan TypeScript strict mode
- ✅ Centralized error handling
- ✅ Request validation dengan Zod
- ✅ JWT-based authentication
- ✅ Role-based authorization
- ✅ Pagination support
- ✅ Logging system
- ✅ Docker support

---

## 2. Arsitektur

### Pola Layered Architecture

```
Request → Middleware → Controller → Service → Repository → Database
                    ↓
                 Response
```

### Diagram Alur

```
┌─────────────────────────────────────────────────────────────┐
│                         Request                              │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Middlewares                             │
│  - Security (helmet, cors)                                   │
│  - Rate Limiting                                             │
│  - Authentication (Bearer token)                             │
│  - Authorization (Role check)                                │
│  - Validation (Zod schema)                                   │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Controller                              │
│  - Handle HTTP request/response                              │
│  - Call service layer                                        │
│  - Return standardized API response                          │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Service                                │
│  - Business logic                                            │
│  - Orchestrate data dari repositories                        │
│  - Handle domain-specific operations                         │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Repository                               │
│  - Data access layer                                         │
│  - Execute Prisma queries                                    │
│  - Handle database errors                                    │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Database                                 │
│  - PostgreSQL via Prisma ORM                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Struktur Direktori

```
src/
├── config/                    # File konfigurasi
│   ├── database.ts           # Singleton Prisma client
│   └── environment.ts        # Validasi environment variables
│
├── controllers/              # Request handler
│   ├── controller.interface.ts
│   ├── auth.controller.ts
│   └── user.controller.ts
│
├── middlewares/              # Express middlewares
│   ├── auth.middleware.ts    # Authentication & authorization
│   ├── error.middleware.ts   # Error handler
│   ├── rate-limiter.middleware.ts
│   └── validate.middleware.ts # Validasi Zod
│
├── repositories/             # Data access layer
│   ├── repository.interface.ts
│   ├── base.repository.ts    # Operasi CRUD dasar
│   └── user.repository.ts
│
├── routes/                   # API routes
│   └── v1/
│       ├── index.ts
│       ├── auth.route.ts
│       └── user.route.ts
│
├── services/                 # Business logic
│   ├── service.interface.ts
│   ├── base.service.ts
│   ├── auth.service.ts
│   └── user.service.ts
│
├── utils/                    # Fungsi utility
│   ├── api-error.ts          # Custom error class
│   ├── api-response.ts       # Response terstandarisasi
│   ├── catch-async.ts        # Wrapper async
│   ├── http-status.ts        # Kode status HTTP
│   ├── logger.ts             # Winston logger
│   └── pick.ts               # Object property picker
│
├── validations/              # Schema Zod
│   └── auth.validation.ts
│
├── interfaces/               # Interface TypeScript
│   └── user.interface.ts
│
├── types/                    # Definisi tipe global
│   └── global.d.ts           # Ekstensi Express Request
│
├── generated/                # Prisma generated (JANGAN DIEDIT)
│   └── prisma/
│
├── app.ts                    # Konfigurasi Express app
└── index.ts                  # Entry point aplikasi

prisma/
├── schema.prisma             # Schema database
└── migrations/               # Migrasi database
```

---

## 4. Standar Kode

### Penamaan File

| Tipe            | Konvensi         | Contoh                 |
| --------------- | ---------------- | ---------------------- |
| File TypeScript | `kebab-case.ts`  | `auth.service.ts`      |
| File interface  | `*.interface.ts` | `user.interface.ts`    |
| File tipe       | `*.types.ts`     | `api.types.ts`         |
| File test       | `*.spec.ts`      | `auth.service.spec.ts` |

### Urutan Import

```typescript
// 1. Node.js built-in
import { Request, Response } from "express";

// 2. Paket eksternal
import jwt from "jsonwebtoken";

// 3. Modul internal (dengan path alias)
import { prisma } from "@config/database";
import { ApiError } from "@/utils/api-error";
import { IUser } from "@/interfaces/user.interface";

// 4. Import relatif
import { logger } from "./utils/logger";
```

### Pedoman TypeScript

1. **Selalu gunakan tipe strict** - `noImplicitAny: true`
2. **Gunakan path alias** daripada relative path
3. **Definisikan return types** untuk semua fungsi
4. **Gunakan interfaces** untuk bentuk objek
5. **Gunakan type aliases** untuk union/intersection

```typescript
// ✅ Baik
async getUserById(id: string): Promise<IUser | null> {
  return await this.userRepository.findById(id);
}

// ❌ Buruk
async getUserById(id: string) {
  return await this.userRepository.findById(id);
}
```

### Gaya Kode

- Gunakan **2 spasi** untuk indentasi
- Gunakan **single quotes** untuk string
- Gunakan **semicolon** di akhir statement
- Gunakan **camelCase** untuk variabel/fungsi
- Gunakan **PascalCase** untuk class/interface
- Gunakan **UPPER_SNAKE_CASE** untuk konstanta

---

## 5. Pola Layered Architecture

### Layer Controller

**Tujuan**: Menangani HTTP request dan response

**Aturan**:

- Harus menggunakan wrapper `catchAsync`
- Harus mengembalikan `ApiResponse` terstandarisasi
- TIDAK boleh mengandung business logic
- Harus memanggil service layer untuk data

```typescript
import { catchAsync } from "@/utils/catch-async";
import { ApiResponse } from "@/utils/api-response";
import { httpStatus } from "@/utils/http-status";
import { Request, Response } from "express";

export class UserController {
  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAll();

    res
      .status(httpStatus.OK)
      .json(ApiResponse.success("Users retrieved", users));
  });
}

export const userController = new UserController();
```

### Layer Service

**Tujuan**: Business logic dan orchestrasi

**Aturan**:

- Implementasi interface `IService`
- TIDAK boleh tahu tentang HTTP (Request/Response)
- Dapat memanggil multiple repositories
- Handle operasi domain-specific

```typescript
import { IService } from "./service.interface";
import { userRepository } from "@/repositories/user.repository";

class UserService implements IService<
  User,
  ICreateUserInput,
  IUpdateUserInput
> {
  async create(data: ICreateUserInput): Promise<User> {
    // Cek apakah user sudah ada
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(httpStatus.CONFLICT, "Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Buat user
    return await userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }
}

export const userService = new UserService();
```

### Layer Repository

**Tujuan**: Data access dan operasi database

**Aturan**:

- Extend `BaseRepository<T, CreateInput, UpdateInput>`
- Gunakan Prisma client via singleton
- Konversi error Prisma ke `ApiError`
- Dapat memiliki method query custom

```typescript
import { BaseRepository } from "./base.repository";
import { User, Prisma } from "@/generated/prisma/client";

class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super("user", "User");
  }

  // Method custom
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findWithPosts(id: string): Promise<User | null> {
    return this.findById(id, {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    });
  }
}

export const userRepository = new UserRepository();
```

---

## 6. Menambahkan Fitur Baru

### Panduan Langkah-demi-Langkah: Menambahkan Fitur "Product"

Bagian ini menjelaskan alur lengkap dalam menambahkan fitur baru ke dalam aplikasi, mulai dari definisi database hingga routing. Setiap langkah memiliki tujuan spesifik dalam arsitektur layered yang diterapkan.

---

#### Langkah 1: Definisikan Schema Database

**Tujuan**: Mendefinisikan struktur tabel database, relasi antar tabel, dan tipe data yang akan digunakan.

**Fungsi**:

- Menentukan **struktur tabel** yang akan dibuat di database
- Mendefinisikan **relasi** antar tabel (one-to-one, one-to-many, many-to-many)
- Menentukan **tipe data** untuk setiap kolom (String, Int, Decimal, DateTime, dll)
- Mengatur **constraint** seperti unique, default value, dan required fields
- Mengatur **naming convention** untuk tabel menggunakan `@map`

**Kenapa Dilakukan Pertama?**
Schema database adalah fondasi dari seluruh fitur. Tanpa schema yang jelas, kita tidak dapat membuat interface, repository, atau layer lainnya. Prisma akan menggunakan schema ini untuk generate type-safe client yang akan digunakan di seluruh aplikasi.

**File**: `prisma/schema.prisma`

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

model Category {
  id        String    @id @default(uuid())
  name      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())

  @@map("categories")
}
```

**Penjelasan Schema**:
| Field | Tipe | Keterangan |
|-------|------|------------|
| `@id` | - | Primary key, identifier unik untuk setiap record |
| `@default(uuid())` | - | Generate UUID otomatis untuk ID |
| `String?` | Nullable | Field boleh kosong (null) |
| `@db.Decimal(10,2)` | Decimal | Presisi 10 digit, 2 di belakang koma |
| `@relation` | - | Relasi foreign key ke tabel lain |
| `@map` | - | Mapping nama tabel ke snake_case di database |
| `@updatedAt` | - | Otomatis update timestamp saat record diubah |

**Jalankan migrasi**:

```bash
pnpm prisma migrate dev --name add_products
```

Perintah ini akan:

1. Membuat file migrasi baru di `prisma/migrations/`
2. Menjalankan migrasi ke database
3. Generate ulang Prisma Client dengan type-defintions terbaru

---

#### Langkah 2: Definisikan Interface

**Tujuan**: Membuat kontrak tipe data (type contract) yang akan digunakan di seluruh aplikasi untuk konsistensi dan type-safety.

**Fungsi**:

- Mendefinisikan **shape dari data** yang akan digunakan
- Memisahkan **domain model** dari implementasi database
- Menyediakan **type definitions** untuk create, update, dan read operations
- Memudahkan **refactoring** dengan perubahan terpusat
- Meningkatkan **developer experience** dengan auto-complete di IDE

**Kenapa Penting?**
Interface berfungsi sebagai "sumber kebenaran" untuk bentuk data di seluruh aplikasi. Dengan interface, kita memisahkan definisi data dari implementasi database (Prisma), sehingga jika ingin mengganti ORM di masa depan, kita tidak perlu mengubah seluruh kode aplikasi.

**File**: `src/interfaces/product.interface.ts`

```typescript
export interface IProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface IUpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  isActive?: boolean;
}
```

**Penjelasan Interface**:

| Interface             | Fungsi                                             |
| --------------------- | -------------------------------------------------- |
| `IProduct`            | Bentuk lengkap data product (hasil dari database)  |
| `ICreateProductInput` | Field yang diperlukan saat membuat product baru    |
| `IUpdateProductInput` | Field opsional yang bisa diupdate (semua optional) |

---

#### Langkah 3: Buat Repository

**Tujuan**: Mengimplementasikan data access layer yang menangani semua operasi database.

**Fungsi**:

- **Abstraksi query database** dari business logic
- Menyediakan operasi **CRUD dasar** (Create, Read, Update, Delete)
- Menangani **error Prisma** dan mengkonversinya ke `ApiError`
- Mendukung **pagination** untuk query list data
- Menyediakan **method custom** untuk query spesifik (search, filter, dll)
- **Reusable** - bisa dipanggil dari multiple service

**Kenapa Dipisah dari Service?**
Repository memisahkan logika akses data dari business logic. Ini memudahkan testing (mocking repository), mengganti ORM, dan mengoptimalkan query database tanpa mengubah business logic.

**File**: `src/repositories/product.repository.ts`

```typescript
import { BaseRepository } from "./base.repository";
import {
  IProduct,
  ICreateProductInput,
  IUpdateProductInput,
} from "@interfaces/product.interface";
import { Product, Prisma } from "@/generated/prisma/client";

class ProductRepository extends BaseRepository<
  Product,
  Prisma.ProductCreateInput,
  Prisma.ProductUpdateInput
> {
  constructor() {
    super("product", "Product");
  }

  // Method custom: query product berdasarkan kategori
  async findByCategory(categoryId: string, options?: any): Promise<any> {
    return this.findAll({ categoryId }, options);
  }

  // Method custom: search product by keyword
  async searchProducts(keyword: string, options?: any): Promise<any> {
    return this.findAll(
      {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      },
      options,
    );
  }

  // Method custom: update stok saja
  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.update(id, { stock: quantity } as IUpdateProductInput);
  }
}

export const productRepository = new ProductRepository();
```

**Penjelasan Method**:

| Method                        | Fungsi                                                  |
| ----------------------------- | ------------------------------------------------------- |
| `super("product", "Product")` | Inisialisasi BaseRepository dengan nama model           |
| `findAll()`                   | Query list data dengan pagination (dari BaseRepository) |
| `findById()`                  | Query satu data by ID (dari BaseRepository)             |
| `create()`                    | Insert data baru (dari BaseRepository)                  |
| `update()`                    | Update data existing (dari BaseRepository)              |
| `delete()`                    | Delete data (dari BaseRepository)                       |
| `findByCategory()`            | Custom method untuk filter by category                  |
| `searchProducts()`            | Custom method untuk search dengan keyword               |
| `updateStock()`               | Custom method untuk update field spesifik               |

**Method dari BaseRepository**:

- `findAll(filter?, options?)` - Query banyak data dengan pagination
- `findById(id, include?)` - Query satu data by primary key
- `findOne(where, include?)` - Query satu data dengan custom where clause
- `create(data)` - Insert data baru
- `update(id, data)` - Update data existing
- `delete(id)` - Delete data
- `exists(where)` - Cek apakah data ada
- `count(filter?)` - Hitung jumlah data

---

#### Langkah 4: Buat Service

**Tujuan**: Mengimplementasikan business logic dan mengorchestrasi data dari repository.

**Fungsi**:

- Mengandung **business logic** dan aturan domain
- Mengorchestrasi multiple repository jika diperlukan
- Melakukan **validasi business** yang tidak bisa ditangani di validator
- Mengkonversi error menjadi **response yang user-friendly**
- Menyiapkan data dalam bentuk yang dibutuhkan controller
- **Tidak bergantung** pada HTTP (Request/Response)

**Kenapa Dipisah dari Controller?**
Service berisi logic yang kompleks dan bisa dipanggil dari berbagai sumber (HTTP handler, cron job, CLI, test). Dengan memisahkannya, kita bisa:

- Reuse business logic di berbagai tempat
- Test business logic tanpa perlu mock HTTP request/response
- Mengubah endpoint API tanpa mengubah business logic

**File**: `src/services/product.service.ts`

```typescript
import { IService } from "./service.interface";
import { productRepository } from "@/repositories/product.repository";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import {
  IProduct,
  ICreateProductInput,
  IUpdateProductInput,
} from "@/interfaces/product.interface";

class ProductService implements IService<
  IProduct,
  ICreateProductInput,
  IUpdateProductInput
> {
  async create(data: ICreateProductInput): Promise<IProduct> {
    // Validasi business: stok tidak boleh negatif
    if (data.stock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Stock cannot be negative");
    }

    // Validasi business: harga harus lebih dari 0
    if (data.price <= 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Price must be greater than 0",
      );
    }

    return await productRepository.create(data);
  }

  async getById(id: string, include?: any): Promise<IProduct> {
    const product = await productRepository.findById(id, include);

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    return product;
  }

  async getAll(filter?: any, options?: any): Promise<any> {
    return await productRepository.findAll(filter, options);
  }

  async update(id: string, data: IUpdateProductInput): Promise<IProduct> {
    // Cek apakah product ada
    const product = await this.getById(id);

    // Cek jika mencoba update stok di bawah nol
    if (data.stock !== undefined && data.stock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Stock cannot be negative");
    }

    return await productRepository.update(id, data);
  }

  async delete(id: string): Promise<IProduct> {
    const product = await this.getById(id);

    // Soft delete: hanya menandai sebagai inactive
    return await productRepository.update(id, {
      isActive: false,
    } as IUpdateProductInput);
  }

  async exists(where: any): Promise<boolean> {
    return await productRepository.exists(where);
  }
}

export const productService = new ProductService();
```

**Penjelasan Method**:

| Method      | Fungsi                                                             |
| ----------- | ------------------------------------------------------------------ |
| `create()`  | Membuat product baru dengan validasi business                      |
| `getById()` | Mengambil product by ID dengan error handling jika tidak ditemukan |
| `getAll()`  | Mengambil list product dengan filter dan pagination                |
| `update()`  | Update product dengan validasi business                            |
| `delete()`  | Soft delete product (menandai sebagai inactive)                    |
| `exists()`  | Cek apakah product ada (berguna untuk validasi)                    |

**Contoh Business Logic di Service**:

- Validasi stok minimum
- Validasi harga minimum
- Soft delete alih-alih hard delete
- Format data sebelum dikembalikan
- Menggabungkan data dari multiple repository

---

#### Langkah 5: Buat Schema Validasi

**File**: `src/services/product.service.ts`

```typescript
import { IService } from "./service.interface";
import { productRepository } from "@/repositories/product.repository";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import {
  IProduct,
  ICreateProductInput,
  IUpdateProductInput,
} from "@/interfaces/product.interface";

class ProductService implements IService<
  IProduct,
  ICreateProductInput,
  IUpdateProductInput
> {
  async create(data: ICreateProductInput): Promise<IProduct> {
    // Validasi stok
    if (data.stock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Stock cannot be negative");
    }

    // Validasi harga
    if (data.price <= 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Price must be greater than 0",
      );
    }

    return await productRepository.create(data);
  }

  async getById(id: string, include?: any): Promise<IProduct> {
    const product = await productRepository.findById(id, include);

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    return product;
  }

  async getAll(filter?: any, options?: any): Promise<any> {
    return await productRepository.findAll(filter, options);
  }

  async update(id: string, data: IUpdateProductInput): Promise<IProduct> {
    const product = await this.getById(id);

    // Cek jika mencoba update stok di bawah nol
    if (data.stock !== undefined && data.stock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Stock cannot be negative");
    }

    return await productRepository.update(id, data);
  }

  async delete(id: string): Promise<IProduct> {
    const product = await this.getById(id);

    // Soft delete
    return await productRepository.update(id, {
      isActive: false,
    } as IUpdateProductInput);
  }

  async exists(where: any): Promise<boolean> {
    return await productRepository.exists(where);
  }
}

export const productService = new ProductService();
```

#### Langkah 5: Buat Schema Validasi

**Tujuan**: Mendefinisikan aturan validasi untuk input request dari client menggunakan Zod schema.

**Fungsi**:

- **Validasi input** sebelum diproses oleh controller
- Menjamin **type-safety** dengan runtime type checking
- Memberikan **pesan error yang jelas** untuk setiap field yang tidak valid
- Mencegah **invalid data** masuk ke sistem
- Mengurangi **boilerplate code** di controller untuk validasi manual

**Kenapa Menggunakan Zod?**
Zod adalah library validasi TypeScript-first yang:

- Type-safe dan inferred types dari schema
- Pesan error yang customizable
- Support complex validation (regex, custom logic, transform)
- Integrasi mudah dengan middleware

**Jenis Validasi**:

1. **Body Validation** - Validasi request body (POST, PATCH)
2. **Params Validation** - Validasi URL params (`:id`)
3. **Query Validation** - Validasi query params (`?page=1&limit=10`)

**File**: `src/validations/product.validation.ts`

```typescript
import { z } from "zod";

// Schema untuk validasi request body saat create product
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(255, "Name too long"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().nonnegative("Stock cannot be negative"),
    categoryId: z.string().uuid("Invalid category ID"),
  }),
});

// Schema untuk validasi request body saat update product
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Schema untuk validasi URL params (:id)
export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
});

// Schema untuk validasi query params
export const queryProductSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});
```

**Penjelasan Validasi**:

| Zod Method       | Fungsi                           |
| ---------------- | -------------------------------- |
| `z.string()`     | Validasi tipe string             |
| `z.number()`     | Validasi tipe number             |
| `z.boolean()`    | Validasi tipe boolean            |
| `.min(n, msg)`   | Minimal panjang/nilai            |
| `.max(n, msg)`   | Maksimal panjang/nilai           |
| `.positive()`    | Harus bilangan positif           |
| `.nonnegative()` | Harus >= 0                       |
| `.int()`         | Harus bilangan bulat             |
| `.uuid()`        | Validasi format UUID             |
| `.optional()`    | Field boleh tidak ada            |
| `.transform(fn)` | Transform nilai setelah validasi |

**Contoh Error Response dari Validasi**:

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "price",
      "message": "Price must be positive"
    }
  ]
}
```

---

#### Langkah 6: Buat Controller

**Tujuan**: Menghandle HTTP request dan response sebagai entry point dari API.

**Fungsi**:

- **Handle HTTP request** dari client
- Mengambil data dari request (body, params, query)
- Memanggil **service layer** untuk business logic
- Mengembalikan **HTTP response** dengan format standar
- Menggunakan `catchAsync` untuk **error handling**
- **Tidak mengandung** business logic

**Kenapa Dipisah dari Service?**
Controller fokus pada HTTP concerns (status code, response format, request parsing) sementara service fokus pada business logic. Ini memudahkan:

- Testing controller tanpa business logic
- Mengganti format response tanpa mengubah logic
- Reuse business logic dari non-HTTP sources

**File**: `src/controllers/product.controller.ts`

```typescript
import { catchAsync } from "@/utils/catch-async";
import { ApiResponse } from "@/utils/api-response";
import { httpStatus } from "@/utils/http-status";
import { Request, Response } from "express";
import { productService } from "@/services/product.service";

export class ProductController {
  // Create: POST /products
  createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    res
      .status(httpStatus.CREATED)
      .json(ApiResponse.success("Product created", product));
  });

  // List: GET /products
  getProducts = catchAsync(async (req: Request, res: Response) => {
    const { search, categoryId, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (search) {
      filter.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const result = await productService.getAll(filter, {
      page: page as number,
      limit: limit as number,
    });

    res
      .status(httpStatus.OK)
      .json(ApiResponse.paginate(result.data, result.pagination));
  });

  // Detail: GET /products/:id
  getProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.getById(id, {
      category: true,
    });

    res
      .status(httpStatus.OK)
      .json(ApiResponse.success("Product retrieved", product));
  });

  // Update: PATCH /products/:id
  updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.update(id, req.body);

    res
      .status(httpStatus.OK)
      .json(ApiResponse.success("Product updated", product));
  });

  // Delete: DELETE /products/:id
  deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await productService.delete(id);

    res.status(httpStatus.OK).json(ApiResponse.success("Product deleted"));
  });
}

export const productController = new ProductController();
```

**Penjelasan Method**:

| Method          | HTTP   | Endpoint        | Status Code |
| --------------- | ------ | --------------- | ----------- |
| `createProduct` | POST   | `/products`     | 201 CREATED |
| `getProducts`   | GET    | `/products`     | 200 OK      |
| `getProduct`    | GET    | `/products/:id` | 200 OK      |
| `updateProduct` | PATCH  | `/products/:id` | 200 OK      |
| `deleteProduct` | DELETE | `/products/:id` | 200 OK      |

**Pattern yang Digunakan**:

1. **catchAsync wrapper** - Menangkap error dan meneruskannya ke error middleware
2. **ApiResponse.success()** - Format response standar untuk sukses
3. **ApiResponse.paginate()** - Format response dengan data paginasi
4. **httpStatus constants** - Status code yang konsisten

---

#### Langkah 7: Buat Routes

**File**: `src/controllers/product.controller.ts`

```typescript
import { catchAsync } from "@/utils/catch-async";
import { ApiResponse } from "@/utils/api-response";
import { httpStatus } from "@/utils/http-status";
import { Request, Response } from "express";
import { productService } from "@/services/product.service";

export class ProductController {
  createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    res
      .status(httpStatus.CREATED)
      .json(ApiResponse.success("Product created", product));
  });

  getProducts = catchAsync(async (req: Request, res: Response) => {
    const { search, categoryId, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (search) {
      filter.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const result = await productService.getAll(filter, {
      page: page as number,
      limit: limit as number,
    });

    res
      .status(httpStatus.OK)
      .json(ApiResponse.paginate(result.data, result.pagination));
  });

  getProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.getById(id, {
      category: true,
    });

    res
      .status(httpStatus.OK)
      .json(ApiResponse.success("Product retrieved", product));
  });

  updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.update(id, req.body);

    res
      .status(httpStatus.OK)
      .json(ApiResponse.success("Product updated", product));
  });

  deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await productService.delete(id);

    res.status(httpStatus.OK).json(ApiResponse.success("Product deleted"));
  });
}

export const productController = new ProductController();
```

#### Langkah 7: Buat Routes

**Tujuan**: Mendefinisikan URL endpoint dan menghubungkannya dengan controller serta middleware yang sesuai.

**Fungsi**:

- Mendefinisikan **URL endpoint** untuk setiap operasi
- Menghubungkan endpoint ke **controller method**
- Menambahkan **middleware** untuk validasi, autentikasi, autorisasi
- Mengatur **route grouping** berdasarkan akses (public, protected, admin)
- Menentukan **HTTP method** yang sesuai (GET, POST, PATCH, DELETE)

**Kenapa Dipisah ke File Terpisah?**
Routes file memisahkan definisi endpoint dari implementasi controller. Ini memudahkan:

- Melihat semua endpoint dalam satu file
- Mengubah URL pattern tanpa mengubah controller
- Mengatur middleware per route dengan jelas

**Middleware yang Digunakan**:
| Middleware | Fungsi |
|------------|--------|
| `validate(schema)` | Validasi request body/params/query |
| `authenticate` | Cek apakah user sudah login (valid token) |
| `authorize(role)` | Cek apakah user punya role yang cukup |

**File**: `src/routes/v1/product.route.ts`

```typescript
import { Router } from "express";
import { productController } from "@controllers/product.controller";
import { authenticate, authorize } from "@middlewares/auth.middleware";
import { validate } from "@middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  queryProductSchema,
} from "@validations/product.validation";

const router: Router = Router();

// ==================== PUBLIC ROUTES ====================
// Semua user bisa akses tanpa login

// GET /api/v1/products - List semua product dengan pagination
router.get("/", validate(queryProductSchema), productController.getProducts);

// GET /api/v1/products/:id - Detail product by ID
router.get("/:id", validate(getProductSchema), productController.getProduct);

// ==================== PROTECTED ROUTES ====================
// Semua route di bawah ini butuh login
router.use(authenticate);

// ==================== ADMIN ONLY ROUTES ====================
// Hanya user dengan role ADMIN yang bisa akses

// POST /api/v1/products - Create product baru
router.post(
  "/",
  authorize("ADMIN"),
  validate(createProductSchema),
  productController.createProduct,
);

// PATCH /api/v1/products/:id - Update product
router.patch(
  "/:id",
  authorize("ADMIN"),
  validate(updateProductSchema),
  productController.updateProduct,
);

// DELETE /api/v1/products/:id - Delete product
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate(getProductSchema),
  productController.deleteProduct,
);

export default router;
```

**Penjelasan Routes**:

| Route  | Method | Auth | Authorization | Validation    | Controller      |
| ------ | ------ | ---- | ------------- | ------------- | --------------- |
| `/`    | GET    | ❌   | Public        | Query         | `getProducts`   |
| `/:id` | GET    | ❌   | Public        | Params        | `getProduct`    |
| `/`    | POST   | ✅   | ADMIN         | Body          | `createProduct` |
| `/:id` | PATCH  | ✅   | ADMIN         | Body + Params | `updateProduct` |
| `/:id` | DELETE | ✅   | ADMIN         | Params        | `deleteProduct` |

**Best Practice Routes**:

1. **Public routes di atas**, protected routes di bawah
2. Gunakan `router.use(authenticate)` untuk group routes
3. Letakkan `validate()` sebelum controller
4. Gunakan HTTP method yang sesuai:
   - `GET` untuk mengambil data
   - `POST` untuk membuat data baru
   - `PATCH` untuk update sebagian data
   - `DELETE` untuk menghapus data
5. Routes spesifik di atas routes general (contoh: `/:id` di bawah `/search`)

---

#### Langkah 8: Registrasikan Routes

**Tujuan**: Mendaftarkan route yang baru dibuat ke aplikasi Express agar dapat diakses oleh client.

**Fungsi**:

- **Menghubungkan** route module ke main router
- Menentukan **base path** untuk resource (`/products`)
- Mengorganisir **semua routes** dalam satu file terpusat
- Memudahkan **versioning** API (`/api/v1/`)

**Kenapa Perlu Registrasi?**
Router yang sudah dibuat tidak akan otomatis terdaftar ke aplikasi. Kita harus meng-import dan meng-register-nya ke main router agar endpoint dapat diakses.

**File**: `src/routes/v1/index.ts`

```typescript
import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import productRoutes from "./product.route"; // Tambahkan ini

const router: Router = Router();

// Register semua routes dengan base path masing-masing
router.use("/auth", authRoutes); // /api/v1/auth/*
router.use("/users", userRoutes); // /api/v1/users/*
router.use("/products", productRoutes); // /api/v1/products/*

export default router;
```

**Penjelasan Registrasi**:

| Line                           | Base Path          | Routes yang Teregister                           |
| ------------------------------ | ------------------ | ------------------------------------------------ |
| `router.use("/auth", ...)`     | `/api/v1/auth`     | `/auth/login`, `/auth/register`, `/auth/refresh` |
| `router.use("/users", ...)`    | `/api/v1/users`    | `/users`, `/users/:id`                           |
| `router.use("/products", ...)` | `/api/v1/products` | `/products`, `/products/:id`                     |

**Struktur URL Lengkap**:
Setelah registrasi, endpoint dapat diakses dengan format:

```
http://localhost:{PORT}/api/v1/{route-path}
```

Contoh:

- `GET http://localhost:3000/api/v1/products`
- `GET http://localhost:3000/api/v1/products/123`
- `POST http://localhost:3000/api/v1/products`

---

### Ringkasan Alur Pengembangan Fitur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ALUR PENGEMBANGAN FITUR BARU                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ Langkah 1:      │  Definisikan Schema Database
│ Schema Database │  - Struktur tabel, relasi, tipe data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 2:      │  Definisikan Interface
│ Interface       │  - Type contract untuk data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 3:      │  Buat Repository
│ Repository      │  - Data access layer, CRUD operations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 4:      │  Buat Service
│ Service         │  - Business logic, orchestration
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 5:      │  Buat Schema Validasi
│ Validasi        │  - Zod schema untuk input validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 6:      │  Buat Controller
│ Controller      │  - HTTP request handler
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 7:      │  Buat Routes
│ Routes          │  - URL endpoints & middleware
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Langkah 8:      │  Registrasikan Routes
│ Registrasi      │  - Daftarkan ke main router
└─────────────────┘

         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FITUR SIAP DIGUNAKAN                         │
│                                                                 │
│  Client → Request → Middleware → Controller → Service → Repo    │
│           ← Response ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←       │
└─────────────────────────────────────────────────────────────────┘
```

---

### Checklist Sebelum Menambahkan Fitur Baru

Sebelum memulai pengembangan fitur baru, pastikan:

- [ ] **Pahami requirement** dengan jelas
- [ ] **Identifikasi entities** yang diperlukan (tabel database)
- [ ] **Tentukan relasi** antar entities (one-to-one, one-to-many, dll)
- [ ] **Buat daftar endpoint** yang diperlukan (CRUD + custom)
- [ ] **Tentukan akses level** (public, authenticated, role-based)
- [ ] **Identifikasi validasi** yang diperlukan untuk setiap field
- [ ] **Buat skema response** untuk setiap endpoint

### Checklist Setelah Menambahkan Fitur Baru

Setelah menyelesaikan pengembangan fitur:

- [ ] **Generate Prisma Client** (`pnpm prisma generate`)
- [ ] **Run migrasi** (`pnpm prisma migrate dev`)
- [ ] **Test semua endpoint** dengan Postman/Thunder Client
- [ ] **Test error cases** (invalid input, not found, unauthorized)
- [ ] **Test pagination** untuk list endpoints
- [ ] **Test validation** dengan berbagai input combinations
- [ ] **Cek logging** untuk memastikan error ter-log dengan benar
- [ ] **Update dokumentasi** API jika diperlukan

**File**: `src/routes/v1/index.ts`

```typescript
import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import productRoutes from "./product.route"; // Tambahkan ini

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes); // Tambahkan ini

export default router;
```

---

## 7. Standar API

### Format Response

#### Response Sukses

```typescript
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-03-09T12:00:00.000Z"
}
```

#### Response dengan Paginasi

```typescript
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-03-09T12:00:00.000Z"
}
```

#### Response Error

```typescript
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "errors": [ ... ],
  "timestamp": "2026-03-09T12:00:00.000Z"
}
```

### Kode Status HTTP

| Kode | Konstanta             | Penggunaan                        |
| ---- | --------------------- | --------------------------------- |
| 200  | OK                    | GET, PATCH, DELETE berhasil       |
| 201  | CREATED               | POST berhasil                     |
| 400  | BAD_REQUEST           | Error validasi, input tidak valid |
| 401  | UNAUTHORIZED          | Token hilang/tidak valid          |
| 403  | FORBIDDEN             | Izin tidak mencukupi              |
| 404  | NOT_FOUND             | Resource tidak ditemukan          |
| 409  | CONFLICT              | Resource duplikat                 |
| 500  | INTERNAL_SERVER_ERROR | Error tak terduga                 |

### Konvensi Penamaan

| Tipe            | Pola                       | Contoh                |
| --------------- | -------------------------- | --------------------- |
| Routes          | `/api/v1/{resource}`       | `/api/v1/products`    |
| Single resource | `/{resource}/:id`          | `/products/123`       |
| Action routes   | `/{resource}/:id/{action}` | `/users/:id/activate` |
| Query params    | `camelCase`                | `?page=1&limit=10`    |

---

## 8. Penanganan Error

### Melempar Error

```typescript
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";

// Error dasar
throw new ApiError(httpStatus.NOT_FOUND, "User not found");

// Error tanpa stack trace
throw new ApiError(httpStatus.BAD_REQUEST, "Invalid input", false);

// Error dengan stack custom
throw new ApiError(
  httpStatus.INTERNAL_SERVER_ERROR,
  "Database error",
  true,
  error.stack,
);
```

### Format Response Error

```typescript
// Production (tanpa stack trace)
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2026-03-09T12:00:00.000Z"
}

// Development (dengan stack trace)
{
  "success": false,
  "message": "Database error",
  "statusCode": 500,
  "stack": "Error: ...",
  "timestamp": "2026-03-09T12:00:00.000Z"
}
```

### Penanganan Error Prisma

`BaseRepository` secara otomatis mengkonversi error Prisma:

| Kode Prisma | Status HTTP | Pesan                        |
| ----------- | ----------- | ---------------------------- |
| P2002       | 409         | Nilai field duplikat         |
| P2014       | 400         | ID tidak valid               |
| P2003       | 400         | Foreign key constraint gagal |
| P2025       | 404         | Record tidak ditemukan       |

---

## 9. Validasi

### Membuat Schema Validasi

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    name: z.string().min(1, "Nama wajib diisi"),
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Format ID tidak valid"),
  }),
});

export const queryUserSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
    search: z.string().optional(),
  }),
});
```

### Menggunakan Middleware Validasi

```typescript
import { validate } from "@/middlewares/validate.middleware";
import { createUserSchema } from "@/validations/user.validation";

router.post("/", validate(createUserSchema), userController.create);
```

### Validator Custom

```typescript
// Schema validator custom
const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Z]/, "Password harus mengandung minimal satu huruf kapital")
  .regex(/[a-z]/, "Password harus mengandung minimal satu huruf kecil")
  .regex(/[0-9]/, "Password harus mengandung minimal satu angka");

// Refinement custom
const ageSchema = z
  .number()
  .refine((val) => val >= 18, { message: "Harus 18 tahun atau lebih" });
```

---

## 10. Autentikasi & Autorisasi

### Melindungi Routes

```typescript
import { authenticate, authorize } from "@/middlewares/auth.middleware";

// Membutuhkan autentikasi saja
router.get("/profile", authenticate, userController.getProfile);

// Membutuhkan role tertentu
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  userController.deleteUser,
);

// Membutuhkan multiple role
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "MODERATOR"),
  userController.create,
);
```

### Mengakses User Terautentikasi

```typescript
export class UserController {
  getProfile = catchAsync(async (req: Request, res: Response) => {
    // req.user diisi oleh authenticate middleware
    const userId = req.user!.id;

    const user = await userService.getById(userId);

    res
      .status(httpStatus.OK)
      .json(ApiResponse.success("Profile retrieved", user));
  });
}
```

### Struktur Token

```typescript
// Access Token Payload
{
  "sub": "user-id",
  "type": "access",
  "iat": 1234567890,
  "exp": 1234567890
}

// Refresh Token
- Random 32-byte hex string
- Disimpan di database (tabel sessions)
- Valid selama 7 hari
```

---

## 11. Panduan Database

### Alur Migrasi

```bash
# Buat migrasi
pnpm prisma migrate dev --name migration_name

# Reset database (hanya dev)
pnpm prisma migrate reset

# Generate client
pnpm prisma generate

# Buka Prisma Studio
pnpm prisma studio
```

### Praktik Terbaik Schema

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Selalu gunakan @map untuk nama tabel snake_case
  @@map("products")

  // Gunakan index untuk field yang sering diquery
  @@index([name])
  @@index([createdAt])
}

// Gunakan enum untuk nilai yang tetap
enum Status {
  PENDING
  APPROVED
  REJECTED
}
```

### Praktik Terbaik Query

```typescript
// ✅ Baik: Gunakan query type-safe
await prisma.product.findUnique({
  where: { id: productId },
  include: { category: true },
});

// ❌ Buruk: Gunakan raw SQL kecuali perlu
await prisma.$queryRaw`SELECT * FROM products`;

// ✅ Baik: Gunakan transaksi untuk multiple operasi
await prisma.$transaction([
  prisma.product.update({ where: { id }, data: { stock: { decrement: 1 } } }),
  prisma.order.create({ data: { productId: id, quantity: 1 } }),
]);

// ✅ Baik: Gunakan select untuk field tertentu
await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true },
});
```

---

## 12. Pengujian

### Struktur Test

```
tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.spec.ts
│   │   └── user.service.spec.ts
│   └── repositories/
│       └── user.repository.spec.ts
├── integration/
│   ├── controllers/
│   │   └── auth.controller.spec.ts
│   └── routes/
│       └── auth.route.spec.ts
└── e2e/
    └── auth.e2e.spec.ts
```

### Contoh Unit Test

```typescript
import { describe, it, expect, beforeEach } from "@jest/globals";
import { UserService } from "@/services/user.service";
import { userRepository } from "@/repositories/user.repository";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
      jest.spyOn(userRepository, "create").mockResolvedValue({
        id: "123",
        ...userData,
      } as any);

      const result = await userService.create(userData);

      expect(result).toHaveProperty("id");
      expect(result.email).toBe(userData.email);
    });

    it("should throw error if email exists", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      jest.spyOn(userRepository, "findByEmail").mockResolvedValue({
        id: "123",
        email: "test@example.com",
      } as any);

      await expect(userService.create(userData)).rejects.toThrow(
        "Email already exists",
      );
    });
  });
});
```

---

## 13. Deployment

### Checklist Pra-Deployment

- [ ] Update `NODE_ENV=production` di environment
- [ ] Ubah `JWT_SECRET` ke nilai random yang kuat
- [ ] Set `DATABASE_URL` yang aman
- [ ] Review origin CORS
- [ ] Set up SSL/HTTPS
- [ ] Konfigurasi rate limiting
- [ ] Set up logging (pertimbangkan layanan eksternal)
- [ ] Konfigurasi backup database
- [ ] Review security headers (helmet)
- [ ] Test semua endpoint
- [ ] Jalankan migrasi database

### Environment Variables

```bash
# Wajib
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=production-secret-anda

# Opsional
PORT=3000
API_PREFIX=/api/v1
CORS_ORIGIN=https://domainanda.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Deployment dengan Docker

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Referensi Cepat

### Perintah Umum

```bash
# Development
pnpm install              # Install dependencies
pnpm prisma generate      # Generate Prisma client
pnpm prisma migrate dev   # Jalankan migrasi
npx ts-node src/index.ts # Start server
npx nodemon              # Start dengan auto-reload

# Database
pnpm prisma studio        # Buka Prisma Studio
pnpm prisma migrate reset # Reset database
pnpm prisma db push       # Push perubahan schema

# Production
npx tsc                  # Build TypeScript
node dist/index.js       # Jalankan app yang sudah dibuild
```

### Path Aliases

```typescript
"@/*"                    -> src/*
"@config/*"              -> src/config/*
"@controllers/*"         -> src/controllers/*
"@services/*"            -> src/services/*
"@repositories/*"        -> src/repositories/*
"@middlewares/*"         -> src/middlewares/*
"@utils/*"               -> src/utils/*
"@validations/*"         -> src/validations/*
"@interfaces/*"          -> src/interfaces/*
"@types/*"               -> src/types/*
```

### Snippet Berguna

```typescript
// Template controller
export class XController {
  method = catchAsync(async (req: Request, res: Response) => {
    const result = await xService.method(req.body);
    res.status(httpStatus.OK).json(ApiResponse.success("Message", result));
  });
}

// Template service
async method(data: InputType): Promise<ReturnType> {
  // Business logic di sini
  return await xRepository.method(data);
}

// Template repository
async customMethod(params: Params): Promise<ReturnType> {
  return this.findOne({ /* query */ });
}
```

---

## Dukungan

Untuk pertanyaan atau masalah, silakan hubungi tim development atau referensi:

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
