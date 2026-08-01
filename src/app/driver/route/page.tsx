'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Navigation, Clock, Navigation2, Users, Bus } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function DriverRoutePage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(getApiUrl('/api/drivers/me/dashboard'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setDashboard(data.data);
        }
      } catch (err) {
        console.warn('Driver route fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRouteData();
  }, []);

  const routeName = dashboard?.routeName || 'Route A: Annur → BIT';
  const assignedBus = dashboard?.assignedBus || 'BUS-001';
  const registrationNumber = dashboard?.registrationNumber || 'TN-38-BT-1001';
  const origin = dashboard?.origin || 'Annur Bus Stand';
  const destination = dashboard?.destination || 'BIT Campus, Sathyamangalam';
  const distance = dashboard?.distance || '38 km';
  const estimatedTime = dashboard?.estimatedTime || '1 hr 05 mins';
  const studentCount = dashboard?.studentCount || 48;
  const stops = dashboard?.stops || [];

  // Map route prop for Leaflet
  const mapRouteProp = {
    id: 'route-a-id',
    name: routeName,
    distance: distance,
    estimatedTime: estimatedTime,
    distanceKm: 38,
    stops: stops.map((s: any, idx: number) => ({
      id: s.id || `stop-${idx}`,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      order: s.order || idx + 1
    }))
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assigned Route Telematics</h1>
        <p className="text-slate-500 mt-1 font-medium">Live transit route & GPS stop coordinates populated from MongoDB Atlas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ROUTE DETAILS & STOPS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-sky-50/50 pb-4">
              <CardTitle className="flex items-center text-[#005BAC] text-lg font-bold">
                <Navigation className="w-5 h-5 mr-2" />
                Route Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">{routeName}</h3>
                  <p className="text-slate-500 text-xs mt-1 font-medium">
                    Bus: <strong className="text-blue-600 font-extrabold">{assignedBus}</strong> ({registrationNumber})
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium mb-1 flex items-center">
                      <Navigation2 className="w-3.5 h-3.5 mr-1 text-blue-600" /> Distance
                    </div>
                    <div className="font-extrabold text-slate-900 text-base">{distance}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium mb-1 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" /> Est. Time
                    </div>
                    <div className="font-extrabold text-slate-900 text-base">{estimatedTime}</div>
                  </div>
                </div>

                <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">Total Route Passengers</span>
                  </div>
                  <span className="text-sm font-extrabold text-blue-700">{studentCount} Students</span>
                </div>
                
                {/* STOPS SEQUENCE */}
                <div className="pt-4 space-y-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Point Sequence ({stops.length})</h4>
                  </div>
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-blue-100 max-h-[380px] overflow-y-auto pr-1">
                    {stops.map((stop: any, i: number) => (
                      <div key={stop.id || i} className="relative flex items-start group pb-5 last:pb-0">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-sm shrink-0 z-10 text-xs font-extrabold ${i === 0 ? 'bg-emerald-600 text-white' : i === stops.length - 1 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                           {i === 0 || i === stops.length - 1 ? (
                             <MapPin className="w-3.5 h-3.5" />
                           ) : (
                             <span>{i + 1}</span>
                           )}
                        </div>
                        <div className="ml-4 pt-0.5 flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-slate-800 text-xs">{stop.name}</h5>
                            <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded">{stop.arrivalTime}</span>
                          </div>
                          {i === 0 && <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Origin Start Point</div>}
                          {i === stops.length - 1 && <div className="text-[10px] text-red-600 font-bold mt-0.5">BIT Campus Destination</div>}
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: LEAFLET MAP WITH POLYLINE & MARKERS */}
        <div className="lg:col-span-2">
          <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden h-full flex flex-col min-h-[620px]">
            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-extrabold text-slate-800">GPS Telematics Leaflet Route Map</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Blue polyline connecting {stops.length} pickup points from {origin} to {destination}
                </CardDescription>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-blue-600 text-white rounded-full">
                Live Polyline Active
              </span>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative h-full">
              <RouteMap route={mapRouteProp as any} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
