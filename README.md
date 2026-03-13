# Express.js Backend API

TypeScript Express.js boilerplate dengan Prisma ORM, following layered architecture pattern.

## Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | ^22 | JavaScript runtime |
| **Express** | ^5.2.1 | Web framework |
| **TypeScript** | ^5.9.3 | Type safety |
| **Prisma** | ^7.4.2 | ORM |
| **PostgreSQL** | - | Database |
| **pnpm** | 10.30.2 | Package manager |

## Prerequisites

- **Node.js** >= 22.x
- **pnpm** >= 10.x
- **PostgreSQL** (Windows / Docker / Cloud)

---

## Windows Setup

### Install Prerequisites di Windows

**1. Install Node.js**
- Download dari: https://nodejs.org/
- Pilih LTS version (>= 22.x)

**2. Install pnpm**
```powershell
# Menggunakan PowerShell
npm install -g pnpm

# Atau menggunakan package manager lain:
# winget install pnpm.pnpm
# choco install pnpm
```

**3. Install PostgreSQL**

**Option A: PostgreSQL Installer (Windows)**
- Download dari: https://www.postgresql.org/download/windows/
- Install dengan default settings
- Ingat password yang Anda set saat install
- Pastikan PostgreSQL service berjalan

**Option B: Docker Desktop (Windows)**
- Download dari: https://www.docker.com/products/docker-desktop/
- Install dan buka Docker Desktop
- Pastikan WSL 2 sudah diaktifkan (akan diminta saat install)

**Option C: Cloud PostgreSQL**
- Gunakan Supabase, Neon, atau Railway

### Quick Start di Windows

**1. Buka Terminal/PowerShell/CMD**

**2. Clone dan masuk ke project folder**
```powershell
cd path\to\setup-express
```

**3. Install dependencies**
```powershell
pnpm install
```

**4. Setup `.env` file**

Buat atau edit file `.env` di root project:

```env
# Untuk PostgreSQL lokal (Windows)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/postgres?schema=public"

# Untuk Docker PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express_db?schema=public"

# JWT Secret
JWT_SECRET="your-secret-key-change-this-in-production"
```

**5. Generate Prisma Client**
```powershell
pnpm prisma generate
```

**6. Run Migrations**
```powershell
pnpm prisma migrate dev --name init
```

**7. Start Development Server**
```powershell
# Dengan ts-node
npx ts-node src/index.ts

# Dengan nodemon (auto-restart)
npx nodemon
```

Server berjalan di: **http://localhost:3000**

### Menjalankan dengan Docker di Windows

```powershell
# Start PostgreSQL container
docker compose -f docker-compose.dev.yml up -d

# Cek status container
docker compose ps

# Lihat logs
docker compose logs -f

# Stop container
docker compose down
```

### Windows-Specific Commands

**Mengecek Port yang sedang digunakan:**
```powershell
# Cek port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID_NUMBER> /F
```

**PostgreSQL Service di Windows:**
```powershell
# Cek service PostgreSQL
services.msc
# Cari "postgresql-x64-15"

# Atau via command line (run as Administrator)
net start postgresql-x64-15
net stop postgresql-x64-15
```

**Membersihkan cache dan reinstall:**
```powershell
# Hapus node_modules dan lock
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml

# Install ulang
pnpm install
```

---

## macOS/Linux Setup

### Install Prerequisites di macOS/Linux

**1. Install Node.js**
```bash
# macOS dengan Homebrew
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Install pnpm**
```bash
npm install -g pnpm
```

**3. Install PostgreSQL**

**Option A: Homebrew (macOS)**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb postgres
```

**Option B: Docker**
```bash
# Install Docker Desktop
brew install --cask docker  # macOS

# Start PostgreSQL container
docker compose -f docker-compose.dev.yml up -d
```

**Option C: Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Database

**Option A: PostgreSQL Homebrew (Mac)**
```bash
# Install PostgreSQL via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb postgres
```

