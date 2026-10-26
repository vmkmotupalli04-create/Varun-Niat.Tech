import type { Category, CategoryId } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'restaurant', name: 'Restaurants', icon: 'Utensils', color: '#ef4444' },
  { id: 'cafe', name: 'Cafés', icon: 'Coffee', color: '#b45309' },
  { id: 'bar', name: 'Bars', icon: 'Wine', color: '#a855f7' },
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingCart', color: '#22c55e' },
  { id: 'pharmacy', name: 'Pharmacy', icon: 'Pill', color: '#0ea5e9' },
  { id: 'convenience', name: 'Convenience', icon: 'ShoppingBag', color: '#14b8a6' },
  { id: 'gas', name: 'Gas', icon: 'Fuel', color: '#f97316' },
  { id: 'gym', name: 'Gyms', icon: 'Dumbbell', color: '#6366f1' },
  { id: 'bakery', name: 'Bakeries', icon: 'Cookie', color: '#d97706' },
  { id: 'hardware', name: 'Hardware', icon: 'Wrench', color: '#78716c' },
  { id: 'bookstore', name: 'Bookstores', icon: 'BookOpen', color: '#0891b2' },
  { id: 'salon', name: 'Salons', icon: 'Scissors', color: '#db2777' },
  { id: 'canteen', name: 'Canteens', icon: 'UtensilsCrossed', color: '#0891b2' },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export interface CityPreset {
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: CityPreset[] = [
  { name: 'New York', lat: 40.7589, lng: -73.9851 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.074 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas', lat: 32.7767, lng: -96.797 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { name: 'Boston', lat: 42.3601, lng: -71.0589 },
  { name: 'Austin', lat: 30.2672, lng: -97.7431 },
  { name: 'Denver', lat: 39.7392, lng: -104.9903 },
  { name: 'Miami', lat: 25.7617, lng: -80.1918 },
  { name: 'Atlanta', lat: 33.749, lng: -84.388 },
  { name: 'Portland', lat: 45.5152, lng: -122.6784 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Berlin', lat: 52.52, lng: 13.405 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
];
