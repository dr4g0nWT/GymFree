# Database Schema

## Overview

PostgreSQL 17 database with Prisma ORM. The schema follows a relational model designed for local-first sync (every table has `createdAt`/`updatedAt` timestamps).

## Entity Relationship Diagram

```
User (1)──┐
          ├── (N) Exercise      ──┬── RoutineExercise (N) ── (1) Routine
          │                        │
          ├── (N) Routine         ──┘
          │
          ├── (N) Workout        ──┬── WorkoutExercise (N)  ──┬── WorkoutSet (N)
          │                        │                            │
          │                        └── Exercise (1)            └── (N)
          │
          ├── (N) GymbrosSession (Host)   ──┬── GymbrosPhoto (N)
          ├── (N) GymbrosSession (Partner) ──┘
          │
          ├── (N) Follow (Follower)
          ├── (N) Follow (Following)
          └── (1) Ranking
```

## Enums

### MuscleGroup
`CHEST`, `BACK`, `SHOULDERS`, `BICEPS`, `TRICEPS`, `FOREARMS`, `QUADRICEPS`, `HAMSTRINGS`, `GLUTES`, `CALVES`, `ABS`, `LOWER_BACK`, `TRAPS`, `NECK`, `FULL_BODY`, `CARDIO`

### Equipment
`BARBELL`, `DUMBBELL`, `KETTLEBELL`, `CABLE`, `MACHINE`, `BODYWEIGHT`, `BAND`, `MEDICINE_BALL`, `BENCH`, `SQUAT_RACK`, `PULL_UP_BAR`, `DIP_BARS`, `SMITH_MACHINE`, `LEG_PRESS`, `OTHER`

### Difficulty
`BEGINNER`, `INTERMEDIATE`, `ADVANCED`

### ExperienceLevel
`BEGINNER`, `NOVICE`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

### WorkoutStatus
`ACTIVE`, `COMPLETED`, `CANCELLED`

### SessionStatus
`PENDING`, `ACTIVE`, `COMPLETED`, `VERIFIED`

### MediaType
`IMAGE`, `VIDEO`, `MODEL_3D`

## Tables

### User
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| username | VARCHAR(30) UNIQUE | Display name |
| email | VARCHAR(255) UNIQUE | Login email |
| passwordHash | VARCHAR(255) | bcrypt hash |
| avatarUrl | VARCHAR(500)? | Profile picture |
| bio | TEXT? | User biography |
| experience | ExperienceLevel | Default: BEGINNER |
| totalPoints | INTEGER | Default: 0 |
| isPublic | BOOLEAN | Profile visibility, default: true |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

### Exercise
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| name | VARCHAR(100) | Exercise name |
| description | TEXT? | Instructions |
| muscleGroup | MuscleGroup | Primary muscle |
| equipment | Equipment? | Required equipment |
| mediaUrl | VARCHAR(500)? | Image/Video/3D URL |
| mediaType | MediaType? | Type of media |
| isPublic | BOOLEAN | Default: true |
| isPredefined | BOOLEAN | System-defined, default: false |
| createdById | UUID (FK → User)? | Null for predefined |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

### Routine
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| name | VARCHAR(100) | Routine name |
| description | TEXT? | Description |
| difficulty | Difficulty | Default: BEGINNER |
| estimatedMin | INTEGER? | Estimated duration |
| isPublic | BOOLEAN | Default: true |
| isPredefined | BOOLEAN | System-defined, default: false |
| createdById | UUID (FK → User)? | Null for predefined |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

### RoutineExercise
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| routineId | UUID (FK → Routine) | CASCADE delete |
| exerciseId | UUID (FK → Exercise) | |
| orderIndex | INTEGER | Exercise order |
| targetSets | INTEGER | Default: 3 |
| targetReps | INTEGER? | Target reps per set |
| targetWeight | FLOAT? | Target weight in kg |
| restSeconds | INTEGER | Default: 90 |
| notes | TEXT? | Exercise notes |
| UNIQUE(routineId, exerciseId) | | No duplicate exercises |

### Workout
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| userId | UUID (FK → User) | |
| routineId | UUID (FK → Routine)? | Optional template |
| startedAt | TIMESTAMP | |
| endedAt | TIMESTAMP? | Null if active |
| durationMin | INTEGER? | Calculated on complete |
| notes | TEXT? | Workout notes |
| isGymbros | BOOLEAN | Default: false |

### WorkoutExercise
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| workoutId | UUID (FK → Workout) | CASCADE delete |
| exerciseId | UUID (FK → Exercise) | |
| orderIndex | INTEGER | Exercise order |

### WorkoutSet
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| workoutExerciseId | UUID (FK → WorkoutExercise) | CASCADE delete |
| setNumber | INTEGER | 1-based |
| weightKg | FLOAT? | Weight in kg |
| reps | INTEGER? | Reps performed |
| isCompleted | BOOLEAN | Default: false |
| rpe | INTEGER? | Rate of Perceived Exertion (1-10) |
| createdAt | TIMESTAMP | |

### GymbrosSession
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| hostId | UUID (FK → User) | Session creator |
| partnerId | UUID (FK → User) | Invited user |
| workoutId | UUID (FK → Workout)? | Host's workout |
| status | SessionStatus | Default: PENDING |
| startedAt | TIMESTAMP | |
| endedAt | TIMESTAMP? | |
| bonusPoints | INTEGER | Extra points, default: 0 |

### GymbrosPhoto
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| sessionId | UUID (FK → GymbrosSession) | CASCADE delete |
| userId | UUID (FK → User) | Who uploaded |
| photoUrl | VARCHAR(500) | Photo URL |
| verified | BOOLEAN | Admin verified, default: false |
| createdAt | TIMESTAMP | |

### Follow
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| followerId | UUID (FK → User) | Who follows |
| followingId | UUID (FK → User) | Being followed |
| createdAt | TIMESTAMP | |
| UNIQUE(followerId, followingId) | | No double follow |

### Ranking
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| userId | UUID (FK → User) UNIQUE | |
| totalPoints | INTEGER | All-time |
| weekPoints | INTEGER | Current week |
| monthPoints | INTEGER | Current month |
| rank | INTEGER? | Cached rank position |
| updatedAt | TIMESTAMP | |

## Indexes

```sql
-- Exercise search
CREATE INDEX idx_exercise_muscle ON Exercise(muscleGroup);
CREATE INDEX idx_exercise_equipment ON Exercise(equipment);
CREATE INDEX idx_exercise_name ON Exercise USING gin(name gin_trgm_ops);

-- Routine lookup
CREATE INDEX idx_routine_created_by ON Routine(createdById);
CREATE INDEX idx_routine_difficulty ON Routine(difficulty);

-- Workout queries
CREATE INDEX idx_workout_user ON Workout(userId);
CREATE INDEX idx_workout_started ON Workout(userId, startedAt DESC);
CREATE INDEX idx_workout_exercise ON WorkoutExercise(workoutId);

-- Social
CREATE INDEX idx_follow_follower ON Follow(followerId);
CREATE INDEX idx_follow_following ON Follow(followingId);

-- Rankings
CREATE INDEX idx_ranking_points ON Ranking(totalPoints DESC);

-- Sync
CREATE INDEX idx_entity_updated ON entity(updatedAt);
```
