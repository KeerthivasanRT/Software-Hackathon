'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, MapPin, Bell, Droplet } from 'lucide-react';
import { useDataStore } from '@/lib/store';

export default function DriverDashboard() {
  const { user, buses, routes, students, notifications } = useDataStore();
  
  const driverRecord = user; // In a real app we'd fetch Driver profile
  const assignedBus = buses.find(b => b.driverId === user?.id) || buses[0];
  const route = routes.find(r => r.id === assignedBus?.routeId) || routes[0];
  const assignedStudents = students.filter(s => s.assignedBusId === assignedBus?.id).length;
  
  const filteredNotifications = notifications.filter(n => n.targetRole === 'driver' || n.targetRole === 'all');

  // Fuel Calculator
  const distanceKm = route?.distanceKm || 0;
  const mileage = assignedBus?.averageMileage || 5;
  const fuelPrice = 95; // Rs/L
  const fuelRequired = mileage > 0 ? (distanceKm / mileage).toFixed(1) : '0';
  const fuelCost = mileage > 0 ? ((distanceKm / mileage) * fuelPrice).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Driver Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name || 'Driver'}. Here's your route info for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100 flex items-center">
              <Bus className="w-4 h-4 mr-2" />
              Assigned Bus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignedBus?.busNumber || 'None'}</div>
            <p className="text-sm text-blue-100 mt-1">{assignedBus?.registrationNumber}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              Today's Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">{route?.name || 'None'}</div>
            <p className="text-sm text-slate-500 mt-1">{route?.stops.length || 0} stops • {route?.distance}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Users className="w-4 h-4 mr-2 text-violet-600" />
              Student Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{assignedStudents}</div>
            <p className="text-sm text-slate-500 mt-1">Assigned to your bus</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-orange-50 border border-orange-100 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center">
              <Droplet className="w-4 h-4 mr-2 text-orange-600" />
              Est. Fuel Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{fuelRequired} L</div>
            <p className="text-sm text-orange-600 mt-1">Cost: ₹{fuelCost} (@ ₹{fuelPrice}/L)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-slate-600" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="p-4 rounded-lg border border-slate-100 bg-white shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800">{notification.title}</h4>
                    {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </div>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <span className="text-xs text-slate-400 mt-2">{new Date(notification.date).toLocaleDateString()}</span>
                </div>
              ))}
              {filteredNotifications.length === 0 && <p className="text-slate-500">No notifications.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
