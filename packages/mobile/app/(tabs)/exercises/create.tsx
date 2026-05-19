import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, Chip, SegmentedButtons, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MUSCLE_GROUPS, EQUIPMENT } from '@gymfree/shared';
import { exerciseService } from '@/services/exercise.service';

export default function CreateExerciseScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Exercise name is required');
      setShowError(true);
      return;
    }
    if (!muscleGroup) {
      setError('Please select a muscle group');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      await exerciseService.create({
        name: name.trim(),
        description: description.trim() || undefined,
        muscleGroup,
        equipment: equipment ?? undefined,
        isPublic,
      });
      router.back();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create exercise';
      setError(message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Button mode="text" icon="arrow-left" onPress={() => router.back()} style={styles.back}>
          Back
        </Button>

        <Text variant="headlineSmall" style={styles.title}>
          Create Exercise
        </Text>

        <TextInput
          label="Exercise Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text variant="labelLarge" style={styles.label}>
          Muscle Group
        </Text>
        <View style={styles.chipGroup}>
          {MUSCLE_GROUPS.map((mg) => (
            <Chip
              key={mg}
              selected={muscleGroup === mg}
              onPress={() => setMuscleGroup(mg)}
              mode="outlined"
              style={styles.chip}
              compact
            >
              {mg}
            </Chip>
          ))}
        </View>

        <Text variant="labelLarge" style={styles.label}>
          Equipment (optional)
        </Text>
        <View style={styles.chipGroup}>
          {EQUIPMENT.map((eq) => (
            <Chip
              key={eq}
              selected={equipment === eq}
              onPress={() => setEquipment(eq)}
              mode="outlined"
              style={styles.chip}
              compact
            >
              {eq}
            </Chip>
          ))}
        </View>

        <Text variant="labelLarge" style={styles.label}>
          Visibility
        </Text>
        <SegmentedButtons
          value={isPublic ? 'public' : 'private'}
          onValueChange={(val) => setIsPublic(val === 'public')}
          buttons={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
          style={styles.segments}
        />

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          disabled={loading || !name || !muscleGroup}
          style={styles.createButton}
        >
          Create Exercise
        </Button>
      </ScrollView>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setShowError(false) }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 4,
  },
  segments: {
    marginBottom: 24,
  },
  createButton: {
    borderRadius: 8,
    marginBottom: 32,
  },
});