**Option B: PostgreSQL dengan Docker**
```bash
# Install Docker Desktop
brew install --cask docker

# Start PostgreSQL container
docker compose -f docker-compose.dev.yml up -d
```

**Option C: Cloud PostgreSQL (Supabase, Neon, Railway)**
- Sign up di provider pilihan
- Copy connection string

### 3. Configure Environment

Copy `.env` dan sesuaikan konfigurasi database:

```bash
# Untuk PostgreSQL Homebrew
DATABASE_URL="postgresql://username@localhost:5432/postgres?schema=public"

# Untuk Docker PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express_db?schema=public"

# Untuk Cloud PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT Secret (wajib diubah di production)
JWT_SECRET="your-secret-key-change-this"
```

### 4. Generate Prisma Client

```bash
pnpm prisma generate
```

### 5. Run Migrations

```bash
pnpm prisma migrate dev --name init
```

### 6. Start Development Server

```bash
# Dengan ts-node (sekali jalan)
npx ts-node src/index.ts

# Dengan nodemon (auto-restart)
npx nodemon
```

Server akan berjalan di: **http://localhost:3000**

## Available Scripts

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name migration_name

# Create new migration
pnpm prisma migrate dev --create-only --name migration_name

# Reset database (hati-hati: menghapus semua data)
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Build TypeScript
npx tsc

# Run in development
npx ts-node src/index.ts

# Run with nodemon (auto-restart)
npx nodemon
```

## Project Structure

```
src/
├── config/          # Configuration files (database, environment)
├── controllers/     # Request handlers (implement IController)
├── repositories/    # Data access layer (extend BaseRepository)
├── services/        # Business logic (implement IService)
├── middlewares/     # Express middlewares (auth, error, validation)
├── routes/          # API routes
├── utils/           # Utility functions (api-error, api-response, logger)
├── types/           # TypeScript type definitions
├── interfaces/      # Shared interfaces
├── generated/       # Prisma generated client (DO NOT EDIT)
├── app.ts           # Express app configuration
└── index.ts         # Application entry point
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Authentication Endpoints

**Note**: This project uses **JWT with httpOnly cookie refresh tokens** for secure authentication.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register new user | No |
| `POST` | `/api/v1/auth/login` | Login user | No |
| `POST` | `/api/v1/auth/logout` | Logout user | Yes |
| `POST` | `/api/v1/auth/refresh-token` | Refresh access token | No (cookie) |
| `GET` | `/api/v1/auth/profile` | Get current user profile | Yes |
| `GET` | `/api/v1/auth/sessions` | Get active sessions | Yes |
| `DELETE` | `/api/v1/auth/sessions/:id` | Revoke specific session | Yes |
| `DELETE` | `/api/v1/auth/sessions` | Revoke all sessions | Yes |

#### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. REGISTER/LOGIN                                              │
│     POST /api/v1/auth/login                                     │
│     → Server validates credentials                              │
│     → Generates access token (JWT, 30 min)                      │
│     → Generates refresh token (random, 7 days)                  │
│     → Saves refresh token to database                           │
│     → Sets refresh token in httpOnly cookie                     │
│     → Returns access token in response body                     │
│                                                                 │
│  2. ACCESS PROTECTED ROUTE                                      │
│     GET /api/v1/auth/profile                                    │
│     Authorization: Bearer <access_token>                        │
│     → Middleware verifies JWT                                   │
│     → Checks user exists in DB                                  │
│     → Proceeds to controller                                    │
│                                                                 │
│  3. REFRESH TOKEN (when access expires)                         │
│     POST /api/v1/auth/refresh-token                             │
│     → Reads refresh token from httpOnly cookie                  │
│     → Validates against database                                │
│     → Deletes old refresh token (rotation)                      │
│     → Generates new access + refresh tokens                     │
│     → Sets new refresh token in cookie                          │
│     → Returns new access token                                  │
│                                                                 │
│  4. LOGOUT                                                      │
│     POST /api/v1/auth/logout                                    │
│     → Deletes refresh token from database                       │
│     → Clears httpOnly cookie                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Security Features

