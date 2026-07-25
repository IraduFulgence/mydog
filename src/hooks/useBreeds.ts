import DogApi from '@/app/api/DogApi';
import { Breed } from '@/app/types/Breed';
import { useCallback, useEffect, useState } from 'react';

interface UseBreedsResult {
  breeds: Breed[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useBreeds(): UseBreedsResult {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadBreeds = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useBreeds] Loading breeds...', { reset, page, currentPage: reset ? 0 : page });
      
      const currentPage = reset ? 0 : page;
      const newBreeds = await DogApi.fetchBreeds(currentPage, 20);
      
      console.log('[useBreeds] Breeds loaded successfully:', newBreeds.length);
      
      if (newBreeds.length === 0) {
        setHasMore(false);
      } else {
        setBreeds(prev => reset ? newBreeds : [...prev, ...newBreeds]);
        setPage(currentPage + 1);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load breeds';
      console.error('[useBreeds] Error loading breeds:', { error: err, errorMsg });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const refresh = useCallback(async () => {
    setPage(0);
    setHasMore(true);
    await loadBreeds(true);
  }, [loadBreeds]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await loadBreeds();
    }
  }, [loading, hasMore, loadBreeds]);

  // Filter breeds on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = breeds.filter(breed =>
        breed.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBreeds(filtered);
    } else {
      setFilteredBreeds(breeds);
    }
  }, [searchQuery, breeds]);

  useEffect(() => {
    loadBreeds(true);
  }, []);

  return {
    breeds: filteredBreeds,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    loadMore,
  };
}