'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { mockRoutes } from '@/lib/mockData';
import { Stop, Route } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Save, Route as RouteIcon, Navigation } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Dynamically import the map to avoid SSR issues with Leaflet
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
    // In a real app, this would send to API.
    alert('Route Saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Route Management</h1>
          <p className="text-slate-500 mt-1">Manage and create bus routes with interactive mapping.</p>
        </div>
        <Button onClick={startCreating} className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <RouteIcon className="w-4 h-4 mr-2" />
          Create New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {!isCreating ? (
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Existing Routes</CardTitle>
                <CardDescription>Select a route to view its details on the map.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockRoutes.map(route => (
                  <Button 
                    key={route.id} 
                    variant={selectedRoute?.id === route.id ? 'default' : 'outline'}
                    className={`w-full justify-start ${selectedRoute?.id === route.id ? 'bg-blue-600' : 'bg-white'}`}
                    onClick={() => { setSelectedRoute(route); setIsCreating(false); }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {route.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm bg-white border-blue-200 shadow-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Route Builder
                </CardTitle>
                <CardDescription>Click on the map to add stops.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Route Name</Label>
                  <Input 
                    placeholder="e.g. West Campus Express" 
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Stops ({newStops.length})</Label>
                  <ScrollArea className="h-[200px] border rounded-md p-2 bg-slate-50">
                    {newStops.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center mt-10">No stops added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {newStops.map((stop, i) => (
                          <div key={stop.id} className="flex items-center space-x-2 bg-white p-2 rounded border border-slate-100">
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                              {i + 1}
                            </span>
                            <Input 
                              value={stop.name} 
                              onChange={(e) => handleStopNameChange(stop.id, e.target.value)}
                              className="h-7 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                <Button onClick={saveRoute} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={newStops.length < 2 || !routeName}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Route
                </Button>
                <Button onClick={() => setIsCreating(false)} variant="ghost" className="w-full text-slate-500">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedRoute && !isCreating && (
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{selectedRoute.name} Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Distance</span>
                    <span className="font-medium text-slate-800">{selectedRoute.distance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Est. Time</span>
                    <span className="font-medium text-slate-800">{selectedRoute.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Stops</span>
                    <span className="font-medium text-slate-800">{selectedRoute.stops.length}</span>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Label>Stops</Label>
                    <div className="text-sm space-y-1">
                      {selectedRoute.stops.map(s => (
                        <div key={s.id} className="flex items-center text-slate-600">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
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
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm h-full flex flex-col">
            <CardContent className="p-1 flex-1 relative min-h-[500px]">
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
