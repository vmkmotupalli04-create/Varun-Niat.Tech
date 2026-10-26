import { useState } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { CITIES } from '@/data/catalog';
import type { Coords } from '@/types';

interface Props {
  onLocate: () => void;
  onPickCity: (c: Coords) => void;
  locating: boolean;
  geoError: string | null;
  onDismissError: () => void;
}

export default function Welcome({ onLocate, onPickCity, locating, geoError, onDismissError }: Props) {
  const [query, setQuery] = useState('');
  const [showCities, setShowCities] = useState(false);

  const filtered = query
    ? CITIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : CITIES;

  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <div className="welcome-radar">
          <div className="welcome-radar-ring r1" />
          <div className="welcome-radar-ring r2" />
          <div className="welcome-radar-ring r3" />
          <div className="welcome-radar-sweep" />
          <div className="welcome-radar-center" />
        </div>

        <h1 className="welcome-title">NearOpen</h1>
        <p className="welcome-subtitle">See what's open around you — within 10 km</p>
        <p className="welcome-credit">Built by Varun · NIAT.tech</p>

        {geoError && (
          <div className="welcome-error">
            <span>{geoError}</span>
            <button onClick={onDismissError}><X size={14} /></button>
          </div>
        )}

        <button className="welcome-locate-btn" onClick={onLocate} disabled={locating}>
          <Navigation size={18} />
          {locating ? 'Finding your location…' : 'Use my current location'}
        </button>

        <div className="welcome-divider">
          <span>or pick a city</span>
        </div>

        <div className="welcome-search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search cities…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowCities(true); }}
            onFocus={() => setShowCities(true)}
            className="welcome-search-input"
          />
        </div>

        {showCities && (
          <div className="welcome-city-list">
            {filtered.map((c) => (
              <button
                key={c.name}
                className="welcome-city-item"
                onClick={() => onPickCity({ lat: c.lat, lng: c.lng, label: c.name })}
              >
                <MapPin size={15} />
                {c.name}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="welcome-no-results">No cities found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
