'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { mockRoutes } from '@/lib/mockData';
import { Stop, Route } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Save, Route as RouteIcon, Navigation, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newStops, setNewStops] = useState<Stop[]>([]);
  const [routeName, setRouteName] = useState('');

  const handleMapClick = (lat: number, lng: number) => {
    if (!isCreating) return;
    const newStop: Stop = {
      id: `new-${Date.now()}`,
      name: `Stop ${newStops.length + 1}`,
      latitude: lat,
      longitude: lng,
      order: newStops.length + 1,
    };
    setNewStops([...newStops, newStop]);
  };

  const handleStopNameChange = (id: string, name: string) => {
    setNewStops(newStops.map(s => s.id === id ? { ...s, name } : s));
  };

  const startCreating = () => {
    setSelectedRoute(null);
    setIsCreating(true);
    setNewStops([]);
    setRouteName('');
  };

  const saveRoute = () => {
    setIsCreating(false);
    alert('Route Saved successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Route Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and create bus routes with interactive mapping.</p>
        </div>
        <Button onClick={startCreating} className="bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all h-10 px-5 rounded-lg text-white font-medium">
          <RouteIcon className="w-4 h-4 mr-2" />
          Create New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {!isCreating ? (
            <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Existing Routes</CardTitle>
                <CardDescription className="text-sm">Select a route to view its details on the map.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {mockRoutes.map(route => (
                  <Button 
                    key={route.id} 
                    variant={selectedRoute?.id === route.id ? 'default' : 'outline'}
                    className={`w-full justify-start h-12 px-4 rounded-xl shadow-none font-semibold ${selectedRoute?.id === route.id ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                    onClick={() => { setSelectedRoute(route); setIsCreating(false); }}
                  >
                    <Navigation className={`w-4 h-4 mr-3 ${selectedRoute?.id === route.id ? 'text-blue-100' : 'text-slate-400'}`} />
                    {route.name}
                  </Button>
                ))}
                {mockRoutes.length === 0 && (
                  <div className="text-center py-6 text-slate-500 flex flex-col items-center">
                    <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-sm">No routes found</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-blue-200 shadow-sm shadow-blue-100 bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-blue-50/30 pb-4">
                <CardTitle className="text-blue-700 flex items-center text-lg font-bold">
                  <MapPin className="w-5 h-5 mr-2" />
                  Route Builder
                </CardTitle>
                <CardDescription className="text-sm">Click on the map to add stops.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Route Name</Label>
                  <Input 
                    placeholder="e.g. West Campus Express" 
                    className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops ({newStops.length})</Label>
                  <ScrollArea className="h-[240px] border border-slate-200/60 rounded-xl bg-slate-50 p-2">
                    {newStops.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-10">
                        <MapPin className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">No stops added yet.</p>
                        <p className="text-xs mt-1">Click the map to add your first stop.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pr-2">
                        {newStops.map((stop, i) => (
                          <div key={stop.id} className="flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm">
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 w-6 h-6 flex items-center justify-center rounded-full shrink-0">
                              {i + 1}
                            </span>
                            <Input 
                              value={stop.name} 
                              onChange={(e) => handleStopNameChange(stop.id, e.target.value)}
                              className="h-8 text-sm border-transparent hover:border-slate-200 focus-visible:border-blue-500 focus-visible:ring-0 shadow-none px-2"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button onClick={saveRoute} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-11 font-semibold shadow-sm" disabled={newStops.length < 2 || !routeName}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Route
                  </Button>
                  <Button onClick={() => setIsCreating(false)} variant="ghost" className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg h-11 font-medium">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedRoute && !isCreating && (
            <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-base font-bold text-slate-800">{selectedRoute.name} Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Distance</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{selectedRoute.distance}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Est. Time</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{selectedRoute.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 font-medium">Total Stops</span>
                    <span className="font-bold text-slate-900 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{selectedRoute.stops.length}</span>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops Sequence</Label>
                    <div className="text-sm space-y-3 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                      {selectedRoute.stops.map((s, i) => (
                        <div key={s.id} className="relative flex items-center text-slate-700 font-medium z-10">
                          <div className={`w-3 h-3 rounded-full border-2 border-white shrink-0 mr-3 ${i === 0 ? 'bg-emerald-500' : i === selectedRoute.stops.length - 1 ? 'bg-red-500' : 'bg-blue-500'}`} />
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden h-full flex flex-col min-h-[600px]">
            <CardContent className="p-0 flex-1 relative h-full">
              <RouteMap 
                route={!isCreating && selectedRoute ? selectedRoute : undefined}
                stops={isCreating ? newStops : []}
                interactive={isCreating}
                onStopAdded={handleMapClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