| Feature | Protection |
|---------|------------|
| **httpOnly cookie** | Prevents XSS (JavaScript cannot access) |
| **Secure flag** | Only sent over HTTPS |
| **SameSite=strict** | Prevents CSRF attacks |
| **Token rotation** | Old token invalidated on refresh |
| **DB storage** | Tokens can be revoked |

#### Request/Response Examples

**Register:**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "...", "email": "...", "name": "..." },
    "tokens": {
      "accessToken": "eyJhbG..."
    }
  }
}
```
**Note**: Refresh token is set in httpOnly cookie (not in response body)

**Login:**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Refresh Token:**
```bash
POST /api/v1/auth/refresh-token
# No body needed - refresh token sent automatically from cookie
```

**Logout:**
```bash
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

#### Client-Side Implementation

```typescript
// After login/register, save access token
const { accessToken } = response.data.tokens;
localStorage.setItem('accessToken', accessToken);

// For API requests, include access token
const response = await fetch('http://localhost:3000/api/v1/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// Handle 401 - refresh token automatically
if (response.status === 401) {
  const refreshResponse = await fetch('http://localhost:3000/api/v1/auth/refresh-token', {
    method: 'POST',
    credentials: 'include' // Important: include cookies
  });
  const { accessToken: newToken } = await refreshResponse.json();
  localStorage.setItem('accessToken', newToken);
  // Retry original request
}
```

#### Testing with Postman

**Important**: Refresh token endpoint uses **httpOnly cookie**, NOT request body!

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         POSTMAN TESTING GUIDE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. LOGIN (First Request)                                              │
│     ──────────────────────────                                         │
│     POST http://localhost:3000/api/v1/auth/login                       │
│     Body (raw JSON):                                                   │
│     {                                                                  │
│       "email": "user@example.com",                                     │
│       "password": "password123"                                       │
│     }                                                                  │
│                                                                         │
│     Response:                                                          │
│     - 200 OK                                                           │
│     - access_token in response body                                    │
│     - refresh_token in Set-Cookie header (Postman auto-saves)          │
│                                                                         │
│  2. REFRESH TOKEN (Subsequent Requests)                                │
│     ─────────────────────────────────────────                          │
│     POST http://localhost:3000/api/v1/auth/refresh-token               │
│     Body: EMPTY (not needed!)                                          │
│     Headers:                                                           │
│     - Authorization: NOT NEEDED                                        │
│     - Content-Type: application/json (optional)                        │
│                                                                         │
│     Postman AUTOMATICALLY sends:                                        │
│     - Cookie: refresh_token=<token_from_login>                         │
│                                                                         │
│     Response: 200 OK with new access_token                             │
│                                                                         │
│  3. CHECKING COOKIES IN POSTMAN                                        │
│     ────────────────────────────────────                               │
│     - Click "Cookies" icon (glass jar) below URL bar                  │
│     - Select domain "localhost:3000"                                   │
│     - You'll see "refresh_token" cookie there                          │
│                                                                         │
│  4. CLEARING COOKIES (To Test Invalid Token)                           │
│     ─────────────────────────────────────────────                      │
│     Method 1:                                                          │
│     - Open Cookies manager → Delete "refresh_token"                    │
│                                                                         │
│     Method 2 (Postman Script):                                         │
│     - Add to Tests tab:                                                │
│       pm.cookies.remove('refresh_token', 'localhost');                 │
│                                                                         │
│     After clearing, refresh endpoint will return 401 Unauthorized      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Common Mistake**: Sending refresh token in body will be **ignored**!

```bash
# ❌ WRONG - Body is ignored
POST /api/v1/auth/refresh-token
Body: { "refreshToken": "some_token" }

# ✅ CORRECT - Cookie is used automatically
POST /api/v1/auth/refresh-token
# (No body needed - Postman sends cookie automatically)
```

