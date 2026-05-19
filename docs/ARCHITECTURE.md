# GymFree Architecture

## Overview

GymFree is an open-source, cross-platform gym workout tracker built with a **local-first architecture**. The app works fully offline and syncs data to the cloud when connectivity is available.

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  UI Layer   │  │  State Mgmt  │  │  Local Database   │  │
│  │ (Expo Router│  │  (Zustand +  │  │  (Expo SQLite)    │  │
│  │  + Paper)   │  │  TanStack)   │  │                   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│                           │                                │
│                    ┌──────┴──────┐                        │
│                    │ Sync Engine  │                        │
│                    └──────┬──────┘                        │
└───────────────────────────┼────────────────────────────────┘
                            │ HTTPS / WebSocket
┌───────────────────────────┼────────────────────────────────┐
│                  API Gateway (Fastify)                      │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐   │
│  │ Auth     │ │ Exercises│ │Routines│ │   Workouts   │   │
│  │ Module   │ │ Module   │ │ Module │ │   Module     │   │
│  └──────────┘ └──────────┘ └────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐   │
│  │ GymBros  │ │ Rankings │ │ Social │ │   Common     │   │
│  │ Module   │ │ Module   │ │ Module │ │ Middleware    │   │
│  └──────────┘ └──────────┘ └────────┘ └──────────────┘   │
│                           │                                │
│                    ┌──────┴──────┐                        │
│                    │  Prisma ORM │                         │
│                    └──────┬──────┘                        │
└───────────────────────────┼────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  PostgreSQL   │
                    └───────────────┘
```

## Monorepo Structure

```
GymFree/
├── packages/
│   ├── shared/        # Shared types, Zod schemas, constants
│   ├── backend/       # Fastify + Prisma API server
│   └── mobile/        # React Native Expo app
├── docs/              # Documentation
├── .github/           # CI/CD workflows
└── docker-compose.yml # Local dev infrastructure
```

## Key Architectural Decisions

### 1. Local-First Architecture

The app prioritizes local data storage and syncs to the server:

- **Local DB**: Expo SQLite stores all user data locally
- **Sync Queue**: Operations performed offline are queued
- **Background Sync**: Auto-syncs when connectivity is restored
- **Conflict Resolution**: Last-write-wins strategy (sufficient for fitness use cases)

### 2. Modular Backend

Each domain is a self-contained module with:

- **Controller**: Route handlers and request validation
- **Service**: Business logic
- **Repository**: Data access (via Prisma)

### 3. Shared Validation

Zod schemas in `packages/shared` are used by both frontend and backend, ensuring type safety across the entire stack.

### 4. Real-Time via WebSocket

Socket.io is used exclusively for the GymBros feature (real-time session sync). All other communication is REST over HTTPS.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Mobile Framework | React Native + Expo 52 | Cross-platform Android/iOS |
| Navigation | Expo Router | File-based routing |
| UI Components | React Native Paper (M3) | Material Design 3 |
| State Management | Zustand + TanStack Query | Client + Server state |
| Local DB | Expo SQLite | Offline-first storage |
| Backend Framework | Fastify | High-performance Node.js server |
| ORM | Prisma | Type-safe database access |
| Database | PostgreSQL 17 | Relational data store |
| Validation | Zod | Shared schemas frontend/backend |
| Real-Time | Socket.io | GymBros sessions |
| File Storage | MinIO / S3 | Exercise media |
| Auth | JWT + Google OAuth | Authentication |
| Monorepo | Turborepo | Build orchestration |
| Linting | Biome | Fast unified tooling |
