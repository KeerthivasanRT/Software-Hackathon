'use client';

import dynamic from 'next/dynamic';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Clock, Navigation2 } from 'lucide-react';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function StudentRoutePage() {
  const { user, buses, routes, students } = useDataStore();
  
  const studentRecord = students.find(s => s.id === user?.id) || students[0];
  const route = routes.find(r => r.id === studentRecord?.assignedRouteId);
  const pickupStop = route?.stops.find(s => s.id === studentRecord?.pickupStopId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Route</h1>
        <p className="text-slate-600 mt-1 font-medium">View your bus route and pickup point.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/50 pb-4">
              <CardTitle className="flex items-center text-sky-600 text-lg font-bold">
                <Navigation className="w-5 h-5 mr-2" />
                Route Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {route ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl tracking-tight">{route.name}</h3>
                  </div>
                  
                  <div className="bg-sky-50/50 p-4 rounded-xl border border-blue-100/60 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
                    <h4 className="text-xs font-semibold text-sky-600 uppercase tracking-wider flex items-center mb-1.5">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> My Pickup Point
                    </h4>
                    <p className="text-blue-950 font-bold text-lg">{pickupStop?.name || 'Not Assigned'}</p>
                    <p className="text-sky-600/70 text-xs mt-1">Be at the stop 5 mins early.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-sky-50 rounded-xl p-3 border border-[#D6ECFA]">
                      <div className="text-xs text-slate-600 font-medium mb-1 flex items-center">
                        <Navigation2 className="w-3.5 h-3.5 mr-1" /> Distance
                      </div>
                      <div className="font-bold text-slate-900">{route.distance}</div>
                    </div>
                    <div className="bg-sky-50 rounded-xl p-3 border border-[#D6ECFA]">
                      <div className="text-xs text-slate-600 font-medium mb-1 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Travel Time
                      </div>
                      <div className="font-bold text-slate-900">{route.estimatedTime}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4 border-t border-[#D6ECFA]">
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">All Stops</h4>
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-sky-100">
                      {route.stops.map((stop, i) => {
                        const isMyStop = stop.id === pickupStop?.id;
                        return (
                          <div key={stop.id} className="relative flex items-start group pb-5 last:pb-0">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-sm shrink-0 z-10 ${isMyStop ? 'bg-sky-600 text-white ring-4 ring-blue-50' : i === 0 ? 'bg-emerald-500 text-white' : i === route.stops.length - 1 ? 'bg-red-500 text-white' : 'bg-sky-100 text-slate-600'}`}>
                               {isMyStop || i === 0 || i === route.stops.length - 1 ? (
                                 <MapPin className="w-3 h-3" />
                               ) : (
                                 <div className="w-2 h-2 bg-slate-400 rounded-full" />
                               )}
                            </div>
                            <div className="ml-4 pt-0.5">
                              <div className={`font-bold text-sm ${isMyStop ? 'text-sky-600' : 'text-slate-700'}`}>
                                {stop.name}
                              </div>
                              {isMyStop && <div className="text-xs text-sky-600 font-medium mt-0.5">Your Stop</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <MapPin className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No route assigned.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden h-full flex flex-col min-h-[600px]">
            <CardContent className="p-0 flex-1 relative h-full">
              <RouteMap route={route} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
