# Branching Strategy

GymFree follows **GitFlow with adaptations** for an open-source project. This strategy keeps the main branch stable while allowing multiple contributors to work simultaneously.

## Branch Hierarchy

```
main ......................... Production-ready code
  └── develop ................ Integration branch
       ├── feature/* ......... New features
       ├── bugfix/* .......... Bug fixes
       ├── docs/* ............ Documentation
       ├── refactor/* ........ Code refactoring
       └── experimental/* .... Experimental features
```

## Branch Types

### `main`
- **Purpose**: Production-ready code
- **Protected**: Yes — requires PR + code review
- **Deploy**: Auto-deploys to production
- **Rules**:
  - Only `develop` merges into `main` (via release PRs)
  - Hotfixes can merge directly in emergencies
  - All commits must be signed

### `develop`
- **Purpose**: Integration branch for ongoing work
- **Protected**: Yes — requires PR + at least 1 approval
- **Rules**:
  - Feature/bugfix branches merge here
  - Must pass all CI checks
  - Should always be deployable

### `feature/*`
- **Purpose**: New features
- **Naming**: `feature/<feature-name>` (e.g., `feature/gymbros-session`)
- **Branch from**: `develop`
- **Merge into**: `develop`
- **Rules**:
  - One feature per branch
  - Delete branch after merge
  - Keep branches short-lived (< 1 week ideal)

### `bugfix/*`
- **Purpose**: Bug fixes
- **Naming**: `bugfix/<issue-description>` (e.g., `bugfix/workout-timer-offset`)
- **Branch from**: `develop`
- **Merge into**: `develop`
- **Rules**:
  - Include reference to the issue if applicable

### `docs/*`
- **Purpose**: Documentation-only changes
- **Naming**: `docs/<topic>` (e.g., `docs/api-endpoints`)
- **Branch from**: `develop`
- **Merge into**: `develop`

### `refactor/*`
- **Purpose**: Code refactoring without functional changes
- **Naming**: `refactor/<scope>` (e.g., `refactor/auth-module`)
- **Branch from**: `develop`
- **Merge into**: `develop`

### `experimental/*`
- **Purpose**: Experimental features that may not ship
- **Naming**: `experimental/<idea>` (e.g., `experimental/ai-routine-generator`)
- **Branch from**: `develop`
- **Merge into**: `develop` (if successful) or discard

### `release/*`
- **Purpose**: Release candidates
- **Naming**: `release/v<version>` (e.g., `release/v1.0.0`)
- **Branch from**: `develop`
- **Merge into**: `main` + back to `develop`
- **Rules**:
  - Only bug fixes in release branch
  - No new features
  - Once approved, merge to `main` and tag

### `hotfix/*`
- **Purpose**: Urgent production fixes
- **Naming**: `hotfix/<issue>` (e.g., `hotfix/login-crash`)
- **Branch from**: `main`
- **Merge into**: `main` + back to `develop`

## Workflow

### Creating a New Feature

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
# Create PR against develop via GitHub
```

### Creating a Release

```bash
# From develop, create release branch
git checkout develop
git checkout -b release/v1.0.0

# Fix any release-specific issues
git commit -m "fix: release fixes"

# Create PR against main → merge → tag
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop

# Delete release branch
git branch -d release/v1.0.0
```

### Hotfix

```bash
# Branch from main
git checkout main
git checkout -b hotfix/critical-bug

# Fix and commit
git commit -m "fix: critical bug"

# Merge to main and tag
git checkout main
git merge hotfix/critical-bug
git tag v1.0.1
git push origin main --tags

# Also merge to develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop
```

## Commit Message Convention

We follow **Conventional Commits**:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type     | Usage                        |
|----------|------------------------------|
| `feat`   | A new feature                |
| `fix`    | A bug fix                    |
| `docs`   | Documentation changes        |
| `style`  | Code style (formatting)      |
| `refactor` | Code refactoring           |
| `test`   | Adding or modifying tests    |
| `chore`  | Build, CI, dependencies      |
| `perf`   | Performance improvements     |

### Examples

```
feat(workout): add rest timer between sets
fix(auth): handle token refresh race condition
docs(api): add exercise search endpoint docs
refactor(gymbros): extract photo verification service
test(shared): add Zod schema validation tests
chore: update dependencies
```

## Pull Request Guidelines

### Title
Follow conventional commits format: `type(scope): description`

### PR Template Checklist
- [ ] Code follows project style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changes work offline
- [ ] Sync tested (if applicable)
- [ ] No breaking changes (or documented if so)

### Review Requirements
- Feature branches: at least 1 approval
- Release branches: at least 2 approvals
- Hotfix: at least 1 approval (can be expedited)

## Versioning

We follow **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking API or database changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Pre-release tags: `v1.0.0-alpha.1`, `v1.0.0-beta.1`, `v1.0.0-rc.1`
