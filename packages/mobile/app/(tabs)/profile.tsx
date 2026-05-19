import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, Surface, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfileScreen() {
  const clearTokens = useAuthStore((s) => s.clearTokens);

  const handleLogout = () => {
    clearTokens();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Surface style={styles.profileHeader}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          <Text variant="headlineSmall" style={styles.username}>
            GymFree User
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
            BEGINNER
          </Text>
        </Surface>

        <Surface style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="titleLarge">0</Text>
              <Text variant="bodySmall">Workouts</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleLarge">0</Text>
              <Text variant="bodySmall">Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleLarge">0 kg</Text>
              <Text variant="bodySmall">Volume</Text>
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
