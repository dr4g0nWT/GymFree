import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Searchbar, Chip, Card, useTheme, ActivityIndicator, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MUSCLE_GROUPS } from '@gymfree/shared';
import { exerciseService } from '@/services/exercise.service';
import type { Exercise } from '@gymfree/shared';

export default function ExercisesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        const result = await exerciseService.search(searchQuery, {
          page,
          muscleGroup: selectedMuscle ?? undefined,
        });
        setExercises(result.data);
        setTotalPages(result.pagination.totalPages);
      } else {
        const result = await exerciseService.list({
          page,
          muscleGroup: selectedMuscle ?? undefined,
        });
        setExercises(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedMuscle, page]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleMuscleFilter = useCallback((muscle: string) => {
    setSelectedMuscle((prev) => (prev === muscle ? null : muscle));
    setPage(1);
  }, []);

  const renderExercise = ({ item }: { item: Exercise }) => (
    <Pressable onPress={() => router.push(`/(tabs)/exercises/${item.id}`)}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <Text variant="titleMedium" style={styles.exerciseName}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                {item.muscleGroup} {item.equipment ? `• ${item.equipment}` : ''}
              </Text>
            </View>
            {item.isPredefined && (
              <Chip mode="flat" compact style={styles.predefinedChip}>
                Built-in
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Exercises
        </Text>
      </View>

      <Searchbar
        placeholder="Search exercises..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        horizontal
        data={MUSCLE_GROUPS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        renderItem={({ item }) => (
          <Chip
            selected={selectedMuscle === item}
            onPress={() => handleMuscleFilter(item)}
            style={styles.chip}
            mode="outlined"
            compact
          >
            {item}
          </Chip>
        )}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="bodyLarge" style={{ opacity: 0.5 }}>
                No exercises found
              </Text>
            </View>
          }
          renderItem={renderExercise}
          onEndReached={() => {
            if (page < totalPages) setPage((p) => p + 1);
          }}
        />
      )}

      <FAB
        icon="plus"
        label="New Exercise"
        onPress={() => router.push('/(tabs)/exercises/create')}
        style={styles.fab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  exerciseName: {
    fontWeight: '600',
  },
  predefinedChip: {
    height: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 64,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
