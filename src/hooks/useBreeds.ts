import { useState, useEffect, useCallback } from 'react';
import { Breed } from '@/app/types/Breed';
import DogApi from '@/app/api/DogApi';

interface UseBreedsResult {
  breeds: Breed[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useBreeds(): UseBreedsResult {
  const [allBreeds, setAllBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  const loadBreeds = useCallback(async (reset: boolean = false): Promise<void> => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }
      
      const currentPage = reset ? 0 : page;
      // Fetch exactly 20 breeds per page
      const newBreeds = await DogApi.fetchBreeds(currentPage, 20);
      
      if (newBreeds.length === 0 || newBreeds.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (newBreeds.length > 0) {
        setAllBreeds(prev => reset ? newBreeds : [...prev, ...newBreeds]);
        if (reset) {
          setPage(1); // Next page will be 1
        } else {
          setPage(prev => prev + 1);
        }
      }
      
      if (reset) {
        setInitialLoadDone(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load breeds');
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [page]);

  const refresh = useCallback(async (): Promise<void> => {
    setPage(0);
    setHasMore(true);
    setSearchQuery('');
    await loadBreeds(true);
  }, [loadBreeds]);

  const loadMore = useCallback(async (): Promise<void> => {
    // Only load more if we're not already loading and there's no search active and we have more data
    if (!loading && !loadingMore && hasMore && !searchQuery) {
      await loadBreeds(false);
    }
  }, [loading, loadingMore, hasMore, searchQuery, loadBreeds]);

  // Filter breeds based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allBreeds.filter((breed: Breed) =>
        breed.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBreeds(filtered);
    } else {
      setFilteredBreeds(allBreeds);
    }
  }, [searchQuery, allBreeds]);

  // Initial load
  useEffect(() => {
    loadBreeds(true);
  }, []);

  return {
    breeds: filteredBreeds,
    loading,
    loadingMore,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    loadMore,
    hasMore,
  };
}