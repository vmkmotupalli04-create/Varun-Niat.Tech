import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '@/data/catalog';
import type { CategoryId, SortMode, StatusFilter } from '@/types';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: CategoryId | null;
  onCategory: (c: CategoryId | null) => void;
  status: StatusFilter;
  onStatus: (s: StatusFilter) => void;
  sort: SortMode;
  onSort: (s: SortMode) => void;
  maxDistance: number;
  onMaxDistance: (v: number) => void;
  resultCount: number;
}

const SORT_LABELS: Record<SortMode, string> = {
  'nearest-open': 'Nearest (open first)',
  distance: 'Nearest',
  name: 'Name A–Z',
  rating: 'Top rated',
  closing: 'Closing soon',
};

export default function FilterBar({
  search, onSearch, category, onCategory, status, onStatus, sort, onSort, maxDistance, onMaxDistance, resultCount,
}: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-search-row">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search shops, addresses…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-dropdown">
          <ArrowUpDown size={14} />
          <select value={sort} onChange={(e) => onSort(e.target.value as SortMode)} className="sort-select">
            {(Object.keys(SORT_LABELS) as SortMode[]).map((k) => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-pills-row">
        <button
          className={`pill ${category === null ? 'active' : ''}`}
          onClick={() => onCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`pill ${category === c.id ? 'active' : ''}`}
            onClick={() => onCategory(category === c.id ? null : c.id)}
            style={category === c.id ? { background: c.color, borderColor: c.color } : {}}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="filter-controls-row">
        <div className="status-tabs">
          {(['all', 'open', 'closed'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              className={`status-tab ${status === s ? 'active' : ''}`}
              onClick={() => onStatus(s)}
            >
              {s === 'all' ? 'All' : s === 'open' ? 'Open' : 'Closed'}
            </button>
          ))}
        </div>

        <div className="distance-control">
          <SlidersHorizontal size={13} />
          <span className="distance-label">Within {maxDistance} km</span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={maxDistance}
            onChange={(e) => onMaxDistance(Number(e.target.value))}
            className="distance-slider"
          />
        </div>

        <div className="result-count">{resultCount} found</div>
      </div>
    </div>
  );
}
