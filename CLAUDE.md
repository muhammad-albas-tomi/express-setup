# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Work Confirmation Protocol

**SEBELUM melakukan perubahan apapun pada kodebase, Claude HARUS:**

1. **Explain the Plan**: Jelaskan langkah-langkah yang akan dilakukan dengan format:
   - **Analysis**: Apa yang diminta user dan apa yang perlu dilakukan
   - **Steps**: Daftar langkah teknis yang akan dijalankan (bullet points)
   - **Files**: File-file yang akan dimodifikasi/dibuat
   - **Impact**: Dampak dari perubahan tersebut

2. **Ask for Confirmation**: Tanyakan konfirmasi kepada user dengan opsi:
   - **Lanjut** (Proceed) - User menyetujui plan
   - **Revisi** (Revise) - User ingin mengubah pendekatan
   - **Batal** (Cancel) - User membatalkan pekerjaan

3. **Wait for Approval**: JANGAN melakukan perubahan sampai user memberikan persetujuan

4. **Exception Cases**: Tidak perlu konfirmasi untuk:
   - Membaca file atau mencari kode (Read, Glob, Grep)
   - Menjalankan test untuk melihat hasil
   - Operasi yang bersifat read-only
   - Perbaikan sederhana (typo, formatting) yang sudah jelas

### Format Output Konfirmasi

Gunakan format berikut saat meminta konfirmasi:

```markdown
## Plan: [Judul Singkat]

**Analysis**: [Penjelasan singkat apa yang akan dilakukan]

**Steps**:
1. [Langkah pertama]
2. [Langkah kedua]
3. [Langkah ketiga]

**Files to modify**:
- `path/to/file1.ts` - [alasan]
- `path/to/file2.tsx` - [alasan]

**Files to create**:
- `path/to/new-file.ts` - [alasan]

**Impact**: [Jelaskan dampak/perubahan]

---

Apakah Anda ingin melanjutkan, revisi, atau batalkan?
```

### Aturan Tambahan

- Setelah user menyetujui, sebutkan "Memulai eksekusi..." sebelum menjalankan perintah
- Jika user meminta revisi, tanyakan bagian mana yang ingin diubah
- Jika user meminta detail lebih lanjut, jelaskan dengan bahasa yang mudah dipahami

## Project Overview

This is a TypeScript Express.js boilerplate with Prisma ORM, following a layered architecture pattern. The project uses Prisma Accelerate for database connection pooling and PostgreSQL as the database.

### Key Technologies
- **Express 5.x** - Web framework
- **Prisma 7.x** - ORM with Accelerate enabled
- **TypeScript 5.x** - Type safety
- **Winston** - Logging
- **Joi/express-validator** - Validation
- **pnpm** - Package manager

### Package Manager
This project uses **pnpm** (v10.30.2). Always use `pnpm` for installing dependencies and running scripts.

## Development Commands

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run Prisma migrations
pnpm prisma migrate dev

# Run Prisma studio (database GUI)
pnpm prisma studio

# Build TypeScript
npx tsc

# Run in development (with ts-node)
npx ts-node src/index.ts

# Run with nodemon for auto-restart
npx nodemon
```

## Project Architecture

### Directory Structure
```
src/
├── config/          # Configuration files (database, environment)
├── controllers/     # Request handlers (implement IController)
├── repositories/    # Data access layer (extend BaseRepository)
├── services/        # Business logic (implement IService)
├── utils/           # Utility functions (api-error, api-response, catch-async, logger, http-status)
├── types/           # TypeScript type definitions
├── interfaces/      # Shared interfaces (user, etc.)
├── generated/       # Prisma generated client (DO NOT EDIT)
└── index.ts         # Application entry point
```

### Layered Architecture Pattern

The project follows a strict separation of concerns:

1. **Controllers** (`src/controllers/`)
   - Handle HTTP requests/responses
   - Use `catchAsync` wrapper for error handling
   - Implement `IController` interface with `AsyncRequestHandler` type
   - Return standardized API responses using `ApiResponse` class

2. **Services** (`src/services/`)
   - Contain business logic
   - Implement `IService` interface
   - Orchestrate data from repositories
   - Handle domain-specific operations

3. **Repositories** (`src/repositories/`)
   - Extend `BaseRepository<T, CreateInput, UpdateInput>`
   - Provide CRUD operations with pagination
   - Handle Prisma-specific errors and convert to `ApiError`
   - Use Prisma client via `prisma` singleton from `@config/database`

4. **Utils** (`src/utils/`)
   - `api-error.ts` - Custom error class with status codes
   - `api-response.ts` - Standardized API response formatting
   - `catch-async.ts` - Wrapper for async route handlers
   - `logger.ts` - Winston logger (logs to console and `logs/` directory)
   - `http-status.ts` - HTTP status code constants
   - `pick.ts` - Utility for picking object properties

## Database Configuration

### Prisma Accelerate
The project uses Prisma Accelerate (`prisma+postgres://` connection format). The Prisma client is configured with:

