'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Route, Stop } from '@/types';

// Fix Leaflet's default icon path issues with webpack
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RouteMapProps {
  route?: Route;
  interactive?: boolean;
  onStopAdded?: (lat: number, lng: number) => void;
  stops?: Stop[];
}

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function RouteMap({ route, interactive = false, onStopAdded, stops = [] }: RouteMapProps) {
  const [mounted, setMounted] = useState(false);
  const mapCenter = { lat: 12.9716, lng: 77.5946 }; // Default: Bangalore approx.

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>;

  const displayStops = route ? route.stops : stops;
  const polylinePositions = displayStops.map(stop => [stop.latitude, stop.longitude] as [number, number]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-slate-200 shadow-sm z-0 relative">
      <MapContainer 
        center={displayStops.length > 0 ? [displayStops[0].latitude, displayStops[0].longitude] : mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {interactive && onStopAdded && (
          <MapEvents onMapClick={onStopAdded} />
        )}

        {displayStops.map((stop) => (
          <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={customIcon}>
            <Popup>
              <strong>{stop.name}</strong><br />
              Stop #{stop.order}
            </Popup>
          </Marker>
        ))}

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} color="#3b82f6" weight={5} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
}
