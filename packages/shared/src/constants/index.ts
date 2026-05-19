export const MUSCLE_GROUPS = [
  'CHEST',
  'BACK',
  'SHOULDERS',
  'BICEPS',
  'TRICEPS',
  'FOREARMS',
  'QUADRICEPS',
  'HAMSTRINGS',
  'GLUTES',
  'CALVES',
  'ABS',
  'LOWER_BACK',
  'TRAPS',
  'NECK',
  'FULL_BODY',
  'CARDIO',
] as const;

export const EQUIPMENT = [
  'BARBELL',
  'DUMBBELL',
  'KETTLEBELL',
  'CABLE',
  'MACHINE',
  'BODYWEIGHT',
  'BAND',
  'MEDICINE_BALL',
  'BENCH',
  'SQUAT_RACK',
  'PULL_UP_BAR',
  'DIP_BARS',
  'SMITH_MACHINE',
  'LEG_PRESS',
  'OTHER',
] as const;

export const DIFFICULTY = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

export const EXPERIENCE_LEVEL = [
  'BEGINNER',
  'NOVICE',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
] as const;

export const WORKOUT_STATUS = ['ACTIVE', 'COMPLETED', 'CANCELLED'] as const;

export const SESSION_STATUS = ['PENDING', 'ACTIVE', 'COMPLETED', 'VERIFIED'] as const;

export const MEDIA_TYPE = ['IMAGE', 'VIDEO', 'MODEL_3D'] as const;

export const POINTS = {
  SET_COMPLETED: 10,
  PERSONAL_RECORD: 50,
  ROUTINE_COMPLETED: 25,
  GYMBROS_MULTIPLIER: 1.5,
  GYMBROS_VERIFIED_PHOTO: 100,
  STREAK_BASE: 5,
} as const;
