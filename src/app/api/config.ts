

export const ENDPOINTS = {
  BREEDS: '/breeds',
  BREEDS_SEARCH: '/breeds/search',
  IMAGES_SEARCH: '/images/search',
  IMAGES: '/images',
} as const;

export const API_CONFIG = {
  timeout: 15000,
  defaultParams: {
    limit: 100,
    has_breeds: true,
    order: 'RANDOM',
  },
} as const;