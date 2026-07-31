'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, UserCircle, MapPin, Percent, Bell, AlertTriangle } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isSosSent, setIsSosSent] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');

  const handleSosTrigger = () => {
    if (!user || !assignedBus || !route) return;
    
    triggerEmergency({
      id: `SOS-STU-${Math.floor(100 + Math.random() * 900)}`,
      reportedBy: 'student',
      studentId: user.id,
      busId: assignedBus.id,
      routeId: route.id,
      pickupPoint: pickupStop?.name || 'Unknown Location',
      emergencyType: emergencyType || 'Other',
      description,
      date: new Date().toISOString(),
      status: 'active'
    });
    
    addNotification({
      id: `notif-stu-emg-${Date.now()}`,
      title: '🚨 Student Emergency',
      message: `Student ${user.name} has reported a ${emergencyType || 'Safety Concern'} on ${route.name}.`,
      targetRole: 'admin',
      date: new Date().toISOString(),
      isRead: false
    });
    
    setIsSosSent(true);
    setTimeout(() => {
      setIsSosSent(false);
      setIsSosOpen(false);
      setEmergencyType('');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen pb-24">
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
        <DialogContent className="sm:max-w-md border-red-100 shadow-xl shadow-red-500/10 overflow-hidden p-0">
          <div className="h-2 bg-red-600" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600 font-bold text-xl">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Student Emergency
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium text-sm pt-2 leading-relaxed">
                Use this feature only during genuine emergencies. Your transport administrator will be notified immediately.
              </DialogDescription>
            </DialogHeader>

            {!isSosSent ? (
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Emergency Type <span className="text-red-500">*</span></label>
                  <select 
                    value={emergencyType} 
                    onChange={(e) => setEmergencyType(e.target.value)} 
                    className="w-full flex h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="" disabled>Select emergency type...</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Safety Concern">Safety Concern</option>
                    <option value="Missed Bus">Missed Bus</option>
                    <option value="Bus Did Not Arrive">Bus Did Not Arrive</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Lost Belongings">Lost Belongings</option>
                    <option value="Route Issue">Route Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your emergency..." 
                    className="w-full min-h-[100px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  />
                </div>
                
                {/* Auto-filled Info Preview */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium space-y-1.5">
                  <div className="flex justify-between"><span>Student:</span> <span className="text-slate-700 font-bold">{user?.name} ({studentRecord?.registerNumber || studentRecord?.studentId})</span></div>
                  <div className="flex justify-between"><span>Location:</span> <span className="text-slate-700 font-bold">{pickupStop?.name}</span></div>
                  <div className="flex justify-between"><span>Bus:</span> <span className="text-slate-700 font-bold">{assignedBus?.busNumber}</span></div>
                </div>

                <DialogFooter className="mt-4 sm:justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsSosOpen(false)} className="font-semibold">
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleSosTrigger} 
                    disabled={!emergencyType}
                    className="bg-red-600 hover:bg-red-700 font-bold shadow-md shadow-red-500/20 disabled:opacity-50"
                  >
                    Send Alert
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="mt-6 w-full py-8 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-emerald-600" />
                </div>
                Emergency Alert Sent Successfully.
                <span className="text-xs text-emerald-600/80 mt-2 font-medium">Administrator has been notified.</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
