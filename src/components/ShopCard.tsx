import { useState } from 'react';
import { Star, MapPin, Phone, Clock, ChevronDown, X, Navigation } from 'lucide-react';
import type { Shop } from '@/types';
import { CATEGORY_MAP } from '@/data/catalog';
import { DAY_NAMES_FULL } from '@/data/generator';
import { formatDistance, formatHour, formatHoursShort, haversineKm, isOpenNow, minutesUntilClose, statusLabel } from '@/lib/geo';
import type { Coords } from '@/types';
import * as Icons from 'lucide-react';

interface Props {
  shop: Shop;
  center: Coords;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ShopCard({ shop, center, isSelected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_MAP[shop.category];
  const dist = haversineKm(center, shop);
  const status = statusLabel(shop.hours);
  const open = isOpenNow(shop.hours);
  const minsToClose = minutesUntilClose(shop.hours);
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[cat.icon] ?? Icons.Store;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`;

  return (
    <div
      className={`shop-card ${isSelected ? 'selected' : ''} ${open ? 'is-open' : 'is-closed'}`}
      onClick={onSelect}
    >
      <div className="shop-card-header">
        <div className="shop-icon" style={{ background: `${cat.color}22`, color: cat.color }}>
          <IconComp size={20} />
        </div>
        <div className="shop-info">
          <h3 className="shop-name">{shop.name}</h3>
          <div className="shop-meta">
            <span className="shop-category" style={{ color: cat.color }}>{cat.name}</span>
            <span className="shop-dot-sep">·</span>
            <span className="shop-distance"><MapPin size={12} /> {formatDistance(dist)}</span>
          </div>
        </div>
        <div className={`shop-status-badge ${open ? 'open' : 'closed'} ${status.closingSoon ? 'closing-soon' : ''}`}>
          {status.closingSoon && <Clock size={11} />}
          {status.text}
        </div>
      </div>

      <div className="shop-card-body">
        <div className="shop-stats">
          <span className="shop-rating"><Star size={13} fill="#f59e0b" stroke="#f59e0b" /> {shop.rating.toFixed(1)} <span className="muted">({shop.reviews})</span></span>
          {open && minsToClose !== null && minsToClose <= 180 && (
            <span className="shop-closing-soon-text">Until {formatHour(shop.hours[new Date().getDay()].close)}</span>
          )}
        </div>
        <div className="shop-address-line"><MapPin size={12} /> {shop.address}</div>
        <div className="shop-phone-line"><Phone size={12} /> {shop.phone}</div>

        <button className="shop-hours-toggle" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
          <Clock size={13} />
          Today: {formatHoursShort(shop.hours[new Date().getDay()])}
          <ChevronDown size={14} className={expanded ? 'chevron-up' : ''} />
        </button>

        {expanded && (
          <div className="shop-hours-list">
            {shop.hours.map((h, i) => (
              <div key={i} className={`hours-row ${i === new Date().getDay() ? 'today' : ''}`}>
                <span className="hours-day">{DAY_NAMES_FULL[i]}</span>
                <span className="hours-time">{h.open === 0 && h.close === 0 ? 'Closed' : `${formatHour(h.open)} – ${formatHour(h.close)}`}</span>
              </div>
            ))}
          </div>
        )}

        <a
          className="shop-directions-btn"
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Navigation size={14} /> Get Directions
        </a>
      </div>

      {shop.custom && (
        <div className="custom-badge"><X size={9} /> Added by you</div>
      )}
    </div>
  );
}
