'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Stop, Route } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Save, Route as RouteIcon, Navigation, AlertCircle, Bus as BusIcon, UserCircle, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function RoutesPage() {
  const { routes, buses, drivers, students } = useDataStore();
  
  // Default to first route if available, otherwise null
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(routes[0] || null);
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
  
  const getRouteDetails = (route: Route) => {
    const assignedBus = buses.find(b => b.routeId === route.id);
    const assignedDriver = assignedBus ? drivers.find(d => d.assignedBusId === assignedBus.id) : null;
    const assignedStudentsCount = students.filter(s => s.assignedRouteId === route.id).length;
    
    return { assignedBus, assignedDriver, assignedStudentsCount };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Route Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and create interactive bus routes.</p>
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
                <CardTitle className="text-lg font-bold text-slate-800">Predefined Routes</CardTitle>
                <CardDescription className="text-sm">Select a route to view its path on the map.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <ScrollArea className="h-[220px]">
                  <div className="space-y-2 pr-4">
                    {routes.map(route => (
                      <Button 
                        key={route.id} 
                        variant={selectedRoute?.id === route.id ? 'default' : 'outline'}
                        className={`w-full justify-start h-auto py-3 px-4 rounded-xl shadow-none font-semibold ${selectedRoute?.id === route.id ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                        onClick={() => { setSelectedRoute(route); setIsCreating(false); }}
                      >
                        <Navigation className={`w-5 h-5 mr-3 shrink-0 ${selectedRoute?.id === route.id ? 'text-blue-100' : 'text-slate-400'}`} />
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm">{route.name}</span>
                          <span className={`text-xs font-medium mt-0.5 ${selectedRoute?.id === route.id ? 'text-blue-200' : 'text-slate-400'}`}>
                            {route.distance} • {route.estimatedTime}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {routes.length === 0 && (
                    <div className="text-center py-6 text-slate-500 flex flex-col items-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                      <span className="text-sm">No routes found</span>
                    </div>
                  )}
                </ScrollArea>
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
            <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden flex flex-col h-full">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-bold text-slate-800">{selectedRoute.name}</CardTitle>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Distance</span>
                      <div className="font-bold text-slate-900">{selectedRoute.distance}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Est. Time</span>
                      <div className="font-bold text-slate-900">{selectedRoute.estimatedTime}</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                    {(() => {
                      const { assignedBus, assignedDriver, assignedStudentsCount } = getRouteDetails(selectedRoute);
                      return (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-slate-600 font-medium">
                              <BusIcon className="w-4 h-4 mr-2 text-blue-500" />
                              Assigned Bus
                            </div>
                            <span className="font-bold text-slate-900">{assignedBus ? assignedBus.busNumber : 'Unassigned'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-slate-600 font-medium">
                              <UserCircle className="w-4 h-4 mr-2 text-purple-500" />
                              Driver
                            </div>
                            <span className="font-bold text-slate-900">{assignedDriver ? assignedDriver.name : 'Unassigned'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-slate-600 font-medium">
                              <Users className="w-4 h-4 mr-2 text-emerald-500" />
                              Students
                            </div>
                            <span className="font-bold text-slate-900">{assignedStudentsCount} Enrolled</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="pt-2 space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops Sequence ({selectedRoute.stops.length})</Label>
                    </div>
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="text-sm space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                        {selectedRoute.stops.map((s, i) => (
                          <div key={s.id} className="relative flex flex-col text-slate-700 font-medium z-10 pl-8 pb-3">
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-[3px] border-white shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${i === 0 ? 'bg-emerald-500' : i === selectedRoute.stops.length - 1 ? 'bg-red-500' : 'bg-blue-500'}`}>
                              {i + 1}
                            </div>
                            <span className={i === 0 || i === selectedRoute.stops.length - 1 ? 'font-bold text-slate-900' : ''}>
                              {s.name}
                            </span>
                            {i === 0 && <span className="text-xs text-emerald-600 font-semibold mt-0.5">Origin</span>}
                            {i === selectedRoute.stops.length - 1 && <span className="text-xs text-red-600 font-semibold mt-0.5">Destination</span>}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Button variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50">Edit Route</Button>
                    <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 min-h-[600px] h-[calc(100vh-140px)]">
          <RouteMap 
            route={!isCreating && selectedRoute ? selectedRoute : undefined}
            stops={isCreating ? newStops : []}
            interactive={isCreating}
            onStopAdded={handleMapClick}
          />
        </div>
      </div>
    </div>
  );
}
