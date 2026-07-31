'use client';

import dynamic from 'next/dynamic';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function StudentRoutePage() {
  const { user, buses, routes, students } = useDataStore();
  
  const studentRecord = students.find(s => s.id === user?.id) || students[0];
  const route = routes.find(r => r.id === studentRecord?.assignedRouteId);
  const pickupStop = route?.stops.find(s => s.id === studentRecord?.pickupStopId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Route</h1>
        <p className="text-slate-500 mt-1">View your bus route and pickup point.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Navigation className="w-5 h-5 mr-2" />
                Route Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              {route ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{route.name}</h3>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                    <h4 className="text-sm font-semibold text-blue-800 flex items-center mb-1">
                      <MapPin className="w-4 h-4 mr-1" /> My Pickup Point
                    </h4>
                    <p className="text-blue-900 font-medium">{pickupStop?.name || 'Not Assigned'}</p>
                  </div>

                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-slate-500">Total Distance</span>
                    <span className="font-medium text-slate-800">{route.distance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Est. Travel Time</span>
                    <span className="font-medium text-slate-800">{route.estimatedTime}</span>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <h4 className="font-medium text-slate-700 border-b pb-2">All Stops</h4>
                    <div className="text-sm space-y-2">
                      {route.stops.map((stop) => (
                        <div key={stop.id} className={`flex items-center p-2 rounded ${stop.id === pickupStop?.id ? 'bg-blue-100 border border-blue-200' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mr-3 ${stop.id === pickupStop?.id ? 'bg-blue-600' : 'bg-slate-400'}`} />
                          <span className={stop.id === pickupStop?.id ? 'font-bold text-blue-800' : 'text-slate-600'}>
                            {stop.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">No route assigned.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm h-full flex flex-col">
            <CardContent className="p-1 flex-1 min-h-[600px]">
              <RouteMap route={route} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
