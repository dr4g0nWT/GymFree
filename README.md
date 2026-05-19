<div align="center">
  <img src="https://via.placeholder.com/120x120?text=GymFree" alt="GymFree Logo" width="120" height="120"/>
  <h1>GymFree</h1>
  <p><strong>Open-source gym workout tracker. No subscriptions. Forever free.</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#branching-strategy">Branching Strategy</a> •
    <a href="#contributing">Contributing</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/license-GPLv3-blue.svg" alt="License: GPL v3"/>
    <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS-brightgreen" alt="Platform: Android | iOS"/>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome"/>
  </p>
</div>

---

## Features

- 🏋️ **Exercise Database**: 50+ predefined exercises with muscle group & equipment filtering
- 📝 **Custom Exercises**: Create your own exercises with images, videos, or 3D models. Choose public or private
- 📋 **Routines**: Predefined routines for all levels + create custom routines with drag & drop
- ⏱️ **Training Mode**: Real-time workout tracking with rest timer, weight/reps logging, and RPE
- 📊 **Statistics**: Volume tracking, personal records, streaks, and progress charts
- 🏆 **Ranking System**: Earn points, climb leaderboards, compete with friends
- 👥 **GymBros Mode**: Train together with friends, verify with photos, earn bonus points
- 🌐 **Social**: Follow users, share workouts, compare stats
- 📱 **Cross-Platform**: Android & iOS from a single codebase
- 🔒 **Privacy**: Control who sees your profile and routines
- 🌙 **Customizable Theme**: Light/dark mode + color personalization
- 📴 **Offline-First**: Full functionality without internet, automatic sync

## Screenshots

*(Coming soon)*

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native + Expo 52 + TypeScript |
| **Navigation** | Expo Router (file-based) |
| **UI** | React Native Paper (Material Design 3) |
| **State** | Zustand + TanStack Query |
| **Local DB** | Expo SQLite (offline-first) |
| **Backend** | Node.js + Fastify + TypeScript |
| **Database** | PostgreSQL 17 + Prisma ORM |
| **Validation** | Zod (shared frontend/backend) |
| **Auth** | JWT + Google OAuth |
| **Real-Time** | Socket.io (GymBros) |
| **Storage** | MinIO / S3-compatible |
| **Monorepo** | Turborepo + Biome |

## Project Structure

```
GymFree/
├── packages/
│   ├── shared/          # Shared types, Zod schemas, constants
│   ├── backend/         # Fastify + Prisma API server
│   └── mobile/          # React Native Expo app
├── docs/                # Documentation
│   ├── ARCHITECTURE.md  # System architecture
│   ├── API.md          # API endpoint reference
│   ├── BRANCHING.md    # Branching strategy
│   ├── CONTRIBUTING.md # Contribution guide
│   ├── DATABASE.md     # Database schema
│   ├── LOCAL_DEV.md    # Local development guide
│   └── STYLE_GUIDE.md  # Code style guide
├── .github/             # CI/CD workflows
└── docker-compose.yml   # Local dev infrastructure
```

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10
- Docker Desktop

### Quick Start

```bash
# Clone and install
git clone https://github.com/samuerodg/GymFree.git
cd GymFree
npm install

# Start infrastructure (PostgreSQL + MinIO)
docker compose up -d

# Run database migrations
npm run db:migrate

# Seed data
npm run db:seed

# Start development (backend + mobile)
npm run dev
```

See the [Local Development Guide](./docs/LOCAL_DEV.md) for detailed instructions.

## Branching Strategy

We follow **GitFlow** adapted for open-source. See [BRANCHING.md](./docs/BRANCHING.md) for full details.

```
main ────── Production-ready code
  └── develop ── Integration branch
       ├── feature/*    New features
       ├── bugfix/*     Bug fixes
       ├── docs/*       Documentation
       └── refactor/*   Code refactoring
```

### Quick Reference

```bash
# Create a feature branch
git checkout develop
git checkout -b feature/my-feature

# Commit convention
git commit -m "feat(workout): add rest timer between sets"

# Push and create PR
git push origin feature/my-feature
# Create PR against develop
```

### Commit Convention

Format: `<type>(<scope>): <description>`

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code refactoring |
| `test` | Tests |
| `chore` | Build/CI |

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request against `develop`

## Roadmap

- [x] **Phase 0**: Project setup & infrastructure
- [ ] **Phase 1**: Auth, exercises, routines
- [ ] **Phase 2**: Training mode with rest timer
- [ ] **Phase 3**: Offline-first & sync engine
- [ ] **Phase 4**: Social, ranking, GymBros
- [ ] **Phase 5**: Theme customization & i18n
- [ ] **Phase 6**: AI-powered routine suggestions
- [ ] **Phase 7**: Wear OS app
- [ ] **Phase 8**: 3D exercise models

## License

Distributed under the **GNU General Public License v3.0**. See [LICENSE](./LICENSE) for more information.

## Contributors

<a href="https://github.com/samuerodg/GymFree/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=samuerodg/GymFree" />
</a>

---

<p align="center">
  Made with ❤️ for the open-source fitness community
</p>
