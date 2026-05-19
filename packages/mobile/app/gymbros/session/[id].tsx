import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, Avatar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function GymbrosSessionScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="titleMedium">GymBros Session</Text>
        <Text variant="bodySmall" style={{ opacity: 0.5 }}>
          Training together
        </Text>
      </Surface>

      {/* Partner Status */}
      <View style={styles.partners}>
        <Surface style={styles.partnerCard}>
          <Avatar.Icon size={48} icon="account" />
          <Text variant="labelLarge" style={styles.partnerName}>
            You
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
            Active
          </Text>
        </Surface>

        <Text variant="headlineSmall" style={{ opacity: 0.3 }}>
          +
        </Text>

        <Surface style={styles.partnerCard}>
          <Avatar.Icon size={48} icon="account" />
          <Text variant="labelLarge" style={styles.partnerName}>
            Partner
          </Text>
          <Text variant="bodySmall" style={{ opacity: 0.5 }}>
            Waiting...
          </Text>
        </Surface>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="camera"
          onPress={() => {}}
          style={styles.actionButton}
        >
          Take Verification Photo
        </Button>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.actionButton}
        >
          End Session
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 2,
  },
  partners: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 48,
  },
  partnerCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    minWidth: 120,
  },
  partnerName: {
    marginTop: 8,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
});