```typescript
new PrismaClient({
  accelerateUrl: environment.databaseUrl,
  log: [...]
});
```

### Prisma Client Location
- Generated client is in `src/generated/prisma/` (set in `prisma.schema`)
- Import from: `@/generated/prisma/client`
- Singleton instance: `import { prisma } from "@config/database"`

### Environment Variables
Required variables (validated at startup in `src/config/environment.ts`):
- `DATABASE_URL` - Prisma Accelerate connection string
- `JWT_SECRET` - JWT signing secret

## TypeScript Configuration

### Path Aliases (tsconfig.json)
```json
{
  "@/*": ["src/*"],
  "@config/*": ["src/config/*"],
  "@controllers/*": ["src/controllers/*"],
  "@services/*": ["src/services/*"],
  "@repositories/*": ["src/repositories/*"],
  "@middlewares/*": ["src/middlewares/*"],
  "@utils/*": ["src/utils/*"],
  "@validations/*": ["src/validations/*"],
  "@constants/*": ["src/constants/*"],
  "@interfaces/*": ["src/interfaces/*"],
  "@types/*": ["src/types/*"]
}
```

### Strict Type Checking
The project uses strict TypeScript settings. Always type function parameters and return types.

## Error Handling

### ApiError Class
Located in `src/utils/api-error.ts`:

```typescript
throw new ApiError(
  httpStatus.NOT_FOUND,
  "Resource not found"
);
```

### Error Handling in Repositories
`BaseRepository.handleError()` automatically converts Prisma errors to ApiError:
- `P2002` → `httpStatus.CONFLICT` (unique constraint)
- `P2014` → `httpStatus.BAD_REQUEST` (invalid ID)
- `P2003` → `httpStatus.BAD_REQUEST` (foreign key)
- `P2025` → `httpStatus.NOT_FOUND` (record not found)

### Global Type Extensions
`src/types/global.d.ts` extends Express Request with:
- `req.user` - Authenticated user info (id, email, role)
- `req.file` / `req.files` - Multer file uploads

## Common Patterns

### Creating a New Feature
1. Define interfaces in `src/interfaces/`
2. Create repository extending `BaseRepository`
3. Create service implementing `IService`
4. Create controller with `catchAsync` wrapper
5. Use `ApiResponse` class for consistent responses

### Controller Pattern
```typescript
import { catchAsync } from "@/utils/catch-async";
import { ApiResponse } from "@/utils/api-response";
import { httpStatus } from "@/utils/http-status";

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(httpStatus.CREATED).json(
    ApiResponse.success("User created", user)
  );
});
```

### Repository Pattern
```typescript
import { BaseRepository } from "@/repositories/base.repository";

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super("user", "User");
  }

  // Custom methods...
}
```

## Important Notes

- **Never edit files in `src/generated/prisma/`** - They are auto-generated
- **Always use path aliases** when importing (e.g., `@/utils/logger`)
- **Log using the logger utility** - Pre-configured with console and file transports
- **Use `catchAsync` wrapper** for all async route handlers to prevent unhandled promise rejections
- **Prisma migrations** are stored in `prisma/migrations/` (run `pnpm prisma migrate dev` after schema changes)
