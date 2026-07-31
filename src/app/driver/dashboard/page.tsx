'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, MapPin, Bell, Droplet, AlertTriangle } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DriverDashboard() {
  const { user, buses, routes, students, notifications, triggerEmergency, addNotification, drivers } = useDataStore();
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isSosSent, setIsSosSent] = useState(false);
  
  const driverProfile = drivers.find(d => d.id === user?.id);
  const assignedBus = buses.find(b => b.id === driverProfile?.assignedBusId) || buses[0];
  const route = routes.find(r => r.id === driverProfile?.assignedRouteId) || routes[0];
  const assignedStudents = students.filter(s => s.assignedBusId === assignedBus?.id).length;
  
  const filteredNotifications = notifications.filter(n => n.targetRole === 'driver' || n.targetRole === 'all');

  const distanceKm = route?.distanceKm || 0;
  const mileage = assignedBus?.averageMileage || 5;
  const fuelPrice = 95;
  const fuelRequired = mileage > 0 ? (distanceKm / mileage).toFixed(1) : '0';
  const fuelCost = mileage > 0 ? ((distanceKm / mileage) * fuelPrice).toFixed(0) : '0';

  const handleSosTrigger = () => {
    if (!user || !assignedBus || !route) return;
    
    // Pick the first stop for demo purposes if route has stops
    const pickupPoint = route.stops.length > 0 ? route.stops[0].name : 'Unknown Location';
    
    triggerEmergency({
      id: `emg-${Date.now()}`,
      driverId: user.id,
      busId: assignedBus.id,
      routeId: route.id,
      pickupPoint,
      date: new Date().toISOString(),
      status: 'active'
    });
    
    addNotification({
      id: `notif-emg-${Date.now()}`,
      title: '🚨 Emergency Alert',
      message: `Driver ${user.name} has reported an emergency on ${route.name}.`,
      targetRole: 'admin',
      date: new Date().toISOString(),
      isRead: false
    });
    
    setIsSosSent(true);
    setTimeout(() => {
      setIsSosSent(false);
      setIsSosOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen pb-24">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Driver Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Welcome back, {user?.name || 'Driver'}. Here's your route info for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-none shadow-md bg-blue-600 text-white rounded-2xl overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <Bus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-blue-100 font-medium text-sm mb-1">Assigned Bus</h3>
            <div className="text-3xl font-bold tracking-tight">{assignedBus?.busNumber || 'None'}</div>
            <p className="text-sm text-blue-200 mt-1">{assignedBus?.registrationNumber}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Today's Route</h3>
            <div className="text-2xl font-bold text-slate-900 tracking-tight truncate">{route?.name || 'None'}</div>
            <p className="text-sm text-slate-500 mt-1">{route?.stops.length || 0} stops • {route?.distance}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-violet-50 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Student Count</h3>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{assignedStudents}</div>
            <p className="text-sm text-slate-500 mt-1">Assigned to your bus</p>
          </CardContent>
        </Card>

        <Card className="border border-orange-100 shadow-sm bg-orange-50/50 rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                <Droplet className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-orange-800/70 font-medium text-sm mb-1">Est. Fuel Required</h3>
            <div className="text-3xl font-bold text-orange-900 tracking-tight">{fuelRequired} L</div>
            <p className="text-sm text-orange-800/80 mt-1">Cost: ₹{fuelCost} (@ ₹{fuelPrice}/L)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6 bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              Route Details & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Origin</p>
                  <p className="font-bold text-slate-900 text-lg mt-0.5">{route?.stops[0]?.name || 'N/A'}</p>
                </div>
                <div className="text-slate-300">→</div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</p>
                  <p className="font-bold text-slate-900 text-lg mt-0.5">{route?.stops[route.stops.length - 1]?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pickup Points</p>
                <div className="flex flex-wrap gap-2">
                  {route?.stops.slice(1, -1).map(stop => (
                    <span key={stop.id} className="bg-slate-100 text-slate-700 font-medium text-sm px-3 py-1 rounded-full border border-slate-200/60">
                      {stop.name}
                    </span>
                  ))}
                  {route?.stops.length <= 2 && <span className="text-sm text-slate-500 italic">No intermediate pickup points.</span>}
                </div>
              </div>

              <div className="pt-2">
                <Link href="/driver/attendance">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md shadow-blue-500/20">
                    <Users className="w-5 h-5 mr-2" /> Start Taking Attendance
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl">
          <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-600" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-900">{notification.title}</h4>
                    {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">{notification.message}</p>
                  <span className="text-xs font-medium text-slate-400 mt-3 block">{new Date(notification.date).toLocaleDateString('en-US')}</span>
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="p-8 text-center text-slate-500">No recent notifications.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in zoom-in duration-500 delay-300">
        <button 
          onClick={() => setIsSosOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 md:px-6 md:py-4 flex items-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <AlertTriangle className="w-6 h-6 md:mr-2 animate-pulse group-hover:animate-none" />
            <div className="absolute inset-0 rounded-full ring-4 ring-red-500 opacity-50 animate-ping group-hover:animate-none"></div>
          </div>
          <span className="hidden md:inline font-bold tracking-wide">Emergency SOS</span>
        </button>
      </div>

      {/* SOS Confirmation Dialog */}
      <Dialog open={isSosOpen} onOpenChange={setIsSosOpen}>
        <DialogContent className="sm:max-w-md border-red-100 shadow-xl shadow-red-500/10">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600 font-bold text-xl">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Emergency Alert
            </DialogTitle>
            <DialogDescription className="text-slate-600 font-medium text-base pt-2 leading-relaxed">
              Are you sure you want to send an emergency alert to the Transport Administrator? This should only be used for genuine emergencies.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between mt-4">
            {isSosSent ? (
              <div className="w-full py-2 px-4 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-center flex items-center justify-center animate-in fade-in">
                Emergency Alert Sent Successfully
              </div>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setIsSosOpen(false)} className="font-semibold">
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleSosTrigger} className="bg-red-600 hover:bg-red-700 font-bold shadow-md shadow-red-500/20">
                  Send Emergency Alert
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
