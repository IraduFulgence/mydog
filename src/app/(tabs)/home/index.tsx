import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import { useBreeds } from '@/hooks/useBreeds';
import { useFavorites } from '@/hooks/useFavorites';
import { useDebounce } from '@/hooks/useDebounce';
import { DogCard } from '@/components/common/DogCard';
import { SearchBar } from '@/components/common/SearchBar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LoadingMore } from '@/components/common/ViewMore';
import { Breed } from '@/app/types/Breed';

export default function HomeScreen() {
  const {
    breeds,
    loading,
    loadingMore,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    loadMore,
    hasMore,
  } = useBreeds();
  
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Debouncing to prevent excessive filtering
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleBreedPress = (breedId: number): void => {
    router.push(`/details/${breedId}`);
  };

  const handleClearSearch = (): void => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  // Filter breeds based on debounced search
  const filteredBreeds = breeds.filter((breed: Breed) =>
    breed.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Show loading state
  if (loading && breeds.length === 0) {
    return <LoadingSpinner message="Loading dog breeds..." />;
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableWithoutFeedback onPress={refresh}>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}></Text>
          <Text style={styles.headerSubtitle}>
            {filteredBreeds.length} breeds available
          </Text>
        </View>
        
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dog breeds by name..."
          loading={loading}
          onClear={handleClearSearch}
        />
        
        <FlatList
          data={filteredBreeds}
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
            <RefreshControl 
              refreshing={loading} 
              onRefresh={refresh}
              colors={['#c48450']}
              tintColor="#c48450"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <LoadingMore loading={loadingMore} hasMore={hasMore} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}></Text>
              <Text style={styles.emptyTitle}>No breeds found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later'}
              </Text>
              {searchQuery && (
                <TouchableWithoutFeedback onPress={handleClearSearch}>
                  <Text style={styles.clearSearchText}>Clear search</Text>
                </TouchableWithoutFeedback>
              )}
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f0',
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 8,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  listContent: {
    paddingBottom: 32,
    paddingTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f4f0',
    padding: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
  },
  retryText: {
    color: '#c48450',
    fontSize: 16,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  clearSearchText: {
    fontSize: 16,
    color: '#c48450',
    marginTop: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});