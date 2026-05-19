import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip, Button, ActivityIndicator, List, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { routineService } from '@/services/routine.service';
import type { Routine } from '@gymfree/shared';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    routineService
      .getById(id)
      .then(setRoutine)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleClone = async () => {
    if (!routine) return;
    try {
      await routineService.clone(routine.id);
      router.back();
    } catch (error) {
      console.error('Failed to clone routine:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" />
      </SafeAreaView>
    );
  }

  if (!routine) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Routine not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Button mode="text" icon="arrow-left" onPress={() => router.back()} style={styles.back}>
          Back
        </Button>

        <Surface style={styles.headerCard}>
          <Text variant="headlineSmall" style={styles.name}>
            {routine.name}
          </Text>
          {routine.description && (
            <Text variant="bodyMedium" style={{ opacity: 0.6, marginTop: 8 }}>
              {routine.description}
            </Text>
          )}
          <View style={styles.metaRow}>
            <Chip mode="flat" compact>{routine.difficulty}</Chip>
            {routine.estimatedMin && (
              <Text variant="bodySmall" style={{ opacity: 0.5 }}>
                ~{routine.estimatedMin} min
              </Text>
            )}
            <Text variant="bodySmall" style={{ opacity: 0.5 }}>
              {routine.exercises?.length ?? 0} exercises
            </Text>
          </View>
        </Surface>

        <Text variant="titleMedium" style={styles.exercisesTitle}>
          Exercises
        </Text>

        {routine.exercises?.map((re, index) => (
          <Surface key={re.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseOrder}>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text variant="titleSmall" style={styles.exerciseName}>
                  {re.exercise.name}
                </Text>
                <Text variant="bodySmall" style={{ opacity: 0.5 }}>
                  {re.targetSets} sets × {re.targetReps ?? '?'} reps
                  {re.restSeconds > 0 ? ` • ${re.restSeconds}s rest` : ''}
                </Text>
              </View>
            </View>
          </Surface>
        ))}

        <View style={styles.actions}>
          {routine.isPredefined && (
            <Button mode="contained" icon="content-copy" onPress={handleClone} style={styles.action}>
              Clone to My Routines
            </Button>
          )}
          <Button
            mode="contained-tonal"
            icon="play-circle"
            onPress={() => router.push(`/workout/start?routineId=${routine.id}`)}
            style={styles.action}
          >
            Start Workout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  scroll: {
    padding: 16,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headerCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  exercisesTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseOrder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(103, 80, 164, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontWeight: '600',
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  action: {
    borderRadius: 8,
  },
});
