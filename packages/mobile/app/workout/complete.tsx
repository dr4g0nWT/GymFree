import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WorkoutCompleteScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="check-circle"
          size={80}
          color={theme.colors.primary}
        />
        <Text variant="headlineMedium" style={styles.title}>
          Workout Complete!
        </Text>
        <Text variant="bodyLarge" style={{ opacity: 0.5 }}>
          Great job! Here's your summary
        </Text>

        <Surface style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
              Duration
            </Text>
            <Text variant="titleMedium">45 min</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
              Exercises
            </Text>
            <Text variant="titleMedium">5</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
              Total Volume
            </Text>
            <Text variant="titleMedium">4,250 kg</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
              Sets
            </Text>
            <Text variant="titleMedium">15</Text>
          </View>
        </Surface>
      </View>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => router.replace('/(tabs)')}
          style={styles.button}
        >
          Done
        </Button>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.button}
          icon="share-variant"
        >
          Share
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  statsCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginTop: 32,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 4,
  },
  buttons: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
});
