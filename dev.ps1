param(
  [switch]$SkipDocker,
  [switch]$SkipSeed,
  [switch]$MobileOnly,
  [switch]$BackendOnly
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $rootDir

Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       🏋️  GymFree Dev Script        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan

# ── Check prerequisites ──
function Check-Command($name, $url) {
  if (!(Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Host "❌ $name is not installed. Get it at: $url" -ForegroundColor Red
    exit 1
  }
}

Check-Command "node" "https://nodejs.org/"
Check-Command "docker" "https://www.docker.com/"
Check-Command "npx" "https://nodejs.org/"

$nodeVersion = node -v
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

# ── Docker services ──
if (!$SkipDocker -and !$MobileOnly) {
  Write-Host "`n📦 Starting Docker services..." -ForegroundColor Yellow
  docker compose up -d 2>&1 | Out-Null

  Write-Host "   Waiting for PostgreSQL..." -ForegroundColor Yellow
  $maxRetries = 30
  $retry = 0
  while ($retry -lt $maxRetries) {
    $ready = docker compose exec postgres pg_isready -U gymfree 2>&1
    if ($ready -match "accepting connections") {
      Write-Host "   ✅ PostgreSQL ready" -ForegroundColor Green
      break
    }
    Start-Sleep -Seconds 1
    $retry++
  }
  if ($retry -ge $maxRetries) {
    Write-Host "   ❌ PostgreSQL failed to start" -ForegroundColor Red
    exit 1
  }

  # Check MinIO
  $minioReady = $false
  for ($i = 0; $i -lt 15; $i++) {
    try {
      $res = Invoke-WebRequest -Uri "http://localhost:9001" -TimeoutSec 2 -ErrorAction Stop
      $minioReady = $true
      break
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  if ($minioReady) {
    Write-Host "   ✅ MinIO ready" -ForegroundColor Green
  }
}

# ── Install dependencies (if needed) ──
if (!(Test-Path "node_modules/.package-lock.json")) {
  Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
  npm install 2>&1 | Out-Null
  Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
}

# ── Build shared package ──
Write-Host "`n🔧 Building shared package..." -ForegroundColor Yellow
npx turbo build --filter=@gymfree/shared 2>&1 | Out-Null
Write-Host "   ✅ Shared package built" -ForegroundColor Green

# ── Database migrations + seed ──
if (!$SkipSeed -and !$MobileOnly) {
  Write-Host "`n🗃️  Running database setup..." -ForegroundColor Yellow

  Write-Host "   Generating Prisma client..."
  Set-Location "packages/backend"
  npx prisma generate 2>&1 | Out-Null

  Write-Host "   Running migrations..."
  npx prisma migrate dev --name init --skip-generate 2>&1 | Out-Null

  if (!$SkipSeed) {
    Write-Host "   Seeding database..."
    npx tsx prisma/seed.ts 2>&1 | Out-Null
    Write-Host "   ✅ Database seeded with 65 exercises + 5 routines" -ForegroundColor Green
  }
  Set-Location $rootDir
}

# ── Create .env if missing ──
if (!(Test-Path "packages/backend/.env") -and !$MobileOnly) {
  Copy-Item "packages/backend/.env.example" "packages/backend/.env"
  Write-Host "   📝 Created backend .env (edit JWT_SECRET for production)" -ForegroundColor Yellow
}

# ── Start services ──
Write-Host "`n🚀 Starting development servers..." -ForegroundColor Cyan
Write-Host ""

if ($BackendOnly) {
  Write-Host "▶ Backend: http://localhost:3001" -ForegroundColor Green
  Write-Host "▶ API docs: http://localhost:3001/docs" -ForegroundColor Green
  Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "-Command", "cd $rootDir/packages/backend; npx tsx watch src/main.ts"
}
elseif ($MobileOnly) {
  Write-Host "▶ Mobile: Expo dev server" -ForegroundColor Green
  Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "-Command", "cd $rootDir/packages/mobile; npx expo start"
}
else {
  # Start backend in new window
  Write-Host "▶ Backend: http://localhost:3001" -ForegroundColor Green
  Write-Host "▶ API docs: http://localhost:3001/docs" -ForegroundColor Green
  Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "-Command", "cd $rootDir/packages/backend; npx tsx watch src/main.ts"

  Start-Sleep -Seconds 3

  # Start mobile in new window
  Write-Host "▶ Mobile: Expo dev server" -ForegroundColor Green
  Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "-Command", "cd $rootDir/packages/mobile; npx expo start"
}

Write-Host "`n✅ All services starting. Press Ctrl+C to stop each terminal." -ForegroundColor Green
Write-Host ""

# Print quick reference
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          Quick Reference              ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  API:          localhost:3001        ║" -ForegroundColor White
Write-Host "║  API Docs:     localhost:3001/docs   ║" -ForegroundColor White
Write-Host "║  PostgreSQL:   localhost:5432        ║" -ForegroundColor White
Write-Host "║  MinIO API:    localhost:9000        ║" -ForegroundColor White
Write-Host "║  MinIO Console: localhost:9001       ║" -ForegroundColor White
Write-Host "║  Expo:         expo:// or QR         ║" -ForegroundColor White
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan

# Run health check
Start-Sleep -Seconds 2
try {
  $health = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
  $data = $health.Content | ConvertFrom-Json
  Write-Host "`n❤️  Backend health: $($data.status) (uptime: $([math]::Round($data.uptime, 0))s)" -ForegroundColor Green
} catch {
  Write-Host "`n⏳ Backend still starting... check the terminal window" -ForegroundColor Yellow
}
