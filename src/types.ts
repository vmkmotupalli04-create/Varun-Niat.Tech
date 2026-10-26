export type CategoryId =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'grocery'
  | 'pharmacy'
  | 'convenience'
  | 'gas'
  | 'gym'
  | 'bakery'
  | 'hardware'
  | 'bookstore'
  | 'salon'
  | 'canteen';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
}

export interface HoursEntry {
  open: number;
  close: number;
}

export type WeeklyHours = HoursEntry[];

export interface Shop {
  id: string;
  name: string;
  category: CategoryId;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  hours: WeeklyHours;
  custom?: boolean;
}

export interface Coords {
  lat: number;
  lng: number;
  label: string;
}

export type SortMode = 'distance' | 'nearest-open' | 'name' | 'rating' | 'closing';
export type StatusFilter = 'all' | 'open' | 'closed';
