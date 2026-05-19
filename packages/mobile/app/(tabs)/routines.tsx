import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

export default function RoutinesScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState('mine');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Routines
        </Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push('/(tabs)/routines/create')}
        >
          Create
        </Button>
      </View>

      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'mine', label: 'My Routines' },
          { value: 'predefined', label: 'Predefined' },
        ]}
        style={styles.segments}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyLarge" style={{ opacity: 0.5, textAlign: 'center' }}>
              No routines yet. Create your first one!
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  card: {
    borderRadius: 16,
    padding: 32,
  },
});
