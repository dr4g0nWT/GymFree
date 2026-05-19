import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Button, Card, SegmentedButtons, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { routineService } from '@/services/routine.service';
import type { Routine } from '@gymfree/shared';

export default function RoutinesScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('mine');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'predefined') {
        const result = await routineService.getPredefined();
        setRoutines(result.data);
      } else {
        const result = await routineService.list();
        setRoutines(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch routines:', error);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const renderRoutine = ({ item }: { item: Routine }) => (
    <Pressable onPress={() => router.push(`/(tabs)/routines/${item.id}`)}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.routineName}>
              {item.name}
            </Text>
            <Chip mode="flat" compact>
              {item.difficulty}
            </Chip>
          </View>
          {item.description && (
            <Text variant="bodySmall" style={{ opacity: 0.6, marginTop: 4 }} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.cardMeta}>
            <Text variant="bodySmall" style={{ opacity: 0.4 }}>
              {'_count' in item ? `${(item as Routine & { _count: { exercises: number } })._count.exercises} exercises` : `${item.exercises?.length ?? 0} exercises`}
            </Text>
            {item.estimatedMin && (
              <Text variant="bodySmall" style={{ opacity: 0.4 }}>
                ~{item.estimatedMin} min
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Routines
        </Text>
        {tab === 'mine' && (
          <Button
            mode="contained"
            icon="plus"
            onPress={() => router.push('/routines/create')}
            compact
          >
            Create
          </Button>
        )}
      </View>

      <SegmentedButtons
        value={tab}
        onValueChange={(val) => { setTab(val); }}
        buttons={[
          { value: 'mine', label: 'My Routines' },
          { value: 'predefined', label: 'Predefined' },
        ]}
        style={styles.segments}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="bodyLarge" style={{ opacity: 0.5 }}>
                {tab === 'mine'
                  ? 'No routines yet. Create your first one!'
                  : 'No predefined routines available'}
              </Text>
            </View>
          }
          renderItem={renderRoutine}
        />
      )}
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
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineName: {
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 64,
  },
});
