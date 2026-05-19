# Local Development Setup

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker Desktop** (for PostgreSQL + MinIO)
- **Expo CLI** (for mobile development)
- **Android Studio** (for Android emulator) or **Xcode** (for iOS simulator)

## Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/samuerodg/GymFree.git
cd GymFree
npm install
```

### 2. Start Infrastructure

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 17** on port `5432`
- **MinIO** (S3-compatible storage) on port `9000` (API) and `9001` (Console)

### 3. Setup Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env

# Mobile (optional, for API URL)
cp packages/mobile/.env.example packages/mobile/.env
```

### 4. Run Database Migrations

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development

Terminal 1 — Backend:
```bash
npm run dev --filter=@gymfree/backend
```

Terminal 2 — Mobile:
```bash
npm run dev --filter=@gymfree/mobile
```

Terminal 3 — Shared (watch mode):
```bash
npm run dev --filter=@gymfree/shared
```

## Individual Package Dev

### Backend Only

```bash
cd packages/backend
npm run dev
```

API runs at `http://localhost:3001`
API docs at `http://localhost:3001/docs`

### Mobile Only

```bash
cd packages/mobile
npx expo start
```

Scan QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

### Shared Package

```bash
cd packages/shared
npm run dev
```

## Environment Variables

### Backend (`packages/backend/.env`)

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://gymfree:gymfree-dev@localhost:5432/gymfree"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# File Storage (MinIO for dev)
STORAGE_ENDPOINT="localhost:9000"
STORAGE_ACCESS_KEY="gymfree"
STORAGE_SECRET_KEY="gymfree-dev"
STORAGE_BUCKET="gymfree-media"
STORAGE_USE_SSL=false

# CORS
CORS_ORIGIN="*"

# Redis (optional, for BullMQ)
REDIS_URL="redis://localhost:6379"
```

### Mobile (`packages/mobile/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Useful Commands

```bash
# Run all tests
npm run test

# Lint all packages
npm run lint

# Format code
npm run format

# Build all packages
npm run build

# Database studio (Prisma GUI)
npm run db:studio

# Reset database
npm run db:migrate -- --reset
```

## Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Reset data (delete volumes)
docker compose down -v

# View logs
docker compose logs -f
```
