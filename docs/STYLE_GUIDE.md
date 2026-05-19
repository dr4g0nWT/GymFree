# Code Style Guide

## General Principles

- **Readability over cleverness**: Write code that is easy to understand
- **Consistency**: Follow existing patterns in the codebase
- **TypeScript**: Use strict types everywhere. Avoid `any`
- **Testability**: Write pure functions where possible. Inject dependencies

## TypeScript

### Naming Conventions

```typescript
// Interfaces: PascalCase
interface UserProfile {
  // ...
}

// Types: PascalCase
type MuscleGroup = 'CHEST' | 'BACK';

// Enums: PascalCase
enum Difficulty {
  Beginner = 'BEGINNER',
}

// Functions: camelCase
function getExerciseById() {}

// Variables: camelCase
const exerciseName = 'Bench Press';

// Constants: UPPER_SNAKE_CASE
const MAX_SETS_PER_EXERCISE = 10;

// Files: kebab-case
// exercise.service.ts
// user-profile.tsx

// Classes: PascalCase
class ExerciseService {}
```

### Type vs Interface

- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and primitives

```typescript
// Interface (extendable)
interface User {
  id: string;
  name: string;
}

// Type (union)
type Status = 'ACTIVE' | 'COMPLETED';
```

### Strict Mode

```typescript
// Bad
function getExercise(id: any) {
  return db.find(id);
}

// Good
function getExercise(id: string): Exercise | null {
  return db.find(id);
}
```

### Null Handling

```typescript
// Bad
if (exercise.name) { }

// Good — be explicit
if (exercise.name !== null && exercise.name !== undefined) { }
// OR
if (exercise.name != null) { }
```

## React Native (Frontend)

### Component Structure

```typescript
// exercise-card.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (id: string) => void;
}

export function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  return (
    <Card onPress={() => onPress(exercise.id)}>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.muscle}>{exercise.muscleGroup}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  muscle: {
    fontSize: 14,
    color: '#666',
  },
});
```

### File Organization

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Base components (Button, Card, Input)
│   └── features/  # Feature-specific (ExerciseCard, SetInput)
├── hooks/         # Custom hooks
├── services/      # API clients, sync engine
├── stores/        # Zustand stores
├── i18n/          # Translations
└── utils/         # Pure utility functions
```

### State Management

- **Server state**: TanStack Query (API calls, caching, sync)
- **Client state**: Zustand (UI state, theme, auth tokens)
- **Local component state**: React `useState` / `useReducer`

```typescript
// TanStack Query for server data
function useExercises(filters: ExerciseFilters) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => exerciseService.list(filters),
  });
}

// Zustand for client state
const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  primaryColor: '#6750A4',
  toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
}));
```

## Backend (Node.js + Fastify)

### Module Structure

```
modules/
├── exercises/
│   ├── exercise.controller.ts    # Route handlers
│   ├── exercise.service.ts       # Business logic
│   ├── exercise.repository.ts    # Data access
│   ├── exercise.routes.ts        # Route definitions
│   └── exercise.test.ts          # Tests
```

### Controller Pattern

```typescript
// exercise.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { exerciseService } from './exercise.service.js';

export async function listExercises(
  request: FastifyRequest<{ Querystring: PaginationQuery }>,
  reply: FastifyReply,
) {
  const result = await exerciseService.list(request.query);
  return reply.send(result);
}
```

### Service Pattern

```typescript
// exercise.service.ts
import { exerciseRepository } from './exercise.repository.js';

export const exerciseService = {
  async list(query: PaginationQuery) {
    return exerciseRepository.findMany(query);
  },

  async create(data: CreateExerciseInput, userId: string) {
    return exerciseRepository.create({
      ...data,
      createdById: userId,
    });
  },
};
```

### Error Handling

```typescript
// Use custom error classes
export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

// In service
async getById(id: string) {
  const exercise = await exerciseRepository.findById(id);
  if (!exercise) throw new NotFoundError('Exercise');
  return exercise;
}

// In error handler middleware
app.setErrorHandler((error, request, reply) => {
  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: error.message,
    });
  }
  // Default error
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});
```

## Testing

### Backend (Vitest)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { exerciseService } from './exercise.service.js';

describe('ExerciseService', () => {
  it('should create an exercise', async () => {
    const mockData = { name: 'Test', muscleGroup: 'CHEST' };
    const result = await exerciseService.create(mockData, 'user-1');

    expect(result.name).toBe('Test');
    expect(result.createdById).toBe('user-1');
  });

  it('should throw NotFoundError for non-existent exercise', async () => {
    await expect(exerciseService.getById('non-existent'))
      .rejects.toThrow('Exercise not found');
  });
});
```

## Git & Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): description
fix(scope): description
docs(scope): description
refactor(scope): description
test(scope): description
chore(scope): description
```
