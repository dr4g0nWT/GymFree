import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Icon, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { workoutService } from '@/services/workout.service';

interface CompleteResult {
  summary: {
    durationMin: number;
    totalVolume: number;
    totalSets: number;
    completedSets: number;
    totalPoints: number;
    newPRs: number;
  };
}

export default function WorkoutCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    workoutService.completeWorkout(id)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 16 }}>Failed to load workout summary</Text>
      </SafeAreaView>
    );
  }

  const { summary } = result;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Workout Complete!</Text>

        <View style={styles.pointsBadge}>
          <Text variant="displaySmall" style={styles.pointsText}>
            +{summary.totalPoints}
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.6 }}>points earned</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Icon source="clock-outline" size={28} color="#6750A4" />
            <Text variant="titleLarge">{summary.durationMin}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statBox}>
            <Icon source="weight-lifter" size={28} color="#6750A4" />
            <Text variant="titleLarge">
              {summary.totalVolume > 1000
                ? `${(summary.totalVolume / 1000).toFixed(1)}k`
                : summary.totalVolume}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Volume (kg)</Text>
          </View>
          <View style={styles.statBox}>
            <Icon source="checkbox-marked-circle-outline" size={28} color="#6750A4" />
            <Text variant="titleLarge">{summary.completedSets}/{summary.totalSets}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statBox}>
            <Icon source="trophy-outline" size={28} color="#6750A4" />
            <Text variant="titleLarge">{summary.newPRs}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>New PRs</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="dumbbell"
            onPress={() => router.push('/workout/start')}
            style={styles.actionBtn}
            contentStyle={{ paddingVertical: 8 }}
          >
            Start New Workout
          </Button>
          <Button
            mode="outlined"
            icon="history"
            onPress={() => router.push('/')}
            style={styles.actionBtn}
            contentStyle={{ paddingVertical: 8 }}
          >
            Back to Home
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { alignItems: 'center', padding: 24 },
  title: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  pointsBadge: { alignItems: 'center', marginVertical: 24 },
  pointsText: { fontWeight: 'bold', color: '#6750A4' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16,
    justifyContent: 'center', marginVertical: 16,
  },
  statBox: { alignItems: 'center', width: '45%', padding: 16 },
  statLabel: { opacity: 0.5, marginTop: 4 },
  actions: { width: '100%', gap: 12, marginTop: 24 },
  actionBtn: { borderRadius: 12 },
});
