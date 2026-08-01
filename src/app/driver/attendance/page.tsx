'use client';

import { useState, useEffect } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarCheck, MapPin, Users, Check, AlertCircle, Save, Percent, CheckCircle2, XCircle, Clock, Award, Navigation, Bus as BusIcon, TrendingUp } from 'lucide-react';
import { AttendanceStatus, Stop } from '@/types';

export default function DriverAttendancePage() {
  const { user, buses, routes, students, attendances, markMultipleAttendances, drivers } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStopId, setExpandedStopId] = useState<string | null>(null);
  
  // Local state for attendance before submission
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentDriverId = user?.role === 'driver' ? user.id : 'd1';
  const currentDriver = drivers.find(d => d.id === currentDriverId) || drivers[0];
  const assignedBus = buses.find(b => b.driverId === currentDriver?.id) || buses[0];
  const assignedRoute = routes.find(r => r.id === assignedBus?.routeId) || routes[0];
  const assignedStudents = students.filter(s => s.assignedBusId === assignedBus?.id);
  
  const assignedBusId = assignedBus?.id;
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const initial: Record<string, AttendanceStatus> = {};
    const currentAssignedStudents = students.filter(s => s.assignedBusId === assignedBusId);
    currentAssignedStudents.forEach(s => {
      const todayAtt = attendances.find(a => a.studentId === s.id && a.date.startsWith(todayStr));
      if (todayAtt) {
        initial[s.id] = todayAtt.status;
      }
    });
    setLocalAttendance(initial);
  }, [assignedBusId, students, attendances, todayStr]);

  const filteredStops = assignedRoute.stops.filter(stop => 
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentsForStop = (stopId: string) => {
    return assignedStudents.filter(s => s.pickupStopId === stopId);
  };

  const getStopStats = (stopId: string) => {
    const stopStudents = getStudentsForStop(stopId);
    const total = stopStudents.length;
    let present = 0, late = 0, absent = 0, pending = 0;
    
    stopStudents.forEach(s => {
      const status = localAttendance[s.id];
      if (status === 'present') present++;
      else if (status === 'late') late++;
      else if (status === 'absent') absent++;
      else pending++;
    });

    return { total, present, late, absent, pending };
  };

  const handleMarkStudent = (studentId: string, status: AttendanceStatus) => {
    setLocalAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBulkAction = (stopId: string, action: 'present' | 'absent' | 'reset') => {
    const stopStudents = getStudentsForStop(stopId);
    setLocalAttendance(prev => {
      const next = { ...prev };
      stopStudents.forEach(s => {
        if (action === 'reset') {
          delete next[s.id];
        } else {
          next[s.id] = action;
        }
      });
      return next;
    });
  };

  const handleSubmitAttendance = () => {
    const newAttendances = Object.entries(localAttendance).map(([studentId, status]) => ({
      id: `a-${Date.now()}-${studentId}`,
      studentId,
      busId: assignedBus.id,
      date: new Date().toISOString(),
      status
    }));

    markMultipleAttendances(newAttendances);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  // Metrics
  const totalAssigned = assignedStudents.length || 45;
  const markedPresent = Object.values(localAttendance).filter(s => s === 'present').length;
  const markedLate = Object.values(localAttendance).filter(s => s === 'late').length;
  const markedAbsent = Object.values(localAttendance).filter(s => s === 'absent').length;
  const totalAttended = markedPresent + markedLate;
  const attendancePercentage = totalAssigned > 0 ? Math.round((totalAttended / totalAssigned) * 100) : 95;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0F192D] via-[#091829] to-[#07111F] p-6 rounded-[24px] border border-white/10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D9FF]">Bus Driver Operations</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-0.5">Passenger Transit Attendance</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Verify student boarding at stops for {assignedRoute.name} ({assignedBus.busNumber})</p>
        </div>

        <Button 
          onClick={handleSubmitAttendance}
          className="bg-gradient-to-r from-[#00D9FF] to-[#4F7CFF] text-[#07111F] hover:opacity-90 font-extrabold h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] gap-2"
        >
          <Save className="w-4 h-4" /> Save Attendance
        </Button>
      </div>

      {isSubmitted && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 flex items-center justify-between animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Attendance recorded and synchronized with Admin & Student portals!
          </div>
          <Badge className="bg-emerald-600 text-white font-bold">SAVED</Badge>
        </div>
      )}

      {/* 6 EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Overall Bus Attendance */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Bus Rate</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-[#00D9FF]">{attendancePercentage}%</h3>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> High
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Passenger Boarding Ratio</p>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="26" 
                  stroke="#00D9FF" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="163" 
                  strokeDashoffset={163 - (163 * attendancePercentage) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <Percent className="w-5 h-5 text-[#00D9FF] absolute" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Assigned */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Roster</span>
              <h3 className="text-3xl font-extrabold text-white">{totalAssigned} Students</h3>
              <p className="text-xs text-[#00D9FF] font-medium">{assignedBus.busNumber} Capacity: {assignedBus.capacity}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] flex items-center justify-center font-bold shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Boarded Present */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Boarded Present</span>
              <h3 className="text-3xl font-extrabold text-emerald-400">{markedPresent} Students</h3>
              <p className="text-xs text-emerald-400 font-medium">Checked-in at stops</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Absent */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent / Unmarked</span>
              <h3 className="text-3xl font-extrabold text-red-400">{markedAbsent} Students</h3>
              <p className="text-xs text-red-400 font-medium">Not on bus</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold shadow-sm">
              <XCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Route */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Route</span>
              <h3 className="text-2xl font-extrabold text-white truncate">{assignedRoute.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{assignedRoute.stops.length} Pickup Stops</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] flex items-center justify-center font-bold shadow-sm">
              <Navigation className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Efficiency Grade */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Efficiency</span>
              <h3 className="text-2xl font-extrabold text-emerald-400">Grade A+</h3>
              <p className="text-xs text-emerald-400 font-medium">Exemplary On-time Transit</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STOP-BY-STOP ATTENDANCE MARKING ROSTER */}
      <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/5 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-white">Route Pickup Stop Roster</CardTitle>
            <CardDescription className="text-xs">Expand each stop to mark student passenger check-in statuses.</CardDescription>
          </div>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search Stop Name..." 
              className="pl-9 h-10 border-white/10 bg-[#07111F]/80 text-sm text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {filteredStops.map((stop, idx) => {
            const stopStudents = getStudentsForStop(stop.id);
            const stats = getStopStats(stop.id);
            const isExpanded = expandedStopId === stop.id || idx === 0;

            return (
              <div key={stop.id} className="border border-white/10 rounded-2xl overflow-hidden transition-all bg-white/5">
                <div 
                  onClick={() => setExpandedStopId(isExpanded ? null : stop.id)}
                  className="p-4 bg-white/5 hover:bg-white/10 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#00D9FF] text-[#07111F] font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_#00D9FF]">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base">{stop.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">Scheduled Time: {(stop as any).time || '07:30 AM'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/30">{stats.present} Present</span>
                      <span className="text-red-400 bg-red-500/20 px-2.5 py-1 rounded-md border border-red-500/30">{stats.absent} Absent</span>
                    </div>

                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleBulkAction(stop.id, 'present'); }} className="h-8 text-xs text-emerald-400 hover:bg-emerald-500/20 font-bold">
                        Mark All Present
                      </Button>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleBulkAction(stop.id, 'reset'); }} className="h-8 text-xs text-slate-400 hover:bg-white/10">
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-white/5 divide-y divide-white/5">
                    {stopStudents.map(student => {
                      const currentStatus = localAttendance[student.id];

                      return (
                        <div key={student.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-white/10">
                              <AvatarFallback className="bg-[#00D9FF]/20 text-[#00D9FF] font-bold text-xs">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h5 className="font-bold text-white text-sm">{student.name}</h5>
                              <p className="text-xs font-mono text-slate-400">{student.registerNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleMarkStudent(student.id, 'present')}
                              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all ${
                                currentStatus === 'present' 
                                  ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]' 
                                  : 'bg-white/5 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Present
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleMarkStudent(student.id, 'absent')}
                              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all ${
                                currentStatus === 'absent' 
                                  ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]' 
                                  : 'bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-400'
                              }`}
                            >
                              Absent
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {stopStudents.length === 0 && (
                      <p className="text-center text-xs text-slate-500 py-4">No students assigned to this pickup stop.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
