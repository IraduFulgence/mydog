export interface Breed {
  id: number;
  name: string;
  temperament?: string;
  life_span?: string;
  weight: {
    metric: string;
    imperial: string;
  };
  height?: {
    metric: string;
    imperial: string;
  };
  bred_for?: string;
  breed_group?: string;
  origin?: string;
  reference_image_id?: string;
  reference_image?: string;
  description?: string;
  image?: DogImage;
}
export interface DogImage {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Breed[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Details: { breed: Breed };
};
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}