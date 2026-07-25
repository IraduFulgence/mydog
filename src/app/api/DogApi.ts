import axios, { AxiosError, AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import { ENDPOINTS } from './config';

import { ApiError, Breed, DogImage } from '../types/Breed';

const Base_url = Constants.expoConfig?.extra?.API_BASE_URL;
const Api_key = Constants.expoConfig?.extra?.API_KEY;

console.log('[DogApi] Environment:', {
  baseUrl: Base_url,
  hasApiKey: !!Api_key,
});

class DogApiService {
  private api: AxiosInstance;
    // global constructor of my API
  constructor() {
    this.api = axios.create({
      baseURL: Base_url,
      headers: {
        'x-api-key': Api_key,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        console.log('[DogApi] Request:', {
          url: config.url,
          params: config.params,
          timestamp: new Date().toISOString(),
        });
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('[DogApi] Response Success:', {
          url: response.config.url,
          status: response.status,
          dataLength: Array.isArray(response.data) ? response.data.length : 'single',
        });
        return response;
      },
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status || 500,
          code: error.code,
        };
        console.error('[DogApi] Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        return Promise.reject(apiError);
      }
    );
  }

//   getting all breeds by listing 50 breeds per page
  async fetchBreeds(page: number = 0, limit: number = 50): Promise<Breed[]> {
    const response = await this.api.get<Breed[]>(ENDPOINTS.BREEDS, {
      params: { page, limit },
    });
    return response.data;
  }

  async searchBreeds(query: string): Promise<Breed[]> {
    if (!query.trim()) return [];
    const response = await this.api.get<Breed[]>(ENDPOINTS.BREEDS_SEARCH, {
      params: { q: query.trim() },
    });
    return response.data;
  }

  async fetchBreedImages(
    breedId: number,
    limit: number = 10
  ): Promise<DogImage[]> {
    const response = await this.api.get<DogImage[]>(ENDPOINTS.IMAGES_SEARCH, {
      params: {
        breed_id: breedId,
        limit,
        size: 'med',
        mime_types: 'jpg,png',
      },
    });
    return response.data;
  }

  async fetchRandomDogs(limit: number = 10): Promise<DogImage[]> {
    const response = await this.api.get<DogImage[]>(ENDPOINTS.IMAGES_SEARCH, {
      params: {
        limit,
        has_breeds: true,
        order: 'RANDOM',
        size: 'med',
      },
    });
    return response.data;
  }

  async fetchBreedsByIds(ids: number[]): Promise<Breed[]> {
    if (!ids.length) return [];
    
    const promises = ids.map(id => 
      this.api.get<Breed>(`${ENDPOINTS.BREEDS}/${id}`)
    );
    
    const responses = await Promise.all(promises);
    return responses.map(res => res.data);
  }
}

export default new DogApiService();