# API Documentation

Base URL: `http://localhost:3001/api` (development)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Auth Endpoints

#### `POST /auth/register`
Create a new account.

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** `201`:
```json
{
  "user": { "id": "uuid", "username": "john_doe", "email": "john@example.com" },
  "accessToken": "jwt...",
  "refreshToken": "jwt..."
}
```

#### `POST /auth/login`
Login with email and password.

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** `200`:
```json
{
  "user": { "id": "uuid", "username": "john_doe", "email": "john@example.com" },
  "accessToken": "jwt...",
  "refreshToken": "jwt..."
}
```

#### `POST /auth/refresh`
Refresh access token.

```json
{
  "refreshToken": "jwt..."
}
```

**Response** `200`:
```json
{
  "accessToken": "jwt..."
}
```

#### `GET /auth/me`
Get current user profile. *(Protected)*

**Response** `200`:
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "avatarUrl": null,
  "bio": null,
  "experience": "BEGINNER",
  "totalPoints": 0,
  "isPublic": true,
  "followersCount": 0,
  "followingCount": 0,
  "workoutsCount": 0,
  "currentStreak": 0,
  "createdAt": "2026-05-17T00:00:00Z",
  "updatedAt": "2026-05-17T00:00:00Z"
}
```

#### `PUT /auth/me`
Update profile. *(Protected)*

```json
{
  "username": "new_username",
  "bio": "Fitness enthusiast",
  "experience": "INTERMEDIATE",
  "isPublic": false
}
```

---

### Exercise Endpoints

#### `GET /exercises`
List exercises. *(Protected)*

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `muscleGroup` (string, optional)
- `equipment` (string, optional)
- `search` (string, optional)

**Response** `200`:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Bench Press",
      "description": "Lie on a flat bench and press the barbell up",
      "muscleGroup": "CHEST",
      "equipment": "BARBELL",
      "mediaUrl": null,
      "mediaType": null,
      "isPublic": true,
      "isPredefined": true,
      "createdBy": null,
      "createdAt": "2026-05-17T00:00:00Z",
      "updatedAt": "2026-05-17T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### `GET /exercises/:id`
Get exercise details. *(Protected)*

#### `POST /exercises`
Create exercise. *(Protected)*

```json
{
  "name": "My Custom Exercise",
  "description": "How to do it...",
  "muscleGroup": "CHEST",
  "equipment": "DUMBBELL",
  "isPublic": true
}
```

#### `PUT /exercises/:id`
Update exercise. *(Protected, owner only)*

#### `DELETE /exercises/:id`
Delete exercise. *(Protected, owner only)*

---

### Routine Endpoints

#### `GET /routines`
List routines. *(Protected)*

**Query Parameters:**
- `page`, `limit`
- `difficulty` (string, optional)
- `predefined` (boolean, optional)

#### `GET /routines/:id`
Get routine with exercises. *(Protected)*

#### `POST /routines`
Create routine. *(Protected)*

```json
{
  "name": "Push Day",
  "description": "Chest, shoulders, triceps",
  "difficulty": "INTERMEDIATE",
  "estimatedMin": 60,
  "isPublic": true,
  "exercises": [
    {
      "exerciseId": "uuid",
      "orderIndex": 0,
      "targetSets": 4,
      "targetReps": 10,
      "restSeconds": 90
    }
  ]
}
```

#### `PUT /routines/:id`
Update routine. *(Protected, owner only)*

#### `DELETE /routines/:id`
Delete routine. *(Protected, owner only)*

#### `POST /routines/:id/clone`
Clone a public routine. *(Protected)*

---

### Workout Endpoints

#### `POST /workouts`
Start a new workout. *(Protected)*

```json
{
  "routineId": "uuid (optional)",
  "notes": "Feeling strong today"
}
```

#### `GET /workouts/active`
Get current active workout. *(Protected)*

#### `GET /workouts/:id`
Get workout with all exercises and sets. *(Protected)*

#### `POST /workouts/:id/exercises`
Add exercise to active workout. *(Protected)*

```json
{
  "exerciseId": "uuid"
}
```

#### `POST /workouts/:id/exercises/:exerciseId/sets`
Log a set. *(Protected)*

```json
{
  "setNumber": 1,
  "weightKg": 80,
  "reps": 10,
  "isCompleted": true,
  "rpe": 8
}
```

#### `PUT /workouts/sets/:setId`
Update a set. *(Protected)*

#### `DELETE /workouts/sets/:setId`
Remove a set. *(Protected)*

#### `POST /workouts/:id/complete`
Complete workout and calculate stats. *(Protected)*

#### `GET /workouts/history`
Get paginated workout history. *(Protected)*

#### `GET /workouts/stats`
Get user workout statistics. *(Protected)*

---

### GymBros Endpoints

#### `POST /gymbros/sessions`
Create a GymBros session. *(Protected)*

```json
{
  "partnerUsername": "workout_buddy",
  "workoutId": "uuid (optional)"
}
```

#### `GET /gymbros/sessions/active`
Get active session. *(Protected)*

#### `POST /gymbros/sessions/:id/join`
Join a session. *(Protected)*

#### `POST /gymbros/sessions/:id/photo`
Upload verification photo. *(Protected, multipart/form-data)*

#### `POST /gymbros/sessions/:id/complete`
Complete session. *(Protected)*

---

### Ranking Endpoints

#### `GET /rankings/leaderboard`
Global leaderboard. *(Protected)*

**Query Parameters:**
- `period` (string: `all`, `week`, `month`)

#### `GET /rankings/following`
Leaderboard of followed users. *(Protected)*

#### `GET /rankings/user/:userId`
Get user rank and stats. *(Protected)*

---

### Social Endpoints

#### `POST /social/follow/:userId`
Follow a user. *(Protected)*

#### `DELETE /social/follow/:userId`
Unfollow a user. *(Protected)*

#### `GET /social/followers`
Get followers list. *(Protected)*

#### `GET /social/following`
Get following list. *(Protected)*

---

## Error Responses

### Validation Error `400`
```json
{
  "statusCode": 400,
  "error": "Validation Error",
  "message": "Name is required",
  "details": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

### Unauthorized `401`
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### Not Found `404`
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Exercise not found"
}
```

### Conflict `409`
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Username already taken"
}
```

## Rate Limiting

- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per user for authenticated endpoints

## Pagination

List endpoints return paginated responses:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```
