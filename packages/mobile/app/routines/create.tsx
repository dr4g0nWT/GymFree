import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, Chip, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DIFFICULTY } from '@gymfree/shared';

export default function CreateRoutineScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('BEGINNER');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineSmall" style={styles.title}>
          Create Routine
        </Text>

        <TextInput
          label="Routine Name"
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
          numberOfLines={3}
          style={styles.input}
        />

        <Text variant="labelLarge" style={styles.label}>
          Difficulty
        </Text>
        <SegmentedButtons
          value={difficulty}
          onValueChange={setDifficulty}
          buttons={DIFFICULTY.map((d) => ({
            value: d,
            label: d.charAt(0) + d.slice(1).toLowerCase(),
          }))}
          style={styles.segments}
        />

        {/* TODO: Exercise list with drag & drop */}

        <Surface style={styles.emptyExercises}>
          <Text variant="bodyLarge" style={{ opacity: 0.5, textAlign: 'center' }}>
            No exercises added yet
          </Text>
          <Button
            mode="outlined"
            icon="plus"
            style={styles.addExerciseButton}
          >
            Add Exercise
          </Button>
        </Surface>

        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.saveButton}
          disabled={!name}
        >
          Save Routine
        </Button>
      </ScrollView>
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
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  segments: {
    marginBottom: 24,
  },
  emptyExercises: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  addExerciseButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  saveButton: {
    borderRadius: 8,
    marginBottom: 32,
  },
});