#### Testing with cURL

```bash
# 1. Login and save cookie
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Refresh token using saved cookie
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -b cookies.txt \
  -H "Content-Type: application/json"

# 3. Test without cookie (should return 401)
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json"
```

### API Routes
| Route | Base Path | Description |
|-------|-----------|-------------|
| Auth | `/api/v1/auth` | Authentication (register, login, logout) |
| Users | `/api/v1/users` | User management |

### Example Response

**Health Check:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-09T06:04:42.567Z",
  "uptime": 30.918485041
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | - | JWT signing secret |
| `PORT` | ❌ | 3000 | Server port |
| `NODE_ENV` | ❌ | development | Environment (development/production) |
| `API_PREFIX` | ❌ | /api/v1 | API route prefix |
| `CORS_ORIGIN` | ❌ | * | CORS allowed origins |

## Docker Support

### Development Mode (PostgreSQL only)
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Production Mode (App + PostgreSQL)
```bash
docker compose up --build
```

### Docker Commands
```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Layered Architecture

Project ini mengikuti pattern **Layered Architecture** dengan pemisahan yang jelas:

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Business logic
3. **Repositories** - Data access layer

```
Request → Controller → Service → Repository → Database
```

## Error Handling

Semua error ditangani secara terpusat:

- **ApiError** - Custom error class dengan status codes
- **errorConverter** - Convert error ke ApiError
- **errorHandler** - Global error handler

## Logging

Logging menggunakan **Winston** dengan output:
- Console (development)
- File `logs/combined.log`
- Error file `logs/error.log`

## Database Schema

Schema Prisma berada di `prisma/schema.prisma`. Models utama:

- **User** - User data dengan role-based access
- **Session** - User session untuk authentication
- **Post** - Post/article contoh

## Troubleshooting

### Port 3000 already in use

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Windows (PowerShell/CMD):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID_NUMBER> /F
```

**Windows (PowerShell one-liner):**
```powershell
# Kill all processes on port 3000
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Prisma Client not generated
```bash
pnpm prisma generate
```

### Database connection error

**macOS/Linux:**
- Cek PostgreSQL service: `brew services list` atau `systemctl status postgresql`
- Pastikan PostgreSQL running: `pg_isready`
- Check DATABASE_URL di `.env`

**Windows:**
- Buka `services.msc` dan pastikan PostgreSQL service running
- Atau via PowerShell: `Get-Service postgresql*`
- Check DATABASE_URL di `.env`

**Common fixes:**
- Verify database exists
- Check password di connection string
- Ensure PostgreSQL is accepting connections (check `pg_hba.conf`)

### TypeScript errors

**macOS/Linux:**
```bash
# Clean and rebuild
rm -rf node_modules dist
pnpm install
npx tsc
```

**Windows (PowerShell):**
```powershell
# Clean and rebuild
Remove-Item -Recurse -Force node_modules,dist -ErrorAction SilentlyContinue
pnpm install
npx tsc
```

**Windows (CMD):**
```cmd
rmdir /s /q node_modules dist
pnpm install
npx tsc
```

### Permission denied errors

**macOS/Linux:**
```bash
# Fix permissions
chmod +x node_modules/.bin/*
```

**Windows:**
- Run terminal sebagai Administrator
- Atau disable PowerShell execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Module not found errors

**Semua OS:**
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml  # macOS/Linux
# Remove-Item -Recurse -Force node_modules,pnpm-lock.yaml  # Windows PowerShell
pnpm install
```

### Docker issues

**Container tidak start:**
```bash
# Cek Docker status
docker info

# Restart Docker Desktop
# (Windows/macOS) Restart dari system tray

# Cek logs
docker compose logs
```

**Docker connection refused (Windows):**
- Pastikan WSL 2 sudah terinstall
- Enable WSL 2 di Docker Desktop settings
- Restart Docker Desktop

## License

ISC

## Author

Your Name <your.email@example.com>
