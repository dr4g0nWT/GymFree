import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Card, Searchbar, ActivityIndicator, FAB, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { workoutService } from '@/services/workout.service';
import { routineService } from '@/services/routine.service';
import type { Routine } from '@gymfree/shared';

export default function StartWorkoutScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState<{ id: string } | null>(null);

  useEffect(() => {
    Promise.all([
      routineService.list(),
      workoutService.getActiveWorkout(),
    ]).then(([routinesResult, active]) => {
      setRoutines(routinesResult.data);
      if (active) setActiveWorkout(active);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = routines.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStartEmpty = useCallback(async () => {
    try {
      const workout = await workoutService.startWorkout();
      router.push(`/workout/active?id=${workout.id}`);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleStartRoutine = useCallback(async (routineId: string) => {
    try {
      const workout = await workoutService.startWorkout(routineId);
      router.push(`/workout/active?id=${workout.id}`);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleResume = useCallback(() => {
    if (activeWorkout) {
      router.push(`/workout/active?id=${activeWorkout.id}`);
    }
  }, [activeWorkout]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Start Workout
        </Text>
      </View>

      {activeWorkout && (
        <Card style={styles.resumeCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium">Active workout in progress</Text>
            <Text variant="bodySmall" style={{ opacity: 0.6 }}>Tap to resume</Text>
          </Card.Content>
          <Card.Actions>
            <Pressable onPress={handleResume}>
              <Text variant="labelLarge" style={{ color: '#6750A4' }}>Resume</Text>
            </Pressable>
          </Card.Actions>
        </Card>
      )}

      <Searchbar
        placeholder="Search routines..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="bodyLarge" style={{ opacity: 0.5 }}>
                {searchQuery ? 'No routines found' : 'No routines yet'}
              </Text>
              <Text variant="bodyMedium" style={{ opacity: 0.3, marginTop: 4 }}>
                Create a routine or start an empty workout
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => handleStartRoutine(item.id)}>
              <Card style={styles.card} mode="elevated">
                <Card.Content>
                  <View style={styles.cardRow}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={styles.routineName}>
                        {item.name}
                      </Text>
                      {item.description && (
                        <Text variant="bodySmall" style={{ opacity: 0.5 }} numberOfLines={1}>
                          {item.description}
                        </Text>
                      )}
                      <View style={styles.cardMeta}>
                        <Chip mode="flat" compact>{item.difficulty}</Chip>
                        {item.estimatedMin && (
                          <Text variant="bodySmall" style={{ opacity: 0.4 }}>
                            ~{item.estimatedMin}min
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Pressable>
          )}
        />
      )}

      <FAB
        icon="dumbbell"
        label="Empty Workout"
        onPress={handleStartEmpty}
        style={styles.fab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  title: { fontWeight: 'bold' },
  resumeCard: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12 },
  searchbar: { marginHorizontal: 16, marginBottom: 12 },
  list: { padding: 16, paddingBottom: 80 },
  card: { marginBottom: 8, borderRadius: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  routineName: { fontWeight: '600' },
  cardMeta: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' },
  loader: { flex: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 64 },
  fab: {
    position: 'absolute', margin: 16, right: 0, bottom: 0, borderRadius: 16,
  },
});
