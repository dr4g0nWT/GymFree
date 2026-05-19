import { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, Pressable, Modal } from 'react-native';
import { Text, IconButton, Button, TextInput, SegmentedButtons, Chip, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { workoutService } from '@/services/workout.service';
import { exerciseService } from '@/services/exercise.service';
import type { Exercise, WorkoutSet } from '@gymfree/shared';

interface WorkoutExercise {
  id: string;
  orderIndex: number;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    equipment: string | null;
  };
  sets: WorkoutSet[];
}

interface WorkoutData {
  id: string;
  routine: { id: string; name: string } | null;
  startedAt: string;
  notes: string | null;
  exercises: WorkoutExercise[];
}

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [addExerciseModal, setAddExerciseModal] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [editingSet, setEditingSet] = useState<{
    setId: string;
    weightKg: string;
    reps: string;
    rpe: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    workoutService.getWorkoutById(id).then((w) => {
      setWorkout(w as unknown as WorkoutData);
    }).catch(console.error);

    workoutService.getActiveWorkout().then((w) => {
      if (!w) router.replace('/workout/start');
    }).catch(() => router.replace('/workout/start'));
  }, [id]);

  useEffect(() => {
    if (!workout?.startedAt) return;
    const start = new Date(workout.startedAt).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [workout?.startedAt]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const h = Math.floor(m / 60);
    return h > 0
      ? `${h}:${String(m % 60).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${m}:${String(sec).padStart(2, '0')}`;
  };

  const handleAddExercise = useCallback(async (exerciseId: string) => {
    try {
      const result = await workoutService.addExercise(id!, exerciseId);
      setWorkout((prev) => prev ? {
        ...prev,
        exercises: [...prev.exercises, result as unknown as WorkoutExercise],
      } : prev);
      setAddExerciseModal(false);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const handleLogSet = useCallback(async (exerciseId: string, setNumber: number) => {
    try {
      const set = await workoutService.logSet(exerciseId, {
        setNumber,
        weightKg: 0,
        reps: 0,
        isCompleted: false,
      });
      setWorkout((prev) => prev ? {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? { ...ex, sets: [...ex.sets, set] }
            : ex
        ),
      } : prev);
      setEditingSet({
        setId: set.id,
        weightKg: '0',
        reps: '0',
        rpe: '',
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSaveSet = useCallback(async () => {
    if (!editingSet) return;
    try {
      const updated = await workoutService.updateSet(editingSet.setId, {
        weightKg: parseFloat(editingSet.weightKg) || 0,
        reps: parseInt(editingSet.reps) || 0,
        ...(editingSet.rpe ? { rpe: parseInt(editingSet.rpe) } : {}),
      });
      setWorkout((prev) => prev ? {
        ...prev,
        exercises: prev.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => s.id === updated.id ? updated : s),
        })),
      } : prev);
      setEditingSet(null);
    } catch (err) {
      console.error(err);
    }
  }, [editingSet]);

  const handleToggleComplete = useCallback(async (setId: string, current: boolean) => {
    try {
      const updated = await workoutService.updateSet(setId, {
        isCompleted: !current,
      });
      setWorkout((prev) => prev ? {
        ...prev,
        exercises: prev.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => s.id === updated.id ? updated : s),
        })),
      } : prev);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleDeleteSet = useCallback(async (setId: string) => {
    try {
      await workoutService.deleteSet(setId);
      setWorkout((prev) => prev ? {
        ...prev,
        exercises: prev.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.filter((s) => s.id !== setId),
        })),
      } : prev);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      const result = await workoutService.completeWorkout(id!);
      router.push(`/workout/complete?id=${id}`);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const openAddExercise = useCallback(async () => {
    try {
      const ex = await exerciseService.list();
      setAllExercises(ex.data);
      setAddExerciseModal(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 16 }}>Loading workout...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text variant="titleMedium">
            {workout.routine?.name ?? 'Workout'}
          </Text>
          <Text variant="headlineSmall" style={styles.timer}>
            {formatTime(elapsed)}
          </Text>
        </View>
        <Pressable onPress={handleComplete}>
          <Text variant="labelLarge" style={{ color: '#6750A4', marginRight: 16 }}>
            Finish
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: ex }) => (
          <View style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                  {ex.exercise.name}
                </Text>
                <Text variant="bodySmall" style={{ opacity: 0.4 }}>
                  {ex.exercise.muscleGroup}{ex.exercise.equipment ? ` · ${ex.exercise.equipment}` : ''}
                </Text>
              </View>
              <IconButton
                icon="plus-circle-outline"
                size={20}
                onPress={() => handleLogSet(ex.id, (ex.sets.length) + 1)}
              />
            </View>

            {ex.sets.length > 0 && (
              <View style={styles.setsHeader}>
                <Text style={styles.setCol}>SET</Text>
                <Text style={styles.setCol}>WEIGHT</Text>
                <Text style={styles.setCol}>REPS</Text>
                <Text style={styles.setCol}>RPE</Text>
                <Text style={styles.setCol}>DONE</Text>
              </View>
            )}

            {ex.sets.map((set, idx) => (
              <Pressable
                key={set.id}
                style={styles.setRow}
                onPress={() => setEditingSet({
                  setId: set.id,
                  weightKg: String(set.weightKg ?? ''),
                  reps: String(set.reps ?? ''),
                  rpe: String(set.rpe ?? ''),
                })}
              >
                <Text style={styles.setCol}>{idx + 1}</Text>
                <Text style={styles.setCol}>{set.weightKg ?? '-'}</Text>
                <Text style={styles.setCol}>{set.reps ?? '-'}</Text>
                <Text style={styles.setCol}>{set.rpe ?? '-'}</Text>
                <Pressable
                  style={[styles.checkbox, set.isCompleted && styles.checkboxDone]}
                  onPress={() => handleToggleComplete(set.id, set.isCompleted)}
                >
                  {set.isCompleted && <Text style={{ color: 'white' }}>✓</Text>}
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      />

      <FAB icon="plus" label="Add Exercise" style={styles.fab} onPress={openAddExercise} />

      <Modal visible={!!editingSet} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>Edit Set</Text>
            <TextInput
              label="Weight (kg)"
              keyboardType="numeric"
              value={editingSet?.weightKg ?? ''}
              onChangeText={(v) => setEditingSet((prev) => prev ? { ...prev, weightKg: v } : null)}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Reps"
              keyboardType="numeric"
              value={editingSet?.reps ?? ''}
              onChangeText={(v) => setEditingSet((prev) => prev ? { ...prev, reps: v } : null)}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="RPE (1-10)"
              keyboardType="numeric"
              value={editingSet?.rpe ?? ''}
              onChangeText={(v) => setEditingSet((prev) => prev ? { ...prev, rpe: v } : null)}
              mode="outlined"
              style={{ marginBottom: 20 }}
            />
            <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }}>
              <Button mode="outlined" onPress={() => setEditingSet(null)}>Cancel</Button>
              <Button mode="contained" onPress={handleSaveSet}>Save</Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={addExerciseModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalList}>
            <View style={styles.modalHeader}>
              <Text variant="titleMedium">Add Exercise</Text>
              <IconButton icon="close" onPress={() => setAddExerciseModal(false)} />
            </View>
            <FlatList
              data={allExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.exerciseItem}
                  onPress={() => handleAddExercise(item.id)}
                >
                  <Text variant="bodyMedium">{item.name}</Text>
                  <Text variant="bodySmall" style={{ opacity: 0.4 }}>
                    {item.muscleGroup}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
  timer: { fontWeight: '300', fontSize: 32, letterSpacing: 2 },
  list: { padding: 16, paddingBottom: 80 },
  exerciseCard: { marginBottom: 16, borderRadius: 12, padding: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  setsHeader: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderColor: '#eee' },
  setRow: { flexDirection: 'row', paddingVertical: 8, alignItems: 'center', borderBottomWidth: 1, borderColor: '#f5f5f5' },
  setCol: { flex: 1, fontSize: 13, textAlign: 'center' },
  checkbox: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    borderColor: '#ccc', justifyContent: 'center', alignItems: 'center',
  },
  checkboxDone: { backgroundColor: '#6750A4', borderColor: '#6750A4' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, borderRadius: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 24 },
  modal: { backgroundColor: 'white', borderRadius: 16, padding: 24 },
  modalList: { backgroundColor: 'white', borderRadius: 16, padding: 16, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exerciseItem: { padding: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
});
