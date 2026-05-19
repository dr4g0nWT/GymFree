import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Surface, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { workoutService } from '@/services/workout.service';

export default function HomeScreen() {
  const theme = useTheme();
  const [activeWorkout, setActiveWorkout] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workoutService.getActiveWorkout()
      .then((w) => { if (w) setActiveWorkout(w); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineSmall" style={styles.greeting}>
          {activeWorkout ? 'Resume your workout' : 'Ready to train?'}
        </Text>

        {loading ? (
          <ActivityIndicator style={{ marginBottom: 24 }} />
        ) : activeWorkout ? (
          <Button
            mode="contained"
            icon={() => <MaterialCommunityIcons name="play-circle" size={24} color="white" />}
            onPress={() => router.push(`/workout/active?id=${activeWorkout.id}`)}
            style={styles.startButton}
            contentStyle={styles.startButtonContent}
          >
            Resume Workout
          </Button>
        ) : (
          <Button
            mode="contained"
            icon={() => <MaterialCommunityIcons name="play-circle" size={24} color="white" />}
            onPress={() => router.push('/workout/start')}
            style={styles.startButton}
            contentStyle={styles.startButtonContent}
          >
            Start Workout
          </Button>
        )}

        <Surface style={styles.statsCard}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            This Week
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="headlineSmall">0</Text>
              <Text variant="bodySmall">Workouts</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineSmall">0 kg</Text>
              <Text variant="bodySmall">Volume</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineSmall">0 min</Text>
              <Text variant="bodySmall">Duration</Text>
            </View>
          </View>
        </Surface>

        <Card style={styles.quickActions}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.actionRow}>
              <Button
                mode="outlined"
                onPress={() => router.push('/(tabs)/exercises')}
                style={styles.action}
              >
                Browse Exercises
              </Button>
              <Button
                mode="outlined"
                onPress={() => router.push('/(tabs)/routines')}
                style={styles.action}
              >
                View Routines
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.gymbrosCard}>
          <Card.Content>
            <View style={styles.gymbrosHeader}>
              <MaterialCommunityIcons
                name="account-group"
                size={32}
                color={theme.colors.primary}
              />
              <View style={styles.gymbrosText}>
                <Text variant="titleMedium">GymBros</Text>
                <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                  Train together and earn bonus points
                </Text>
              </View>
            </View>
            <Button
              mode="contained-tonal"
              onPress={() => router.push('/gymbros')}
              style={styles.gymbrosButton}
            >
              Create Session
            </Button>
          </Card.Content>
        </Card>
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
  greeting: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  startButton: {
    marginBottom: 24,
    borderRadius: 12,
  },
  startButtonContent: {
    paddingVertical: 8,
  },
  statsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  quickActions: {
    marginBottom: 16,
    borderRadius: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    flex: 1,
  },
  gymbrosCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  gymbrosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gymbrosText: {
    marginLeft: 12,
    flex: 1,
  },
  gymbrosButton: {
    borderRadius: 8,
  },
});
