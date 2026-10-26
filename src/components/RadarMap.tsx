import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coords, Shop } from '@/types';
import { CATEGORY_MAP } from '@/data/catalog';
import { haversineKm, isOpenNow } from '@/lib/geo';

interface Props {
  shops: Shop[];
  center: Coords;
  maxDistance: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function createIcon(color: string, open: boolean, selected: boolean): L.DivIcon {
  const size = selected ? 18 : 12;
  const ring = selected
    ? 'box-shadow: 0 0 0 3px #fff, 0 0 10px rgba(0,0,0,0.5);'
    : 'box-shadow: 0 1px 4px rgba(0,0,0,0.5);';
  return L.divIcon({
    className: 'sat-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;opacity:${open ? 1 : 0.55};${ring}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function RadarMap({ shops, center, maxDistance, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new globalThis.Map());
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([center.lat, center.lng], 14);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Imagery &copy; Esri',
      },
    ).addTo(map);

    L.tileLayer(
      'https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png',
      { maxZoom: 19, opacity: 0.7, attribution: 'Labels &copy; Stamen' },
    ).addTo(map);

    mapRef.current = map;

    // Fix sizing after mount
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // update center + radius circle when location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([center.lat, center.lng], 14);

    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.circleMarker([center.lat, center.lng], {
      radius: 7,
      color: '#f97316',
      fillColor: '#f97316',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map);

    L.circle([center.lat, center.lng], {
      radius: maxDistance * 1000,
      color: '#f97316',
      weight: 1.5,
      opacity: 0.6,
      fillOpacity: 0.05,
      dashArray: '6 6',
    }).addTo(map);
  }, [center, maxDistance]);

  // update markers when shops change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const next = new Set(shops.map((s) => s.id));

    // remove stale
    markersRef.current.forEach((marker, id) => {
      if (!next.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // add / update
    shops.forEach((s) => {
      const cat = CATEGORY_MAP[s.category];
      const open = isOpenNow(s.hours);
      const selected = s.id === selectedId;
      const icon = createIcon(open ? cat.color : '#475569', open, selected);

      const existing = markersRef.current.get(s.id);
      if (existing) {
        existing.setIcon(icon);
      } else {
        const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);
        marker.on('click', () => onSelectRef.current(s.id));
        markersRef.current.set(s.id, marker);
      }
    });
  }, [shops, selectedId]);

  return (
    <div className="radar-container">
      <div ref={containerRef} className="sat-map" />
      <div className="radar-legend">
        <span className="radar-legend-item"><span className="dot open" /> Open</span>
        <span className="radar-legend-item"><span className="dot closed" /> Closed</span>
      </div>
    </div>
  );
}
