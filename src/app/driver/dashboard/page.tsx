'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, MapPin, Bell, Droplet, ArrowRight } from 'lucide-react';
import { useDataStore } from '@/lib/store';

export default function DriverDashboard() {
  const { user, buses, routes, students, notifications } = useDataStore();
  
  const assignedBus = buses.find(b => b.driverId === user?.id) || buses[0];
  const route = routes.find(r => r.id === assignedBus?.routeId) || routes[0];
  const assignedStudents = students.filter(s => s.assignedBusId === assignedBus?.id).length;
  
  const filteredNotifications = notifications.filter(n => n.targetRole === 'driver' || n.targetRole === 'all');

  const distanceKm = route?.distanceKm || 0;
  const mileage = assignedBus?.averageMileage || 5;
  const fuelPrice = 95;
  const fuelRequired = mileage > 0 ? (distanceKm / mileage).toFixed(1) : '0';
  const fuelCost = mileage > 0 ? ((distanceKm / mileage) * fuelPrice).toFixed(0) : '0';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    </div>
  );
}
