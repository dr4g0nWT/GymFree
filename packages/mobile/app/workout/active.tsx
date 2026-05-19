import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, ProgressBar, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ActiveWorkoutScreen() {
  const theme = useTheme();
  const [elapsed, setElapsed] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      if (isResting && restTime > 0) {
        setRestTime((r) => Math.max(0, r - 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleRest = () => {
    setIsResting(true);
    setRestTime(90);
  };

  const handleEnd = () => {
    router.replace('/workout/complete');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <View style={styles.headerRow}>
          <IconButton icon="close" onPress={handleEnd} />
          <Text variant="titleMedium">{formatTime(elapsed)}</Text>
          <IconButton icon="check" onPress={handleEnd} />
        </View>
        <ProgressBar progress={0.3} color={theme.colors.primary} />
      </Surface>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Current Exercise */}
        <Surface style={styles.exerciseCard}>
          <Text variant="titleLarge" style={styles.exerciseName}>
            Bench Press
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
            Set 1 of 3 • 90s rest
          </Text>

          {/* Set Input */}
          <View style={styles.setInputRow}>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium">Weight (kg)</Text>
              <Surface style={styles.inputBox}>
                <Text variant="headlineMedium">0</Text>
              </Surface>
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium">Reps</Text>
              <Surface style={styles.inputBox}>
                <Text variant="headlineMedium">0</Text>
              </Surface>
            </View>
          </View>

          <Button mode="contained" onPress={handleRest} style={styles.completeSet}>
            Complete Set
          </Button>

          {/* Previous sets */}
          <View style={styles.prevSets}>
            <Text variant="labelSmall" style={{ opacity: 0.5 }}>Previous sets</Text>
            {/* TODO: list previous sets */}
          </View>
        </Surface>

        {/* Next Exercises */}
        <Text variant="titleSmall" style={styles.upcomingTitle}>
          Upcoming
        </Text>
        <Surface style={styles.upcomingCard}>
          <Text variant="bodyMedium">Incline Dumbbell Press</Text>
        </Surface>
        <Surface style={styles.upcomingCard}>
          <Text variant="bodyMedium">Cable Flyes</Text>
        </Surface>
      </ScrollView>

      {/* Rest Timer Overlay */}
      {isResting && restTime > 0 && (
        <Surface style={styles.restOverlay}>
          <Text variant="labelMedium">Rest</Text>
          <Text variant="displaySmall">{formatTime(restTime)}</Text>
          <Button mode="text" onPress={() => setIsResting(false)}>
            Skip
          </Button>
        </Surface>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scroll: {
    padding: 16,
  },
  exerciseCard: {
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  exerciseName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  setInputRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: 120,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  completeSet: {
    borderRadius: 8,
    marginTop: 8,
  },
  prevSets: {
    marginTop: 16,
  },
  upcomingTitle: {
    marginBottom: 8,
    opacity: 0.5,
  },
  upcomingCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
  restOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
