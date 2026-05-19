import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, useTheme, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SocialScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState('leaderboard');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Social
        </Text>
      </View>

      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'leaderboard', label: 'Leaderboard' },
          { value: 'following', label: 'Following' },
        ]}
        style={styles.segments}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Surface style={styles.emptyState}>
          <MaterialCommunityIcons
            name="trophy"
            size={64}
            color={theme.colors.primary}
            style={{ opacity: 0.3 }}
          />
          <Text variant="bodyLarge" style={{ opacity: 0.5, marginTop: 16 }}>
            Leaderboard coming soon
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.3, marginTop: 4 }}>
            Complete workouts to earn points and climb the ranks
          </Text>
        </Surface>
      </ScrollView>
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
  segments: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scroll: {
    padding: 16,
  },
  emptyState: {
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    elevation: 2,
  },
});
