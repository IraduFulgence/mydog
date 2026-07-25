import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Breed } from '@/app/types/Breed';
import { FAVORITES_KEY } from '@/utils/constants';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Breed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFavorites = useCallback(async (newFavorites: Breed[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, []);

  const toggleFavorite = useCallback((breed: Breed) => {
    const exists = favorites.some(fav => fav.id === breed.id);
    const newFavorites = exists
      ? favorites.filter(fav => fav.id !== breed.id)
      : [...favorites, breed];
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((breedId: number) => {
    return favorites.some(fav => fav.id === breedId);
  }, [favorites]);

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
}