import type { CategoryId, Shop, WeeklyHours, Coords } from '@/types';

const NAME_PARTS: Record<CategoryId, { prefix: string[]; suffix: string[] }> = {
  restaurant: {
    prefix: ['The', 'Bella', 'Olive', 'Golden', 'Spice', 'Harvest', 'Urban', 'Riverside', 'Golden Spoon', 'Saffron'],
    suffix: ['Table', 'Kitchen', 'Bistro', 'Grill', 'Trattoria', 'Garden', 'Plate', 'Fork', 'Kitchen & Bar', 'Eatery'],
  },
  cafe: {
    prefix: ['Morning', 'Bean', 'Steep', 'Daily', 'Roast', 'Copper', 'Linden', 'Maple', 'Crema', 'Grind'],
    suffix: ['Brew', 'Coffee', 'Beans', 'Cup', 'Roasters', 'Café', 'Grind', 'Blend', 'Roastery', 'Coffee Co.'],
  },
  bar: {
    prefix: ['The', 'Nightcap', 'Velvet', 'Ember', 'Brick', 'Vine', 'Copper', 'Hideaway', 'Lantern', 'Atlas'],
    suffix: ['Lounge', 'Bar', 'Tavern', 'Tap', 'Cellar', 'Pub', 'Speakeasy', 'Room', 'Bar & Grill', 'Social'],
  },
  grocery: {
    prefix: ['Fresh', 'Value', 'Green', 'Family', 'Harvest', 'Corner', 'Daily', 'Community', 'Sunrise', 'Prime'],
    suffix: ['Market', 'Grocers', 'Foods', 'Mart', 'Grocery', 'Provisions', 'Supermarket', 'Fresh', 'Market & Deli', 'Foods Co.'],
  },
  pharmacy: {
    prefix: ['City', 'Health', 'Care', 'Well', 'Reliance', 'Express', 'Family', 'Corner', 'Metro', 'Unity'],
    suffix: ['Pharmacy', 'Drug Store', 'Apothecary', 'Drugs', 'Pharma', 'Health Mart', 'Chemist', 'Care Pharmacy', 'Rx', 'Pharmacy & Wellness'],
  },
  convenience: {
    prefix: ['Quick', 'Corner', 'Express', 'City', 'Fast', 'Daily', 'Stop', 'Metro', 'Sunshine', 'Neighborhood'],
    suffix: ['Stop', 'Mart', 'Express', 'Convenience', 'Store', 'Shop', 'Corner Store', 'Mini Mart', 'Express Mart', 'Quick Mart'],
  },
  gas: {
    prefix: ['Express', 'City', 'Speedy', 'Premium', 'Highway', 'Corner', 'Union', 'Delta', 'Apex', 'Riverside'],
    suffix: ['Gas', 'Fuel', 'Station', 'Service', 'Energy', 'Petrol', 'Gas & Go', 'Fuel Stop', 'Service Station', 'Energy Mart'],
  },
  gym: {
    prefix: ['Power', 'Iron', 'Summit', 'Pulse', 'Apex', 'Velocity', 'Core', 'Titan', 'Elevate', 'Forge'],
    suffix: ['Fitness', 'Gym', 'Athletic', 'Strength', 'Training', 'Fit Club', 'Fitness Center', 'Gym & Wellness', 'Athletic Club', 'Fitness Studio'],
  },
  bakery: {
    prefix: ['Sweet', 'Golden', 'Hearth', 'Crumb', 'Butter', 'Flour', 'Morning', 'Sugar', 'Rustic', 'Wildflour'],
    suffix: ['Bakery', 'Bake House', 'Bakeshop', 'Bread', 'Pastry', 'Sweets', 'Bake Shop', 'Oven', 'Bakery & Café', 'Bread Co.'],
  },
  hardware: {
    prefix: ['City', 'Ace', 'Corner', 'Metro', 'Family', 'Reliable', 'True', 'Builder', 'Pro', 'Neighbor'],
    suffix: ['Hardware', 'Building Supply', 'Tool', 'Home Center', 'Hardware Co.', 'Lumber & Supply', 'Tools', 'Home & Hardware', 'Supply', 'Hardware Store'],
  },
  bookstore: {
    prefix: ['Page', 'Chapter', 'Ink', 'River', 'Open', 'Corner', 'City', 'Story', 'Leaf', 'Bound'],
    suffix: ['Books', 'Bookstore', 'Bookshop', 'Reading', 'Books & Co.', 'Pages', 'Book Corner', 'Bookhouse', 'Literary', 'Bookstore & Café'],
  },
  salon: {
    prefix: ['Studio', 'Bliss', 'Bloom', 'Mirror', 'The', 'Velvet', 'Luxe', 'Crown', 'Aura', 'Polished'],
    suffix: ['Salon', 'Hair', 'Studio', 'Beauty', 'Salon & Spa', 'Barber', 'Hair Studio', 'Beauty Lounge', 'Salon & Co.', 'Grooming'],
  },
  canteen: {
    prefix: ['Campus', 'City', 'Worker', 'Metro', 'College', 'Staff', 'Community', 'Union', 'Square', 'Daily'],
    suffix: ['Canteen', 'Mess', 'Food Hall', 'Eats', 'Diner', 'Kitchen', 'Cafeteria', 'Food Court', 'Meals', 'Canteen & Café'],
  },
};

