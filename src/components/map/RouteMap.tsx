'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
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

// Sub-component to handle map bound updates when stops change
function MapBoundsUpdater({ stops }: { stops: Stop[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.latitude, s.longitude]));
      if (stops.length === 1) {
        map.flyTo([stops[0].latitude, stops[0].longitude], 13, { duration: 1.5 });
      } else {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    }
  }, [stops, map]);
  
  return null;
}

export default function RouteMap({ route, interactive = false, onStopAdded, stops = [] }: RouteMapProps) {
  const [mounted, setMounted] = useState(false);
  
  // Default to Erode/Sathyamangalam approximate center if no route is loaded
  const mapCenter = { lat: 11.3, lng: 77.3 };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>;

  const displayStops = route ? route.stops : stops;
  const polylinePositions = displayStops.map(stop => [stop.latitude, stop.longitude] as [number, number]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm z-0 relative">
      <MapContainer 
        center={displayStops.length > 0 ? [displayStops[0].latitude, displayStops[0].longitude] : mapCenter} 
        zoom={11} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {interactive && onStopAdded && (
          <MapEvents onMapClick={onStopAdded} />
        )}
        
        <MapBoundsUpdater stops={displayStops} />

        {displayStops.map((stop, index) => (
          <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={customIcon}>
            <Popup className="rounded-lg shadow-sm">
              <div className="px-1 py-1">
                <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Stop {stop.order || index + 1}</div>
                <div className="font-semibold text-slate-900 text-sm mb-1">{stop.name}</div>
                {route && (
                  <div className="text-xs text-slate-500 mt-2 border-t pt-2 border-slate-100">
                    Part of {route.name}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#2563eb" 
            weight={6} 
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapContainer>
    </div>
  );
}
