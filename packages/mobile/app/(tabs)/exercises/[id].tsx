import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip, ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { exerciseService } from '@/services/exercise.service';
import type { Exercise } from '@gymfree/shared';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    exerciseService
      .getById(id)
      .then(setExercise)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" />
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Exercise not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Button
          mode="text"
          icon="arrow-left"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Back
        </Button>

        <Surface style={styles.headerCard}>
          <Text variant="headlineSmall" style={styles.name}>
            {exercise.name}
          </Text>
          <Text variant="bodyLarge" style={{ opacity: 0.6 }}>
            {exercise.muscleGroup}
          </Text>
        </Surface>

        <Surface style={styles.infoCard}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Instructions
          </Text>
          <Text variant="bodyMedium" style={{ lineHeight: 22 }}>
            {exercise.description ?? 'No description available.'}
          </Text>
        </Surface>

        <Surface style={styles.infoCard}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Details
          </Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="arm-flex" size={20} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={styles.detailText}>
              Muscle Group: {exercise.muscleGroup}
            </Text>
          </View>
          {exercise.equipment && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="weight-lifter" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.detailText}>
                Equipment: {exercise.equipment}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name={exercise.isPredefined ? 'lock' : 'account'}
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.detailText}>
              {exercise.isPredefined ? 'Built-in exercise' : `Created by ${exercise.createdBy?.username ?? 'Unknown'}`}
            </Text>
          </View>
        </Surface>

        {exercise.createdBy && (
          <Chip
            icon="account"
            mode="outlined"
            style={styles.creatorChip}
          >
            Created by {exercise.createdBy.username}
          </Chip>
        )}
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
  backButton: {
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
    marginBottom: 4,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 12,
  },
  creatorChip: {
    alignSelf: 'center',
  },
});
