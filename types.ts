export interface PlaceResult {
  id: string; // Google Place ID
  name: string;
  type: string; // Restaurant or Hotel
  phone: string;
  address: string;
}

export enum SearchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface SearchFilters {
  onlyLebanon: boolean;
  type: 'all' | 'restaurant' | 'hotel';
}