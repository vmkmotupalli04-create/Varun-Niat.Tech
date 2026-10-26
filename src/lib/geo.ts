import type { Coords, Shop, WeeklyHours } from '@/types';

const EARTH_R = 6371;

export function haversineKm(a: Coords, b: { lat: number; lng: number }): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function isOpenNow(hours: WeeklyHours, now = new Date()): boolean {
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const entry = hours[day];
  if (!entry || (entry.open === 0 && entry.close === 0)) return false;
  if (entry.open === 0 && entry.close === 24) return true;

  const open = entry.open;
  const close = entry.close;
  if (close > 24) {
    const closeAdj = close - 24;
    return hour >= open || hour < closeAdj;
  }
  return hour >= open && hour < close;
}

export function getClosingTime(hours: WeeklyHours, now = new Date()): number | null {
  const day = now.getDay();
  const entry = hours[day];
  if (!entry || (entry.open === 0 && entry.close === 0)) return null;
  return entry.close;
}

export function minutesUntilClose(hours: WeeklyHours, now = new Date()): number | null {
  const closing = getClosingTime(hours, now);
  if (closing === null) return null;
  const currentMin = now.getHours() * 60 + now.getMinutes();
  let closeMin: number;
  if (closing > 24) {
    closeMin = (closing - 24) * 60;
  } else {
    closeMin = closing * 60;
  }
  let diff = closeMin - currentMin;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export function formatHour(h: number): string {
  if (h === 24) return 'Midnight';
  if (h > 24) {
    const adj = h - 24;
    return formatHour(adj);
  }
  const period = h >= 12 ? 'PM' : 'AM';
  let display = h % 12;
  if (display === 0) display = 12;
  return `${display} ${period}`;
}

export function formatHoursShort(entry: { open: number; close: number }): string {
  if (entry.open === 0 && entry.close === 0) return 'Closed';
  if (entry.open === 0 && entry.close === 24) return '24 hr';
  return `${formatHour(entry.open)} – ${formatHour(entry.close)}`;
}

export function statusLabel(hours: WeeklyHours, now = new Date()): { text: string; closingSoon: boolean } {
  if (isOpenNow(hours, now)) {
    const mins = minutesUntilClose(hours, now);
    if (mins !== null && mins <= 60) {
      return { text: `Closing in ${mins}m`, closingSoon: true };
    }
    return { text: 'Open now', closingSoon: false };
  }
  return { text: 'Closed', closingSoon: false };
}

export function sortShops(shops: Shop[], center: Coords, mode: string): Shop[] {
  const sorted = [...shops];
  switch (mode) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'closing':
      return sorted.sort((a, b) => {
        const aOpen = isOpenNow(a.hours);
        const bOpen = isOpenNow(b.hours);
        if (aOpen && !bOpen) return -1;
        if (!aOpen && bOpen) return 1;
        if (aOpen && bOpen) {
          const aMins = minutesUntilClose(a.hours) ?? 9999;
          const bMins = minutesUntilClose(b.hours) ?? 9999;
          return aMins - bMins;
        }
        return haversineKm(center, a) - haversineKm(center, b);
      });
    case 'nearest-open':
      return sorted.sort((a, b) => {
        const aOpen = isOpenNow(a.hours);
        const bOpen = isOpenNow(b.hours);
        if (aOpen && !bOpen) return -1;
        if (!aOpen && bOpen) return 1;
        return haversineKm(center, a) - haversineKm(center, b);
      });
    default:
      return sorted.sort((a, b) => haversineKm(center, a) - haversineKm(center, b));
  }
}

export function filterShops(
  shops: Shop[],
  opts: { category: string | null; status: string; search: string; maxDistance: number; center: Coords },
): Shop[] {
  return shops.filter((s) => {
    if (opts.category && s.category !== opts.category) return false;
    if (opts.status === 'open' && !isOpenNow(s.hours)) return false;
    if (opts.status === 'closed' && isOpenNow(s.hours)) return false;
    if (opts.search) {
      const q = opts.search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.address.toLowerCase().includes(q)) return false;
    }
    const dist = haversineKm(opts.center, s);
    if (dist > opts.maxDistance) return false;
    return true;
  });
}
