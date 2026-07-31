'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, UserCircle, MapPin, Percent, Bell } from 'lucide-react';
import { useDataStore } from '@/lib/store';

export default function StudentDashboard() {
  const { user, buses, drivers, routes, notifications, attendances } = useDataStore();
  
  const studentRecord = user as any; 
  const assignedBus = buses.find(b => b.id === studentRecord?.assignedBusId) || buses[0];
  const driver = drivers.find(d => d.id === assignedBus?.driverId);
  const route = routes.find(r => r.id === assignedBus?.routeId) || routes[0];
  const pickupStop = route?.stops.find(s => s.id === studentRecord?.pickupStopId) || route?.stops[0];
  
  const filteredNotifications = notifications.filter(n => n.targetRole === 'student' || n.targetRole === 'all');

  const studentAttendances = attendances.filter(a => a.studentId === user?.id);
  const totalDays = studentAttendances.length;
  const presentDays = studentAttendances.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Welcome, {user?.name || 'Student'}. Here is your transport information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-none shadow-md bg-slate-900 text-white rounded-2xl overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <Bus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-slate-400 font-medium text-sm mb-1">Assigned Bus</h3>
            <div className="text-3xl font-bold tracking-tight text-white">{assignedBus?.busNumber || 'None'}</div>
            <p className="text-sm text-slate-400 mt-1">{assignedBus?.registrationNumber || 'Not assigned'}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-violet-50 rounded-xl group-hover:scale-110 transition-transform">
                <UserCircle className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Driver Details</h3>
            <div className="text-xl font-bold text-slate-900 tracking-tight truncate">{driver?.name || 'Unassigned'}</div>
            <p className="text-sm text-slate-500 mt-1">{driver?.phone || 'No contact'}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Pickup Point</h3>
            <div className="text-lg font-bold text-slate-900 tracking-tight truncate" title={pickupStop?.name}>{pickupStop?.name || 'None'}</div>
            <p className="text-sm text-slate-500 mt-1 truncate" title={route?.name}>{route?.name || 'No Route'}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Attendance</h3>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{attendancePercentage}%</div>
            <p className="text-sm text-slate-500 mt-1">This semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl">
          <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-600" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-900">{notification.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">{notification.message}</p>
                  <span className="text-xs font-medium text-slate-400 mt-3 block">{new Date(notification.date).toLocaleDateString('en-US')}</span>
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="p-8 text-center text-slate-500">No announcements.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
