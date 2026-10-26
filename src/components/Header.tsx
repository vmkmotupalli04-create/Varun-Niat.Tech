import { MapPin, RefreshCw, Plus, X } from 'lucide-react';
import type { Coords } from '@/types';

interface Props {
  center: Coords;
  onChangeLocation: () => void;
  onAddShop: () => void;
  openCount: number;
  totalCount: number;
}

export default function Header({ center, onChangeLocation, onAddShop, openCount, totalCount }: Props) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-radar">
            <div className="logo-ring" />
            <div className="logo-sweep" />
            <div className="logo-dot" />
          </div>
          <div>
            <h1 className="header-title">NearOpen</h1>
            <div className="header-location">
              <MapPin size={12} />
              {center.label}
              <span className="header-stats">
                · {openCount} open / {totalCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={onChangeLocation}>
          <RefreshCw size={15} /> Change
        </button>
        <button className="header-btn primary" onClick={onAddShop}>
          <Plus size={15} /> Add Shop
        </button>
      </div>
    </header>
  );
}

export function MiniHeader({ center, onClose }: { center: Coords; onClose: () => void }) {
  return (
    <div className="welcome-mini-header">
      <span><MapPin size={13} /> {center.label}</span>
      <button onClick={onClose}><X size={16} /></button>
    </div>
  );
}
