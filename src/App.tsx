import { useEffect, useMemo, useState, useCallback } from 'react';
import { Store } from 'lucide-react';
import type { CategoryId, Coords, Shop, SortMode, StatusFilter } from '@/types';
import { generateShops } from '@/data/generator';
import { filterShops, isOpenNow, sortShops } from '@/lib/geo';
import Header from '@/components/Header';
import Welcome from '@/components/Welcome';
import FilterBar from '@/components/FilterBar';
import RadarMap from '@/components/RadarMap';
import ShopCard from '@/components/ShopCard';
import AddShopModal from '@/components/AddShopModal';
import { SearchX } from 'lucide-react';

const STORAGE_KEY = 'nearopen-state-v1';

interface PersistedState {
  center: Coords | null;
  customShops: Shop[];
  search: string;
  category: CategoryId | null;
  status: StatusFilter;
  sort: SortMode;
  maxDistance: number;
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return {
    center: null,
    customShops: [],
    search: '',
    category: null,
    status: 'all',
    sort: 'nearest-open',
    maxDistance: 10,
  };
}

export default function App() {
  const initial = loadState();
  const [center, setCenter] = useState<Coords | null>(initial.center);
  const [customShops, setCustomShops] = useState<Shop[]>(initial.customShops);
  const [search, setSearch] = useState(initial.search);
  const [category, setCategory] = useState<CategoryId | null>(initial.category);
  const [status, setStatus] = useState<StatusFilter>(initial.status);
  const [sort, setSort] = useState<SortMode>(initial.sort);
  const [maxDistance, setMaxDistance] = useState(initial.maxDistance);

  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(!initial.center);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tick, setTick] = useState(0);

  // persist
  useEffect(() => {
    const data: PersistedState = { center, customShops, search, category, status, sort, maxDistance };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [center, customShops, search, category, status, sort, maxDistance]);

  // refresh open/closed status every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // tick reference to force re-render
  void tick;

  const seededShops = useMemo(() => {
    if (!center) return [];
    return generateShops(center, 80);
  }, [center]);

  const allShops = useMemo(() => [...customShops, ...seededShops], [customShops, seededShops]);

  const filteredShops = useMemo(() => {
    if (!center) return [];
    const filtered = filterShops(allShops, { category, status, search, maxDistance, center });
    return sortShops(filtered, center, sort);
  }, [allShops, category, status, search, maxDistance, center, sort]);

  const openCount = useMemo(() => allShops.filter((s) => isOpenNow(s.hours)).length, [allShops, tick]);

  const handleLocate = useCallback(() => {
    setLocating(true);
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Location not supported on this device. Pick a city instead.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'My Location' });
        setShowWelcome(false);
        setLocating(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Pick a city instead.',
          2: 'Location unavailable. Pick a city instead.',
          3: 'Location request timed out. Pick a city instead.',
        };
        setGeoError(messages[err.code] || 'Could not get your location. Pick a city instead.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  }, []);

  const handlePickCity = useCallback((c: Coords) => {
    setCenter(c);
    setShowWelcome(false);
    setSelectedId(null);
  }, []);

  const handleAddShop = useCallback((shop: Shop) => {
    setCustomShops((prev) => [...prev, shop]);
    setShowAddModal(false);
    setSelectedId(shop.id);
  }, []);

  const handleChangeLocation = useCallback(() => {
    setShowWelcome(true);
  }, []);

  if (showWelcome || !center) {
    return (
      <Welcome
        onLocate={handleLocate}
        onPickCity={handlePickCity}
        locating={locating}
        geoError={geoError}
        onDismissError={() => setGeoError(null)}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        center={center}
        onChangeLocation={handleChangeLocation}
        onAddShop={() => setShowAddModal(true)}
        openCount={openCount}
        totalCount={allShops.length}
      />

      <FilterBar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        status={status}
        onStatus={setStatus}
        sort={sort}
        onSort={setSort}
        maxDistance={maxDistance}
        onMaxDistance={setMaxDistance}
        resultCount={filteredShops.length}
      />

      <div className="app-main">
        <aside className="app-sidebar">
          <RadarMap
            shops={filteredShops}
            center={center}
            maxDistance={maxDistance}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          />
          <div className="sidebar-stats">
            <div className="stat-block">
              <span className="stat-value open">{openCount}</span>
              <span className="stat-label">Open now</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">{allShops.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">{customShops.length}</span>
              <span className="stat-label">Added</span>
            </div>
          </div>
        </aside>

        <main className="app-list">
          {filteredShops.length === 0 ? (
            <div className="empty-state">
              <SearchX size={40} />
              <h3>No shops found</h3>
              <p>Try adjusting your filters, increasing the radius, or adding a shop manually.</p>
              <button className="empty-add-btn" onClick={() => setShowAddModal(true)}>
                Add a shop
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {filteredShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  center={center}
                  isSelected={shop.id === selectedId}
                  onSelect={() => setSelectedId(shop.id === selectedId ? null : shop.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <AddShopModal
          center={center}
          onAdd={handleAddShop}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <footer className="app-footer">
        <Store size={12} />
        Works offline · {allShops.length} shops · Location: {center.label} · Built by Varun · NIAT.tech
      </footer>
    </div>
  );
}
