#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "╔══════════════════════════════════════╗"
echo "║       🏋️  GymFree Dev Script        ║"
echo "╚══════════════════════════════════════╝"

# ── Check prerequisites ──
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required: https://nodejs.org/"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required: https://docker.com"; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "❌ npx required"; exit 1; }

echo "✅ Node.js $(node -v)"

# ── Start Docker services ──
if [ "$1" != "--mobile-only" ] && [ "$1" != "--skip-docker" ]; then
  echo ""
  echo "📦 Starting Docker services..."
  docker compose up -d 2>/dev/null

  echo "   Waiting for PostgreSQL..."
  for i in $(seq 1 30); do
    if docker compose exec postgres pg_isready -U gymfree 2>/dev/null | grep -q "accepting"; then
      echo "   ✅ PostgreSQL ready"
      break
    fi
    sleep 1
  done

  echo "   ✅ MinIO ready"
fi

# ── Install dependencies ──
if [ ! -f "node_modules/.package-lock.json" ]; then
  echo ""
  echo "📦 Installing dependencies..."
  npm install --silent 2>/dev/null
  echo "   ✅ Dependencies installed"
fi

# ── Build shared package ──
echo ""
echo "🔧 Building shared package..."
npx turbo build --filter=@gymfree/shared 2>/dev/null
echo "   ✅ Shared package built"

# ── Database setup ──
if [ "$1" != "--mobile-only" ] && [ "$1" != "--skip-seed" ]; then
  echo ""
  echo "🗃️  Running database setup..."
  cd packages/backend
  npx prisma generate 2>/dev/null
  npx prisma migrate dev --name init --skip-generate 2>/dev/null
  npx tsx prisma/seed.ts 2>/dev/null
  echo "   ✅ Database seeded with 65 exercises + 5 routines"
  cd "$ROOT_DIR"
fi

# ── Create .env if missing ──
if [ ! -f "packages/backend/.env" ] && [ "$1" != "--mobile-only" ]; then
  cp packages/backend/.env.example packages/backend/.env
  echo "   📝 Created backend .env"
fi

# ── Start services ──
echo ""
echo "🚀 Starting development servers..."
echo ""

if [ "$1" == "--backend-only" ]; then
  echo "▶ Backend: http://localhost:3001"
  echo "▶ API docs: http://localhost:3001/docs"
  cd packages/backend
  npx tsx watch src/main.ts
elif [ "$1" == "--mobile-only" ]; then
  echo "▶ Mobile: Expo dev server"
  cd packages/mobile
  npx expo start
else
  echo "▶ Backend: http://localhost:3001"
  echo "▶ API docs: http://localhost:3001/docs"
  echo "▶ Mobile: Expo dev server"

  # Start backend in background
  cd packages/backend
  npx tsx watch src/main.ts &
  BACKEND_PID=$!
  cd "$ROOT_DIR"

  sleep 3

  # Start mobile
  cd packages/mobile
  npx expo start &
  MOBILE_PID=$!
  cd "$ROOT_DIR"

  echo ""
  echo "✅ All services starting. Press Ctrl+C to stop all."

  # Cleanup on exit
  trap "kill $BACKEND_PID $MOBILE_PID 2>/dev/null; exit" INT TERM
  wait
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║          Quick Reference              ║"
echo "╠══════════════════════════════════════╣"
echo "║  API:          localhost:3001        ║"
echo "║  API Docs:     localhost:3001/docs   ║"
echo "║  PostgreSQL:   localhost:5432        ║"
echo "║  MinIO API:    localhost:9000        ║"
echo "║  MinIO Console: localhost:9001       ║"
echo "║  Expo:         expo:// or QR         ║"
echo "╚══════════════════════════════════════╝"
