import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GymbrosLobbyScreen() {
  const theme = useTheme();
  const [inviteCode, setInviteCode] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          GymBros
        </Text>
        <Text variant="bodyMedium" style={{ opacity: 0.5 }}>
          Train together and earn bonus points
        </Text>
      </View>

      <Surface style={styles.createCard}>
        <MaterialCommunityIcons
          name="account-plus"
          size={48}
          color={theme.colors.primary}
        />
        <Text variant="titleMedium" style={styles.cardTitle}>
          Create a Session
        </Text>
        <Text variant="bodyMedium" style={{ opacity: 0.5, marginBottom: 16 }}>
          Invite a friend to train together
        </Text>
        <TextInput
          label="Friend's username"
          value={inviteCode}
          onChangeText={setInviteCode}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={() => router.push('/gymbros/session/1')}
          disabled={!inviteCode}
        >
          Invite
        </Button>
      </Surface>

      <Surface style={styles.joinCard}>
        <MaterialCommunityIcons
          name="login"
          size={48}
          color={theme.colors.secondary}
        />
        <Text variant="titleMedium" style={styles.cardTitle}>
          Join a Session
        </Text>
        <Text variant="bodyMedium" style={{ opacity: 0.5, marginBottom: 16 }}>
          Enter the invite code from your friend
        </Text>
        <TextInput
          label="Invite code"
          value={inviteCode}
          onChangeText={setInviteCode}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained-tonal"
          onPress={() => router.push('/gymbros/session/1')}
          disabled={!inviteCode}
        >
          Join
        </Button>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  createCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  joinCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
});
