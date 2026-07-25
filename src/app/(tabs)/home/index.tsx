import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useBreeds } from '@/hooks/useBreeds';
import { useFavorites } from '@/hooks/useFavorites';
import { DogCard } from '@/components/common/DogCard';
import { SearchBar } from '@/components/common/SearchBar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function HomeScreen(): React.ReactElement {
  const {
    breeds,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    loadMore,
  } = useBreeds();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleBreedPress = (breedId: number): void => {
    router.push(`/details/${breedId}`);
  };

  if (loading && breeds.length === 0) {
    return <LoadingSpinner message="Loading dog breeds..." />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Favorite Dog</Text>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        loading={loading}
      />
      
      <FlatList
        data={breeds}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <DogCard
            breed={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
            onPress={() => handleBreedPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No breeds found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingVertical: spacing.md,
    paddingTop: spacing.md,
  },
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.body.fontSize,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.h3.fontSize,
    color: colors.textLight,
  },
});