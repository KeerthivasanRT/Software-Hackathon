'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, UserCircle, MapPin, Percent, Bell } from 'lucide-react';
import { useDataStore } from '@/lib/store';

export default function StudentDashboard() {
  const { user, buses, drivers, routes, notifications, attendances } = useDataStore();
  
  const studentRecord = user as any; // Cast for now, but in reality we'd look up the Student profile
  const assignedBus = buses.find(b => b.id === studentRecord?.assignedBusId) || buses[0];
  const driver = drivers.find(d => d.id === assignedBus?.driverId);
  const route = routes.find(r => r.id === assignedBus?.routeId) || routes[0];
  
  // Look up pickup stop by ID if exists, otherwise first stop
  const pickupStop = route?.stops.find(s => s.id === studentRecord?.pickupStopId) || route?.stops[0];
  
  const filteredNotifications = notifications.filter(n => n.targetRole === 'student' || n.targetRole === 'all');

  // Calculate dynamic attendance
  const studentAttendances = attendances.filter(a => a.studentId === user?.id);
  const totalDays = studentAttendances.length;
  const presentDays = studentAttendances.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome, {user?.name || 'Student'}. Here is your transport information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100 flex items-center">
              <Bus className="w-4 h-4 mr-2" />
              Assigned Bus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignedBus?.busNumber || 'None'}</div>
            <p className="text-sm text-blue-100 mt-1">{assignedBus?.registrationNumber || 'Not assigned'}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <UserCircle className="w-4 h-4 mr-2 text-violet-600" />
              Driver Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-800">{driver?.name || 'Unassigned'}</div>
            <p className="text-sm text-slate-500 mt-1">{driver?.phone || 'No contact'}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              Pickup Point
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-800 truncate" title={pickupStop?.name}>{pickupStop?.name || 'None'}</div>
            <p className="text-sm text-slate-500 mt-1 truncate" title={route?.name}>{route?.name || 'No Route'}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Percent className="w-4 h-4 mr-2 text-orange-600" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{attendancePercentage}%</div>
            <p className="text-sm text-slate-500 mt-1">This semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-slate-600" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="p-4 rounded-lg border border-slate-100 bg-white shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800">{notification.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <span className="text-xs text-slate-400 mt-2">{new Date(notification.date).toLocaleDateString()}</span>
                </div>
              ))}
              {filteredNotifications.length === 0 && <p className="text-slate-500">No announcements.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
