import { Breed } from "@/app/types/Breed";

export const getBreedWeight = (breed: Breed): string => {
  if (!breed.weight?.metric) return 'N/A';
  return `${breed.weight.metric} kg`;
};

export const getBreedHeight = (breed: Breed): string => {
  if (!breed.height?.metric) return 'N/A';
  return `${breed.height.metric} cm`;
};

export const getBreedLifeSpan = (breed: Breed): string => {
  return breed.life_span || 'N/A';
};

export const formatTemperament = (temperament: string): string[] => {
  return temperament.split(',').map(t => t.trim());
};

export const getFirstTemperament = (temperament: string): string => {
  const traits = formatTemperament(temperament);
  return traits.length > 0 ? traits[0] : '';
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};