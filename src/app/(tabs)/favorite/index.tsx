import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useFavorites } from '@/hooks/useFavorites';
import { DogCard } from '@/components/common/DogCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function FavoritesScreen(): React.ReactElement {
  const { favorites, loading, toggleFavorite, isFavorite } = useFavorites();

  const handleBreedPress = (breedId: number): void => {
    router.push(`/details/${breedId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>❤️</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Start exploring dog breeds and save your favorites!
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.exploreButtonText}>Explore Breeds</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          ❤️ Your Favorites ({favorites.length})
        </Text>
      </View>
      <FlatList
        data={favorites}
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
    fontSize: typography.h3.fontSize,
    fontWeight: '600' as const,
    color: colors.text,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: colors.surface,
    fontSize: typography.button.fontSize,
    fontWeight: '600' as const,
  },
});