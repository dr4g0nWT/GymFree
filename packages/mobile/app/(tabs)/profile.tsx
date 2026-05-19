import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, Surface, List, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import type { User } from '@gymfree/shared';

export default function ProfileScreen() {
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getMe()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    workoutsCount: 0,
    currentStreak: 0,
    totalPoints: profile?.totalPoints ?? 0,
    followersCount: 0,
    followingCount: 0,
  };

  const handleLogout = () => {
    clearTokens();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Surface style={styles.profileHeader}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          <Text variant="headlineSmall" style={styles.username}>
            {profile?.username ?? 'GymFree User'}
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
            {profile?.experience ?? 'BEGINNER'}
          </Text>
          {profile?.bio && (
            <Text variant="bodySmall" style={{ opacity: 0.6, marginTop: 8, textAlign: 'center' }}>
              {profile.bio}
            </Text>
          )}
        </Surface>

        <Surface style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="titleLarge">{stats.workoutsCount}</Text>
              <Text variant="bodySmall">Workouts</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleLarge">{stats.currentStreak}</Text>
              <Text variant="bodySmall">Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleLarge">{stats.totalPoints}</Text>
              <Text variant="bodySmall">Points</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="titleLarge">{stats.followersCount}</Text>
              <Text variant="bodySmall">Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleLarge">{stats.followingCount}</Text>
              <Text variant="bodySmall">Following</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.menuCard}>
          <List.Item
            title="Workout History"
            left={(props) => <List.Icon {...props} icon="history" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Statistics"
            left={(props) => <List.Icon {...props} icon="chart-bar" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Achievements"
            left={(props) => <List.Icon {...props} icon="trophy" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            onPress={() => {}}
          />
        </Surface>

        <Button
          mode="outlined"
          onPress={handleLogout}
          textColor="#B3261E"
          style={styles.logoutButton}
        >
          Logout
        </Button>
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
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    marginBottom: 12,
  },
  username: {
    fontWeight: 'bold',
  },
  statsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  stat: {
    alignItems: 'center',
  },
  menuCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 8,
  },
});
