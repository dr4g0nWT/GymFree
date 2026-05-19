import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Searchbar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';

export default function StartWorkoutScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Start Workout
        </Text>
      </View>

      <Searchbar
        placeholder="Search routines..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="bodyLarge" style={{ opacity: 0.5 }}>
              No routines found
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.3 }}>
              Create a routine or start an empty workout
            </Text>
          </View>
        }
        renderItem={() => null}
      />

      <FAB
        icon="dumbbell"
        label="Empty Workout"
        onPress={() => router.push('/workout/active')}
        style={styles.fab}
      />
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
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  list: {
    padding: 16,
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 64,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
