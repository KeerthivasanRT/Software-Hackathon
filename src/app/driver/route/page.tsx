'use client';

import dynamic from 'next/dynamic';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Navigation, Clock, Navigation2 } from 'lucide-react';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function DriverRoutePage() {
  const { user, buses, routes } = useDataStore();
  
  const assignedBus = buses.find(b => b.driverId === user?.id) || buses[0];
  const route = routes.find(r => r.id === assignedBus?.routeId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Route</h1>
        <p className="text-slate-500 mt-1 font-medium">View your assigned daily transport route.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="flex items-center text-blue-700 text-lg font-bold">
                <Navigation className="w-5 h-5 mr-2" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {route ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl tracking-tight">{route.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">Bus: {assignedBus?.busNumber}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-xs text-slate-500 font-medium mb-1 flex items-center">
                        <Navigation2 className="w-3.5 h-3.5 mr-1" /> Distance
                      </div>
                      <div className="font-bold text-slate-900">{route.distance}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-xs text-slate-500 font-medium mb-1 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Est. Time
                      </div>
                      <div className="font-bold text-slate-900">{route.estimatedTime}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops Sequence</h4>
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                      {route.stops.map((stop, i) => (
                        <div key={stop.id} className="relative flex items-start group pb-5 last:pb-0">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-sm shrink-0 z-10 ${i === 0 ? 'bg-emerald-500 text-white' : i === route.stops.length - 1 ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                             {i === 0 || i === route.stops.length - 1 ? (
                               <MapPin className="w-3 h-3" />
                             ) : (
                               <span className="text-[10px] font-bold">{i + 1}</span>
                             )}
                          </div>
                          <div className="ml-4 pt-0.5">
                            <div className="font-bold text-slate-800 text-sm">{stop.name}</div>
                            {i === 0 && <div className="text-xs text-emerald-600 font-medium mt-0.5">Start Point</div>}
                            {i === route.stops.length - 1 && <div className="text-xs text-red-600 font-medium mt-0.5">End Point</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No route assigned.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden h-full flex flex-col min-h-[600px]">
            <CardContent className="p-0 flex-1 relative h-full">
              <RouteMap route={route} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
