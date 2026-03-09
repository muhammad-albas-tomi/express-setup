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
