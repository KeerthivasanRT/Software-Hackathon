'use client';

import dynamic from 'next/dynamic';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function DriverRoutePage() {
  const { user, buses, routes } = useDataStore();
  
  const assignedBus = buses.find(b => b.driverId === user?.id) || buses[0];
  const route = routes.find(r => r.id === assignedBus?.routeId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Route</h1>
        <p className="text-slate-500 mt-1">View your assigned daily transport route.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Navigation className="w-5 h-5 mr-2" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {route ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{route.name}</h3>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Distance</span>
                    <span className="font-medium text-slate-800">{route.distance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Est. Time</span>
                    <span className="font-medium text-slate-800">{route.estimatedTime}</span>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <h4 className="font-medium text-slate-700 border-b pb-2">Stops Sequence</h4>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {route.stops.map((stop, i) => (
                        <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-blue-500 text-slate-500 group-[.is-active]:bg-blue-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded border border-slate-100 shadow-sm ml-4 md:ml-0">
                            <div className="flex items-center justify-between space-x-2">
                              <div className="font-medium text-slate-800 text-sm">{stop.name}</div>
                            </div>
                          </div>
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
