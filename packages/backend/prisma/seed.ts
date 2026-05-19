import { PrismaClient, MuscleGroup, Equipment, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedExercise {
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment | null;
}

const PREDEFINED_EXERCISES: SeedExercise[] = [
  // Chest
  { name: 'Bench Press', description: 'Lie on a flat bench, lower the barbell to your chest, and press up.', muscleGroup: 'CHEST', equipment: 'BARBELL' },
  { name: 'Incline Bench Press', description: 'Bench press on a 30-45 degree incline to target upper chest.', muscleGroup: 'CHEST', equipment: 'BARBELL' },
  { name: 'Decline Bench Press', description: 'Bench press on a decline bench targeting lower chest.', muscleGroup: 'CHEST', equipment: 'BARBELL' },
  { name: 'Dumbbell Flyes', description: 'Lie on a bench with dumbbells, open arms wide, and bring them together.', muscleGroup: 'CHEST', equipment: 'DUMBBELL' },
  { name: 'Cable Crossover', description: 'Stand between cables, pull handles together in front of you.', muscleGroup: 'CHEST', equipment: 'CABLE' },
  { name: 'Push-Ups', description: 'Bodyweight exercise: lower chest to ground and push up.', muscleGroup: 'CHEST', equipment: 'BODYWEIGHT' },
  { name: 'Dumbbell Bench Press', description: 'Bench press with dumbbells for greater range of motion.', muscleGroup: 'CHEST', equipment: 'DUMBBELL' },
  { name: 'Machine Chest Press', description: 'Seated chest press machine.', muscleGroup: 'CHEST', equipment: 'MACHINE' },

  // Back
  { name: 'Pull-Ups', description: 'Hang from a bar and pull yourself up until chin is over the bar.', muscleGroup: 'BACK', equipment: 'BODYWEIGHT' },
  { name: 'Lat Pulldown', description: 'Seated at cable machine, pull the bar down to your chest.', muscleGroup: 'BACK', equipment: 'CABLE' },
  { name: 'Barbell Row', description: 'Bent over, row the barbell to your lower chest.', muscleGroup: 'BACK', equipment: 'BARBELL' },
  { name: 'Dumbbell Row', description: 'One arm supported on bench, row dumbbell to hip.', muscleGroup: 'BACK', equipment: 'DUMBBELL' },
  { name: 'Seated Cable Row', description: 'Seated at cable, pull handle to your torso.', muscleGroup: 'BACK', equipment: 'CABLE' },
  { name: 'Deadlift', description: 'Lift the barbell from the ground to hip height.', muscleGroup: 'BACK', equipment: 'BARBELL' },
  { name: 'T-Bar Row', description: 'Using T-bar or landmine, row the weight.', muscleGroup: 'BACK', equipment: 'BARBELL' },
  { name: 'Face Pull', description: 'Pull cable rope toward your face to target rear delts and traps.', muscleGroup: 'BACK', equipment: 'CABLE' },

  // Shoulders
  { name: 'Overhead Press', description: 'Press barbell from shoulders to overhead.', muscleGroup: 'SHOULDERS', equipment: 'BARBELL' },
  { name: 'Dumbbell Shoulder Press', description: 'Seated, press dumbbells from shoulders to overhead.', muscleGroup: 'SHOULDERS', equipment: 'DUMBBELL' },
  { name: 'Lateral Raise', description: 'Raise dumbbells to sides until parallel to ground.', muscleGroup: 'SHOULDERS', equipment: 'DUMBBELL' },
  { name: 'Front Raise', description: 'Raise dumbbell or plate in front of you to shoulder height.', muscleGroup: 'SHOULDERS', equipment: 'DUMBBELL' },
  { name: 'Reverse Flyes', description: 'Bent over, raise dumbbells out to sides.', muscleGroup: 'SHOULDERS', equipment: 'DUMBBELL' },
  { name: 'Arnold Press', description: 'Rotation press: palms face you at bottom, forward at top.', muscleGroup: 'SHOULDERS', equipment: 'DUMBBELL' },
  { name: 'Upright Row', description: 'Pull barbell up along your body to chin level.', muscleGroup: 'SHOULDERS', equipment: 'BARBELL' },

  // Biceps
  { name: 'Barbell Curl', description: 'Standing, curl the barbell from hips to shoulders.', muscleGroup: 'BICEPS', equipment: 'BARBELL' },
  { name: 'Dumbbell Curl', description: 'Alternating or simultaneous dumbbell curls.', muscleGroup: 'BICEPS', equipment: 'DUMBBELL' },
  { name: 'Hammer Curl', description: 'Dumbbell curl with palms facing each other.', muscleGroup: 'BICEPS', equipment: 'DUMBBELL' },
  { name: 'Preacher Curl', description: 'Curl on a preacher bench to isolate biceps.', muscleGroup: 'BICEPS', equipment: 'BARBELL' },
  { name: 'Cable Curl', description: 'Cable bicep curl for constant tension.', muscleGroup: 'BICEPS', equipment: 'CABLE' },
  { name: 'Concentration Curl', description: 'Seated, curl single dumbbell across body.', muscleGroup: 'BICEPS', equipment: 'DUMBBELL' },

  // Triceps
  { name: 'Tricep Pushdown', description: 'Cable pushdown with rope or bar.', muscleGroup: 'TRICEPS', equipment: 'CABLE' },
  { name: 'Skull Crushers', description: 'Lying, lower barbell to forehead and extend.', muscleGroup: 'TRICEPS', equipment: 'BARBELL' },
  { name: 'Dips', description: 'Lower yourself on parallel bars and push up.', muscleGroup: 'TRICEPS', equipment: 'BODYWEIGHT' },
  { name: 'Close-Grip Bench Press', description: 'Bench press with hands close together.', muscleGroup: 'TRICEPS', equipment: 'BARBELL' },
  { name: 'Overhead Tricep Extension', description: 'Extend dumbbell overhead behind head.', muscleGroup: 'TRICEPS', equipment: 'DUMBBELL' },

  // Legs - Quadriceps
  { name: 'Squat', description: 'Barbell on back, squat to parallel and stand up.', muscleGroup: 'QUADRICEPS', equipment: 'BARBELL' },
  { name: 'Leg Press', description: 'Push platform away using legs on leg press machine.', muscleGroup: 'QUADRICEPS', equipment: 'LEG_PRESS' },
  { name: 'Bulgarian Split Squat', description: 'Rear foot elevated, front foot squat.', muscleGroup: 'QUADRICEPS', equipment: 'DUMBBELL' },
  { name: 'Leg Extension', description: 'Extend legs on leg extension machine.', muscleGroup: 'QUADRICEPS', equipment: 'MACHINE' },
  { name: 'Front Squat', description: 'Barbell racked on front shoulders, squat down.', muscleGroup: 'QUADRICEPS', equipment: 'BARBELL' },
  { name: 'Goblet Squat', description: 'Hold dumbbell or kettlebell at chest and squat.', muscleGroup: 'QUADRICEPS', equipment: 'DUMBBELL' },

  // Hamstrings
  { name: 'Romanian Deadlift', description: 'Hinge at hips, lower barbell along legs keeping slight bend.', muscleGroup: 'HAMSTRINGS', equipment: 'BARBELL' },
  { name: 'Leg Curl', description: 'Lie face down, curl heels toward glutes.', muscleGroup: 'HAMSTRINGS', equipment: 'MACHINE' },
  { name: 'Glute Ham Raise', description: 'Raise torso on GHD machine.', muscleGroup: 'HAMSTRINGS', equipment: 'MACHINE' },
  { name: 'Good Mornings', description: 'Barbell on back, hinge forward at hips.', muscleGroup: 'HAMSTRINGS', equipment: 'BARBELL' },
  { name: 'Nordic Curl', description: 'Kneeling, lower torso controlled toward ground.', muscleGroup: 'HAMSTRINGS', equipment: 'BODYWEIGHT' },

  // Glutes
  { name: 'Hip Thrust', description: 'Shoulders on bench, barbell on hips, thrust up.', muscleGroup: 'GLUTES', equipment: 'BARBELL' },
  { name: 'Glute Bridge', description: 'Lie on back, lift hips up squeezing glutes.', muscleGroup: 'GLUTES', equipment: 'BODYWEIGHT' },
  { name: 'Cable Kickback', description: 'Kick leg back against cable resistance.', muscleGroup: 'GLUTES', equipment: 'CABLE' },
  { name: 'Step-Ups', description: 'Step up onto bench/box holding dumbbells.', muscleGroup: 'GLUTES', equipment: 'DUMBBELL' },

  // Calves
  { name: 'Standing Calf Raise', description: 'Raise heels on standing calf raise machine.', muscleGroup: 'CALVES', equipment: 'MACHINE' },
  { name: 'Seated Calf Raise', description: 'Raise heels on seated calf raise machine.', muscleGroup: 'CALVES', equipment: 'MACHINE' },

  // ABS
  { name: 'Crunch', description: 'Classic abdominal crunch on floor.', muscleGroup: 'ABS', equipment: 'BODYWEIGHT' },
  { name: 'Leg Raises', description: 'Lie flat, raise legs to 90 degrees.', muscleGroup: 'ABS', equipment: 'BODYWEIGHT' },
  { name: 'Plank', description: 'Hold straight body position on forearms.', muscleGroup: 'ABS', equipment: 'BODYWEIGHT' },
  { name: 'Cable Crunch', description: 'Kneel at cable, crunch rope to ground.', muscleGroup: 'ABS', equipment: 'CABLE' },
  { name: 'Russian Twist', description: 'Seated, rotate torso side to side with weight.', muscleGroup: 'ABS', equipment: 'BODYWEIGHT' },
  { name: 'Hanging Leg Raise', description: 'Hang from bar and raise legs.', muscleGroup: 'ABS', equipment: 'BODYWEIGHT' },
  { name: 'Ab Wheel Rollout', description: 'Roll wheel out and back on knees.', muscleGroup: 'ABS', equipment: 'OTHER' },

  // Cardio
  { name: 'Treadmill Running', description: 'Run on treadmill at desired pace.', muscleGroup: 'CARDIO', equipment: 'MACHINE' },
  { name: 'Rowing Machine', description: 'Row on ergometer.', muscleGroup: 'CARDIO', equipment: 'MACHINE' },
  { name: 'Jump Rope', description: 'Skip rope continuously.', muscleGroup: 'CARDIO', equipment: 'BODYWEIGHT' },
  { name: 'Stationary Bike', description: 'Cycle on stationary bike.', muscleGroup: 'CARDIO', equipment: 'MACHINE' },
];

const PREDEFINED_ROUTINES: Array<{
  name: string;
  description: string;
  difficulty: Difficulty;
  estimatedMin: number;
  exercises: Array<{ name: string; targetSets: number; targetReps: number }>;
}> = [
  {
    name: 'Full Body Beginner',
    description: 'A balanced full-body workout for beginners. Hits all major muscle groups.',
    difficulty: 'BEGINNER',
    estimatedMin: 45,
    exercises: [
      { name: 'Bench Press', targetSets: 3, targetReps: 10 },
      { name: 'Lat Pulldown', targetSets: 3, targetReps: 10 },
      { name: 'Leg Press', targetSets: 3, targetReps: 12 },
      { name: 'Dumbbell Shoulder Press', targetSets: 3, targetReps: 10 },
      { name: 'Dumbbell Curl', targetSets: 2, targetReps: 12 },
      { name: 'Tricep Pushdown', targetSets: 2, targetReps: 12 },
      { name: 'Plank', targetSets: 3, targetReps: 30 },
    ],
  },
  {
    name: 'Push / Pull / Legs',
    description: 'Classic PPL split. Do this 3-6 days per week.',
    difficulty: 'INTERMEDIATE',
    estimatedMin: 60,
    exercises: [
      { name: 'Bench Press', targetSets: 4, targetReps: 10 },
      { name: 'Incline Bench Press', targetSets: 3, targetReps: 10 },
      { name: 'Overhead Press', targetSets: 3, targetReps: 10 },
      { name: 'Lateral Raise', targetSets: 3, targetReps: 15 },
      { name: 'Tricep Pushdown', targetSets: 3, targetReps: 12 },
      { name: 'Skull Crushers', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Upper / Lower Split',
    description: 'Upper body one day, lower body the next.',
    difficulty: 'INTERMEDIATE',
    estimatedMin: 60,
    exercises: [
      { name: 'Bench Press', targetSets: 4, targetReps: 8 },
      { name: 'Barbell Row', targetSets: 4, targetReps: 8 },
      { name: 'Overhead Press', targetSets: 3, targetReps: 10 },
      { name: 'Pull-Ups', targetSets: 3, targetReps: 8 },
      { name: 'Barbell Curl', targetSets: 3, targetReps: 12 },
      { name: 'Tricep Pushdown', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Lower Body Focus',
    description: 'Quad and glute focused lower body workout.',
    difficulty: 'INTERMEDIATE',
    estimatedMin: 55,
    exercises: [
      { name: 'Squat', targetSets: 4, targetReps: 8 },
      { name: 'Romanian Deadlift', targetSets: 3, targetReps: 10 },
      { name: 'Leg Press', targetSets: 3, targetReps: 12 },
      { name: 'Bulgarian Split Squat', targetSets: 3, targetReps: 10 },
      { name: 'Leg Curl', targetSets: 3, targetReps: 12 },
      { name: 'Standing Calf Raise', targetSets: 4, targetReps: 15 },
    ],
  },
  {
    name: 'Strength 5x5',
    description: 'Compound lifts for strength. 5 sets of 5 reps.',
    difficulty: 'ADVANCED',
    estimatedMin: 70,
    exercises: [
      { name: 'Squat', targetSets: 5, targetReps: 5 },
      { name: 'Bench Press', targetSets: 5, targetReps: 5 },
      { name: 'Barbell Row', targetSets: 5, targetReps: 5 },
      { name: 'Overhead Press', targetSets: 5, targetReps: 5 },
      { name: 'Deadlift', targetSets: 3, targetReps: 5 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.ranking.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.gymbrosPhoto.deleteMany();
  await prisma.gymbrosSession.deleteMany();
  await prisma.workoutSet.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.routineExercise.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();

  // Seed exercises
  console.log('  Creating exercises...');
  for (const ex of PREDEFINED_EXERCISES) {
    await prisma.exercise.create({
      data: {
        name: ex.name,
        description: ex.description,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment,
        isPublic: true,
        isPredefined: true,
      },
    });
  }
  console.log(`  ✅ ${PREDEFINED_EXERCISES.length} exercises created`);

  // Get all exercises for routine seeding
  const allExercises = await prisma.exercise.findMany();

  // Seed predefined routines
  console.log('  Creating routines...');
  for (const routine of PREDEFINED_ROUTINES) {
    const created = await prisma.routine.create({
      data: {
        name: routine.name,
        description: routine.description,
        difficulty: routine.difficulty,
        estimatedMin: routine.estimatedMin,
        isPublic: true,
        isPredefined: true,
      },
    });

    for (let i = 0; i < routine.exercises.length; i++) {
      const ex = routine.exercises[i];
      const exercise = allExercises.find(
        (e) => e.name.toLowerCase() === ex.name.toLowerCase(),
      );

      if (exercise) {
        await prisma.routineExercise.create({
          data: {
            routineId: created.id,
            exerciseId: exercise.id,
            orderIndex: i,
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            restSeconds: 90,
          },
        });
      }
    }
  }
  console.log(`  ✅ ${PREDEFINED_ROUTINES.length} routines created`);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
