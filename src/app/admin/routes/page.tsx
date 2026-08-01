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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MapPin, Save, Route as RouteIcon, Navigation, AlertCircle, Bus as BusIcon, UserCircle, Users, Trash2, Edit2, ArrowUp, ArrowDown, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function RoutesPage() {
  const { routes, buses, drivers, students, addRoute, updateRoute, deleteRoute, updateDriver, updateBus } = useDataStore();
  
  // Default to first route if available, otherwise null
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(routes[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [newStops, setNewStops] = useState<Stop[]>([]);
  const [routeName, setRouteName] = useState('');
  
  // Edit & Delete Modals
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editAssignedDriverId, setEditAssignedDriverId] = useState<string>('');
  const [editAssignedBusId, setEditAssignedBusId] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');

  const handleMapClick = async (lat: number, lng: number) => {
    if (!isCreating) return;
    let locationName = `Stop ${newStops.length + 1}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'SmartTransportPortal/1.0' }
      });
      const data = await res.json();
      if (data && data.display_name) {
        locationName = data.display_name.split(',').slice(0, 2).join(',').trim();
      }
    } catch (err) {
      console.error(err);
    }
    const newStop: Stop = {
      id: `new-${Date.now()}`,
      name: locationName,
      latitude: lat,
      longitude: lng,
      order: newStops.length + 1,
    };
    setNewStops(prev => [...prev, newStop]);
  };

  const handleStopNameChange = (id: string, name: string) => {
    setNewStops(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  };

  const moveStopUp = (index: number) => {
    if (index === 0) return;
    const updated = [...newStops];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((s, i) => s.order = i + 1);
    setNewStops(updated);
  };

  const moveStopDown = (index: number) => {
    if (index === newStops.length - 1) return;
    const updated = [...newStops];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((s, i) => s.order = i + 1);
    setNewStops(updated);
  };

  const removeStop = (id: string) => {
    const updated = newStops.filter(s => s.id !== id);
    updated.forEach((s, i) => s.order = i + 1);
    setNewStops(updated);
  };

  const startCreating = () => {
    setSelectedRoute(null);
    setIsCreating(true);
    setNewStops([]);
    setRouteName('');
    setSaveError('');
  };

  const saveRoute = () => {
    setSaveError('');
    if (newStops.length < 2) {
      setSaveError("Please select at least an Origin and a Destination.");
      return;
    }
    if (!routeName) {
      setSaveError("Please provide a Route Name.");
      return;
    }
    const newRoute: Route = {
      id: `r${Date.now()}`,
      name: routeName,
      stops: newStops,
      distance: `${(newStops.length * 5).toFixed(1)} km`,
      distanceKm: newStops.length * 5,
      estimatedTime: `${newStops.length * 15} mins`,
    };
    addRoute(newRoute);
    setIsCreating(false);
    setSelectedRoute(newRoute);
  };
  
  const openEditDialog = (route: Route) => {
    setEditingRoute(JSON.parse(JSON.stringify(route)));
    const assignedDriver = drivers.find(d => d.assignedRouteId === route.id && d.status === 'active');
    const assignedBus = assignedDriver ? buses.find(b => b.id === assignedDriver.assignedBusId) : buses.find(b => b.routeId === route.id);
    setEditAssignedDriverId(assignedDriver?.id || '');
    setEditAssignedBusId(assignedBus?.id || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingRoute) {
      updateRoute(editingRoute);
      
      // Update driver and bus assignment
      if (editAssignedDriverId) {
        const driver = drivers.find(d => d.id === editAssignedDriverId);
        if (driver) updateDriver({ ...driver, assignedRouteId: editingRoute.id, assignedBusId: editAssignedBusId || driver.assignedBusId });
      }
      
      if (editAssignedBusId) {
        const bus = buses.find(b => b.id === editAssignedBusId);
        if (bus) updateBus({ ...bus, routeId: editingRoute.id, driverId: editAssignedDriverId || bus.driverId });
      }
      
      setIsEditDialogOpen(false);
      setSelectedRoute(editingRoute);
    }
  };

  const handleDelete = () => {
    if (selectedRoute) {
      deleteRoute(selectedRoute.id);
      setIsDeleteDialogOpen(false);
      setSelectedRoute(routes[0] || null);
    }
  };
  
  const getRouteDetails = (route: Route) => {
    const assignedDriver = drivers.find(d => d.assignedRouteId === route.id && d.status === 'active');
    const assignedBus = assignedDriver ? buses.find(b => b.id === assignedDriver.assignedBusId) : null;
    const assignedStudentsCount = students.filter(s => s.assignedRouteId === route.id).length;
    
    return { assignedBus, assignedDriver, assignedStudentsCount };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Route Management</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage and create interactive bus routes.</p>
        </div>
        <Button onClick={startCreating} className="bg-sky-600 hover:bg-sky-700 shadow-sm hover:shadow-md transition-all h-10 px-5 rounded-lg text-white font-medium">
          <RouteIcon className="w-4 h-4 mr-2" />
          Create New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {!isCreating ? (
            <Card className="border border-[#D6ECFA] border-t-4 border-t-sky-500 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/50 pb-4">
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
                        className={`w-full justify-start h-auto py-3 px-4 rounded-xl shadow-none font-semibold ${selectedRoute?.id === route.id ? 'bg-sky-600 text-white hover:bg-sky-700 border-transparent' : 'bg-white text-slate-600 hover:bg-sky-50 border-[#D6ECFA]'}`}
                        onClick={() => { setSelectedRoute(route); setIsCreating(false); }}
                      >
                        <Navigation className={`w-5 h-5 mr-3 shrink-0 ${selectedRoute?.id === route.id ? 'text-blue-100' : 'text-slate-600'}`} />
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm">{route.name}</span>
                          <span className={`text-xs font-medium mt-0.5 ${selectedRoute?.id === route.id ? 'text-blue-200' : 'text-slate-600'}`}>
                            {route.distance} • {route.estimatedTime}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {routes.length === 0 && (
                    <div className="text-center py-6 text-slate-600 flex flex-col items-center">
                      <AlertCircle className="w-8 h-8 text-slate-700 mb-2" />
                      <span className="text-sm">No routes found</span>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-sky-200 shadow-sm shadow-blue-100 bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/30 pb-4">
                <CardTitle className="text-sky-600 flex items-center text-lg font-bold">
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
                    className="h-11 rounded-lg border-[#D6ECFA] focus-visible:ring-sky-500/20"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops ({newStops.length})</Label>
                  <ScrollArea className="h-[240px] border border-[#D6ECFA] rounded-xl bg-sky-50 p-2">
                    {newStops.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-600 mt-10">
                        <MapPin className="w-8 h-8 text-slate-700 mb-2" />
                        <p className="text-sm font-medium">No stops added yet.</p>
                        <p className="text-xs mt-1">Click the map to add your first stop.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pr-2">
                        {newStops.map((stop, i) => (
                          <div key={stop.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#D6ECFA] shadow-sm">
                            <div className="flex items-center space-x-3 w-full">
                              <span className="text-xs font-bold bg-blue-100 text-sky-600 w-6 h-6 flex items-center justify-center rounded-full shrink-0">
                                {i + 1}
                              </span>
                              <div className="flex flex-col w-full">
                                <Input 
                                  value={stop.name} 
                                  onChange={(e) => handleStopNameChange(stop.id, e.target.value)}
                                  className="h-7 text-sm font-semibold border-transparent hover:border-[#D6ECFA] focus-visible:border-blue-500 focus-visible:ring-0 shadow-none px-1 py-0 bg-transparent"
                                />
                                <span className="text-[10px] text-slate-500 font-mono px-1">{stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-sky-600" onClick={() => moveStopUp(i)} disabled={i === 0}>
                                <ArrowUp className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-sky-600" onClick={() => moveStopDown(i)} disabled={i === newStops.length - 1}>
                                <ArrowDown className="w-3 h-3" />
                              </Button>
                              <div className="w-px h-3 bg-slate-200 mx-0.5" />
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-600" onClick={() => removeStop(stop.id)}>
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                <div className="space-y-3 pt-2">
                  {saveError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-lg flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                      {saveError}
                    </div>
                  )}
                  <Button onClick={saveRoute} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-11 font-semibold shadow-sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Route
                  </Button>
                  <Button onClick={() => setIsCreating(false)} variant="ghost" className="w-full text-slate-600 hover:text-slate-700 hover:bg-white rounded-lg h-11 font-medium">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedRoute && !isCreating && (
            <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden flex flex-col h-full">
              <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/50 pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-bold text-slate-800">{selectedRoute.name}</CardTitle>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Distance</span>
                      <div className="font-bold text-slate-900">{selectedRoute.distance}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Est. Time</span>
                      <div className="font-bold text-slate-900">{selectedRoute.estimatedTime}</div>
                    </div>
                  </div>
                  
                  <div className="bg-sky-50 rounded-xl p-4 border border-[#D6ECFA] space-y-4">
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
                      <div className="text-sm space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-sky-100">
                        {selectedRoute.stops.map((s, i) => (
                          <div key={s.id} className="relative flex flex-col text-slate-700 font-medium z-10 pl-8 pb-3">
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-[3px] border-white shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${i === 0 ? 'bg-emerald-500' : i === selectedRoute.stops.length - 1 ? 'bg-red-500' : 'bg-sky-500'}`}>
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
                  
                  <div className="flex gap-2 pt-2 border-t border-[#D6ECFA]">
                    <Button variant="outline" onClick={() => openEditDialog(selectedRoute)} className="flex-1 text-sky-600 border-sky-200 hover:bg-sky-50">
                      <Edit2 className="w-4 h-4 mr-2" /> Edit Route
                    </Button>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)} className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
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

      {/* Edit Route Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl border-[#D6ECFA] shadow-xl p-0 overflow-hidden">
          <div className="bg-sky-600 h-2" />
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center">
                <Edit2 className="w-5 h-5 mr-2 text-sky-600" />
                Edit Route Details
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium">
                Modify the route parameters and assignments below. Changes will sync immediately.
              </DialogDescription>
            </DialogHeader>
            
            {editingRoute && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Route Name</Label>
                    <Input 
                      value={editingRoute.name} 
                      onChange={e => setEditingRoute({...editingRoute, name: e.target.value})} 
                      className="h-10 bg-sky-50/50 border-[#D6ECFA]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Est. Distance</Label>
                      <Input 
                        value={editingRoute.distance} 
                        onChange={e => setEditingRoute({...editingRoute, distance: e.target.value})} 
                        className="h-10 bg-sky-50/50 border-[#D6ECFA]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Est. Time</Label>
                      <Input 
                        value={editingRoute.estimatedTime} 
                        onChange={e => setEditingRoute({...editingRoute, estimatedTime: e.target.value})} 
                        className="h-10 bg-sky-50/50 border-[#D6ECFA]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Origin</Label>
                    <Input 
                      value={editingRoute.stops[0]?.name || ''} 
                      onChange={e => {
                        const newStops = [...editingRoute.stops];
                        if (newStops[0]) newStops[0].name = e.target.value;
                        setEditingRoute({...editingRoute, stops: newStops});
                      }} 
                      className="h-10 bg-sky-50/50 border-[#D6ECFA]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Destination</Label>
                    <Input 
                      value={editingRoute.stops[editingRoute.stops.length - 1]?.name || ''} 
                      onChange={e => {
                        const newStops = [...editingRoute.stops];
                        if (newStops.length > 0) newStops[newStops.length - 1].name = e.target.value;
                        setEditingRoute({...editingRoute, stops: newStops});
                      }} 
                      className="h-10 bg-sky-50/50 border-[#D6ECFA]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-sky-50 border border-[#D6ECFA] rounded-xl">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Assignments</h4>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center">
                          <BusIcon className="w-3 h-3 mr-1" /> Assigned Bus
                        </Label>
                        <select 
                          value={editAssignedBusId} 
                          onChange={e => setEditAssignedBusId(e.target.value)} 
                          className="w-full h-10 rounded-md border border-[#D6ECFA] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="">No Bus Assigned</option>
                          {buses.map(bus => (
                            <option key={bus.id} value={bus.id}>{bus.busNumber} ({bus.registrationNumber})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center">
                          <UserCircle className="w-3 h-3 mr-1" /> Assigned Driver
                        </Label>
                        <select 
                          value={editAssignedDriverId} 
                          onChange={e => setEditAssignedDriverId(e.target.value)} 
                          className="w-full h-10 rounded-md border border-[#D6ECFA] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="">No Driver Assigned</option>
                          {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>{driver.name} ({driver.employeeId})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Intermediate Stops</Label>
                    <ScrollArea className="h-32 border border-[#D6ECFA] rounded-xl bg-white p-2">
                      <div className="space-y-2">
                        {editingRoute.stops.slice(1, -1).map((stop, i) => (
                          <div key={stop.id} className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-400 w-4">{i + 2}.</span>
                            <Input 
                              value={stop.name} 
                              onChange={(e) => {
                                const newStops = [...editingRoute.stops];
                                newStops[i + 1].name = e.target.value;
                                setEditingRoute({...editingRoute, stops: newStops});
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                        ))}
                        {editingRoute.stops.length <= 2 && (
                          <div className="text-xs text-slate-500 text-center py-2">No intermediate stops.</div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="mt-8 pt-6 border-t border-[#D6ECFA]">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="font-semibold">Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-sky-600 hover:bg-sky-700 font-bold px-6 shadow-md shadow-blue-500/20">
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-red-100 shadow-xl shadow-red-500/10 p-0 overflow-hidden">
          <div className="bg-red-600 h-2" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600 font-bold text-xl">
                Delete Route
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium text-base pt-2">
                Are you sure you want to delete this route? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="font-semibold">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} className="font-bold bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20">
                Delete
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