const ADDRESSES: string[] = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine St', 'Elm Way', 'Park Blvd',
  'Highland Ave', 'Sunset Blvd', 'Market St', 'Bridge St', 'River Rd', 'Church St',
  'School Ln', 'Hill Rd', 'Meadow Ln', 'Forest Dr', 'Lake Ave', 'Spring St', 'Walnut St',
];

const PHONES: string[] = [
  '555-0101', '555-0102', '555-0103', '555-0104', '555-0105', '555-0106', '555-0107',
  '555-0108', '555-0109', '555-0110', '555-0111', '555-0112', '555-0113', '555-0114',
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

const ALL_CATEGORIES = Object.keys(NAME_PARTS) as CategoryId[];

const HOUR_TEMPLATES: Record<CategoryId, WeeklyHours[]> = {
  restaurant: [
    [{ open: 11, close: 22 }, { open: 11, close: 22 }, { open: 11, close: 22 }, { open: 11, close: 22 }, { open: 11, close: 23 }, { open: 11, close: 23 }, { open: 11, close: 22 }],
    [{ open: 11, close: 21 }, { open: 11, close: 21 }, { open: 11, close: 21 }, { open: 11, close: 21 }, { open: 11, close: 22 }, { open: 10, close: 23 }, { open: 10, close: 22 }],
    [{ open: 17, close: 23 }, { open: 17, close: 23 }, { open: 17, close: 23 }, { open: 17, close: 23 }, { open: 17, close: 24 }, { open: 12, close: 24 }, { open: 12, close: 23 }],
    [{ open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 11, close: 23 }, { open: 11, close: 24 }, { open: 11, close: 23 }],
  ],
  cafe: [
    [{ open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 18 }],
    [{ open: 6, close: 18 }, { open: 6, close: 18 }, { open: 6, close: 18 }, { open: 6, close: 18 }, { open: 6, close: 18 }, { open: 7, close: 18 }, { open: 7, close: 17 }],
    [{ open: 8, close: 17 }, { open: 8, close: 17 }, { open: 8, close: 17 }, { open: 8, close: 17 }, { open: 8, close: 17 }, { open: 9, close: 18 }, { open: 9, close: 17 }],
    [{ open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 8, close: 20 }, { open: 8, close: 20 }],
  ],
  bar: [
    [{ open: 16, close: 24 }, { open: 16, close: 24 }, { open: 16, close: 24 }, { open: 16, close: 24 }, { open: 16, close: 26 }, { open: 16, close: 26 }, { open: 16, close: 24 }],
    [{ open: 17, close: 24 }, { open: 17, close: 24 }, { open: 17, close: 24 }, { open: 17, close: 24 }, { open: 17, close: 25 }, { open: 15, close: 26 }, { open: 15, close: 24 }],
    [{ open: 12, close: 24 }, { open: 12, close: 24 }, { open: 12, close: 24 }, { open: 12, close: 24 }, { open: 12, close: 26 }, { open: 12, close: 26 }, { open: 12, close: 24 }],
  ],
  grocery: [
    [{ open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 23 }, { open: 8, close: 23 }, { open: 8, close: 21 }],
    [{ open: 7, close: 23 }, { open: 7, close: 23 }, { open: 7, close: 23 }, { open: 7, close: 23 }, { open: 7, close: 23 }, { open: 7, close: 23 }, { open: 7, close: 23 }],
    [{ open: 6, close: 24 }, { open: 6, close: 24 }, { open: 6, close: 24 }, { open: 6, close: 24 }, { open: 6, close: 24 }, { open: 6, close: 24 }, { open: 6, close: 24 }],
  ],
  pharmacy: [
    [{ open: 9, close: 21 }, { open: 9, close: 21 }, { open: 9, close: 21 }, { open: 9, close: 21 }, { open: 9, close: 21 }, { open: 9, close: 21 }, { open: 10, close: 18 }],
    [{ open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 22 }, { open: 8, close: 22 }, { open: 9, close: 20 }],
    [{ open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }],
  ],
  convenience: [
    [{ open: 6, close: 23 }, { open: 6, close: 23 }, { open: 6, close: 23 }, { open: 6, close: 23 }, { open: 6, close: 24 }, { open: 6, close: 24 }, { open: 7, close: 23 }],
    [{ open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }],
    [{ open: 7, close: 22 }, { open: 7, close: 22 }, { open: 7, close: 22 }, { open: 7, close: 22 }, { open: 7, close: 22 }, { open: 7, close: 23 }, { open: 8, close: 22 }],
  ],
  gas: [
    [{ open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }],
    [{ open: 5, close: 24 }, { open: 5, close: 24 }, { open: 5, close: 24 }, { open: 5, close: 24 }, { open: 5, close: 24 }, { open: 5, close: 24 }, { open: 6, close: 24 }],
    [{ open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 7, close: 21 }],
  ],
  gym: [
    [{ open: 5, close: 23 }, { open: 5, close: 23 }, { open: 5, close: 23 }, { open: 5, close: 23 }, { open: 5, close: 23 }, { open: 6, close: 21 }, { open: 7, close: 20 }],
    [{ open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 6, close: 22 }, { open: 7, close: 20 }, { open: 8, close: 18 }],
    [{ open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }, { open: 0, close: 24 }],
  ],
  bakery: [
    [{ open: 6, close: 18 }, { open: 6, close: 18 }, { open: 6, close: 18 }, { open: 6, close: 18 }, { open: 6, close: 18 }, { open: 7, close: 16 }, { open: 7, close: 15 }],
    [{ open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 19 }, { open: 7, close: 18 }, { open: 0, close: 0 }],
    [{ open: 5, close: 14 }, { open: 5, close: 14 }, { open: 5, close: 14 }, { open: 5, close: 14 }, { open: 5, close: 14 }, { open: 6, close: 15 }, { open: 6, close: 14 }],
  ],
  hardware: [
    [{ open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 18 }, { open: 9, close: 17 }],
    [{ open: 7, close: 21 }, { open: 7, close: 21 }, { open: 7, close: 21 }, { open: 7, close: 21 }, { open: 7, close: 21 }, { open: 8, close: 20 }, { open: 9, close: 18 }],
    [{ open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 8, close: 18 }, { open: 9, close: 17 }],
  ],
  bookstore: [
    [{ open: 10, close: 21 }, { open: 10, close: 21 }, { open: 10, close: 21 }, { open: 10, close: 21 }, { open: 10, close: 22 }, { open: 10, close: 22 }, { open: 11, close: 20 }],
    [{ open: 9, close: 20 }, { open: 9, close: 20 }, { open: 9, close: 20 }, { open: 9, close: 20 }, { open: 9, close: 21 }, { open: 10, close: 21 }, { open: 10, close: 18 }],
    [{ open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 10, close: 20 }, { open: 11, close: 18 }],
  ],
  salon: [
    [{ open: 9, close: 19 }, { open: 9, close: 19 }, { open: 9, close: 19 }, { open: 9, close: 19 }, { open: 9, close: 20 }, { open: 9, close: 17 }, { open: 10, close: 16 }],
    [{ open: 10, close: 20 }, { open: 10, close: 20 }, { open: 10, close: 20 }, { open: 10, close: 20 }, { open: 10, close: 21 }, { open: 9, close: 18 }, { open: 0, close: 0 }],
    [{ open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 0, close: 0 }, { open: 9, close: 18 }, { open: 10, close: 16 }],
  ],
  canteen: [
    [{ open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 16 }, { open: 0, close: 0 }],
    [{ open: 7, close: 21 }, { open: 7, close: 21 }, { open: 7, close: 21 }, { open: 7, close: 21 }, { open: 7, close: 21 }, { open: 8, close: 18 }, { open: 9, close: 17 }],
    [{ open: 11, close: 15 }, { open: 11, close: 15 }, { open: 11, close: 15 }, { open: 11, close: 15 }, { open: 11, close: 15 }, { open: 11, close: 20 }, { open: 0, close: 0 }],
  ],
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateShops(center: Coords, count = 60): Shop[] {
  const seed = hashString(`${center.label}|${center.lat.toFixed(3)}|${center.lng.toFixed(3)}`);
  const rng = mulberry32(seed);
  const shops: Shop[] = [];
  const usedNames = new Set<string>();

  shops.push({
    id: `blue-canteen-${seed}`,
    name: 'Blue Canteen',
    category: 'canteen',
    lat: center.lat + 0.0009,
    lng: center.lng + 0.0009,
    address: 'College Campus, Main Block',
    phone: '(200) 555-0199',
    rating: 4.3,
    reviews: 218,
    hours: [
      { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 20 },
      { open: 8, close: 20 }, { open: 8, close: 20 }, { open: 8, close: 16 },
      { open: 0, close: 0 },
    ],
  });
  usedNames.add('Blue Canteen');

  for (let i = 0; i < count; i++) {
    let category = pick(rng, ALL_CATEGORIES);
    if (rng() < 0.15) {
      category = pick(rng, ALL_CATEGORIES);
    }

    let name = `${pick(rng, NAME_PARTS[category].prefix)} ${pick(rng, NAME_PARTS[category].suffix)}`;
    let attempts = 0;
    while (usedNames.has(name) && attempts < 10) {
      name = `${pick(rng, NAME_PARTS[category].prefix)} ${pick(rng, NAME_PARTS[category].suffix)}`;
      attempts++;
    }
    usedNames.add(name);

    const angle = rng() * Math.PI * 2;
    const distanceKm = 0.3 + rng() * 9.5;
    const latOffset = (distanceKm / 111) * Math.sin(angle);
    const lngOffset = (distanceKm / (111 * Math.cos((center.lat * Math.PI) / 180))) * Math.cos(angle);

    const houseNum = Math.floor(rng() * 900) + 100;
    const street = pick(rng, ADDRESSES);
    const phone = `(${200 + Math.floor(rng() * 700)}) ${pick(rng, PHONES)}`;

    const rating = Math.round((3.2 + rng() * 1.7) * 10) / 10;
    const reviews = Math.floor(rng() * 950) + 12;

    const hours = pick(rng, HOUR_TEMPLATES[category]).map((h) => ({ ...h }));

    shops.push({
      id: `seed-${i}-${seed}`,
      name,
      category,
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
      address: `${houseNum} ${street}`,
      phone,
      rating,
      reviews,
      hours,
    });
  }

  return shops;
}

export function getDayName(day: number): string {
  return DAY_NAMES[day];
}

export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
