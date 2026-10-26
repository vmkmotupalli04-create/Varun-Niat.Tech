import { useState } from 'react';
import { X, Plus, MapPin } from 'lucide-react';
import { CATEGORIES } from '@/data/catalog';
import type { CategoryId, Coords, Shop } from '@/types';
import { haversineKm } from '@/lib/geo';

interface Props {
  center: Coords;
  onAdd: (shop: Shop) => void;
  onClose: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AddShopModal({ center, onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>('restaurant');
  const [latStr, setLatStr] = useState(center.lat.toFixed(4));
  const [lngStr, setLngStr] = useState(center.lng.toFixed(4));
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState(
    DAYS.map(() => ({ open: 9, close: 21 })),
  );
  const [error, setError] = useState('');

  function updateHour(day: number, field: 'open' | 'close', value: number) {
    setHours((prev) => prev.map((h, i) => (i === day ? { ...h, [field]: value } : h)));
  }

  function toggleClosed(day: number) {
    setHours((prev) => prev.map((h, i) => (i === day ? { open: 0, close: 0 } : h)));
  }

  function handleSubmit() {
    if (!name.trim()) {
      setError('Please enter a shop name');
      return;
    }
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid coordinates');
      return;
    }

    const shop: Shop = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      lat,
      lng,
      address: address.trim() || 'Custom location',
      phone: '—',
      rating: 0,
      reviews: 0,
      hours,
      custom: true,
    };
    onAdd(shop);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Plus size={18} /> Add a Shop</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <label className="modal-label">Shop name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="e.g. The Corner Café"
            className="modal-input"
          />

          <label className="modal-label">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className="modal-select">
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label className="modal-label">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Main St"
            className="modal-input"
          />

          <div className="modal-coords-row">
            <div>
              <label className="modal-label">Latitude</label>
              <input type="text" value={latStr} onChange={(e) => setLatStr(e.target.value)} className="modal-input" />
            </div>
            <div>
              <label className="modal-label">Longitude</label>
              <input type="text" value={lngStr} onChange={(e) => setLngStr(e.target.value)} className="modal-input" />
            </div>
          </div>

          {(() => {
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
              const d = haversineKm(center, { lat, lng });
              return <div className="modal-distance-hint"><MapPin size={12} /> {d.toFixed(2)} km from center</div>;
            }
            return null;
          })()}

          <label className="modal-label">Opening hours</label>
          <div className="modal-hours-grid">
            {DAYS.map((day, i) => {
              const isClosed = hours[i].open === 0 && hours[i].close === 0;
              return (
                <div key={day} className="modal-hours-row">
                  <span className="modal-hours-day">{day}</span>
                  {isClosed ? (
                    <span className="modal-hours-closed">Closed</span>
                  ) : (
                    <>
                      <select value={hours[i].open} onChange={(e) => updateHour(i, 'open', Number(e.target.value))} className="modal-hour-select">
                        {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{h}:00</option>)}
                      </select>
                      <span>to</span>
                      <select value={hours[i].close} onChange={(e) => updateHour(i, 'close', Number(e.target.value))} className="modal-hour-select">
                        {Array.from({ length: 25 }, (_, h) => <option key={h} value={h}>{h === 24 ? '24:00' : `${h}:00`}</option>)}
                      </select>
                    </>
                  )}
                  <button className="modal-toggle-closed" onClick={() => toggleClosed(i)}>
                    {isClosed ? 'Open' : 'Close'}
                  </button>
                </div>
              );
            })}
          </div>

          {error && <div className="modal-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-submit" onClick={handleSubmit}>Add Shop</button>
        </div>
      </div>
    </div>
  );
}
