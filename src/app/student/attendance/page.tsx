'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Percent, Calendar, CheckCircle2, XCircle, AlertCircle, Clock, Award, Navigation, Bus as BusIcon, TrendingUp, Filter, Sparkles } from 'lucide-react';

export default function StudentAttendancePage() {
  const { user, attendances, students, routes, buses, drivers } = useDataStore();

  const studentAttendances = attendances
    .filter(a => a.studentId === (user?.role === 'student' ? user.id : 'st1'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalDays = studentAttendances.length || 20;
  const presentDays = studentAttendances.filter(a => a.status === 'present').length || 18;
  const lateDays = studentAttendances.filter(a => a.status === 'late').length || 1;
  const absentDays = studentAttendances.filter(a => a.status === 'absent').length || 1;
  
  const totalAttended = presentDays + lateDays;
  const attendancePercentage = Math.round((totalAttended / totalDays) * 100);

  // Grade calculation
  const getGrade = (pct: number) => {
    if (pct >= 95) return { grade: 'Grade A+', label: 'Exemplary Transit Pass Holder', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (pct >= 85) return { grade: 'Grade A', label: 'Consistent Passenger', color: 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30' };
    if (pct >= 75) return { grade: 'Grade B', label: 'Satisfactory Attendance', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { grade: 'Grade C', label: 'Low Attendance Warning', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  const gradeInfo = getGrade(attendancePercentage);

  // Current student info
  const studentObj = students.find(s => s.id === (user?.role === 'student' ? user.id : 'st1')) || students[0];
  const assignedRoute = routes.find(r => r.id === studentObj?.assignedRouteId) || routes[0];
  const assignedBus = buses.find(b => b.id === studentObj?.assignedBusId) || buses[0];
  const assignedDriver = drivers.find(d => d.id === assignedBus?.driverId) || drivers[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = studentAttendances.find(a => a.date.startsWith(todayStr));

  // Monthly Breakdown Data
  const monthlyStats = [
    { month: 'August 2026', total: 20, present: 19, pct: 95 },
    { month: 'July 2026', total: 22, present: 21, pct: 95 },
    { month: 'June 2026', total: 18, present: 18, pct: 100 },
    { month: 'May 2026', total: 21, present: 20, pct: 95 },
  ];

  // Weekly Mon-Fri Data
  const weeklyDays = [
    { day: 'Mon', date: '28 Jul', status: 'present', time: '07:42 AM' },
    { day: 'Tue', date: '29 Jul', status: 'present', time: '07:40 AM' },
    { day: 'Wed', date: '30 Jul', status: 'late', time: '07:55 AM' },
    { day: 'Thu', date: '31 Jul', status: 'present', time: '07:41 AM' },
    { day: 'Fri', date: '01 Aug', status: todayAttendance?.status || 'present', time: '07:44 AM' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0F192D] via-[#091829] to-[#07111F] p-6 rounded-[24px] border border-white/10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D9FF]">Executive Attendance Center</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-0.5">Transport Attendance Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Detailed tracking for {studentObj.name} ({studentObj.registerNumber}) • {assignedRoute.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs px-3.5 py-1.5 font-bold">
            <BusIcon className="w-3.5 h-3.5 mr-1.5 text-[#00D9FF]" /> {assignedBus.busNumber}
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs px-3.5 py-1.5 font-bold">
            <Navigation className="w-3.5 h-3.5 mr-1.5 text-[#4F7CFF]" /> {assignedRoute.name}
          </Badge>
        </div>
      </div>

      {/* TODAY'S STATUS BANNER */}
      <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden card-hover-effect">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${
                !todayAttendance ? 'bg-white/10 text-[#00D9FF]' : 
                todayAttendance.status === 'present' ? 'bg-emerald-500/20 text-emerald-400' : 
                todayAttendance.status === 'late' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {!todayAttendance ? <Clock className="w-8 h-8" /> : 
                 todayAttendance.status === 'present' ? <CheckCircle2 className="w-8 h-8" /> : 
                 todayAttendance.status === 'late' ? <AlertCircle className="w-8 h-8" /> :
                 <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Verification</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Today's Boarding Status</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {todayAttendance ? (
                <Badge className={`px-6 py-2 text-sm font-bold shadow-sm capitalize rounded-xl ${
                  todayAttendance.status === 'present' ? 'bg-emerald-600 text-white' : 
                  todayAttendance.status === 'late' ? 'bg-amber-500 text-white' : 
                  'bg-red-600 text-white'
                }`}>
                  Check-in: {todayAttendance.status.toUpperCase()}
                </Badge>
              ) : (
                <Badge variant="outline" className="px-6 py-2 text-sm font-bold bg-white/10 text-white border-white/20 rounded-xl">
                  Not Checked In Yet
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6 EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Overall Attendance */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-3xl font-extrabold tracking-tight ${attendancePercentage < 75 ? 'text-red-400' : 'text-[#00D9FF]'}`}>
                  {attendancePercentage}%
                </h3>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +2%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Cumulative Academic Pass</p>
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

        {/* Card 2: Days Present */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Present</span>
              <h3 className="text-3xl font-extrabold text-emerald-400">{presentDays} Days</h3>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Boardings
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Days Absent */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Absent</span>
              <h3 className="text-3xl font-extrabold text-red-400">{absentDays} Day</h3>
              <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Missed Boardings
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold shadow-sm">
              <XCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Late Arrivals */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Late Arrivals</span>
              <h3 className="text-3xl font-extrabold text-amber-400">{lateDays} Day</h3>
              <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Delayed Boardings
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Route Attendance */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Route Attendance</span>
              <h3 className="text-2xl font-extrabold text-white truncate">{assignedRoute.name}</h3>
              <p className="text-xs text-[#00D9FF] font-semibold flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> 95% Route Average
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] flex items-center justify-center font-bold shadow-sm">
              <Navigation className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Attendance Grade */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rating</span>
              <h3 className="text-2xl font-extrabold text-emerald-400">{gradeInfo.grade}</h3>
              <p className="text-xs text-emerald-400 font-medium">{gradeInfo.label}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MONTHLY & WEEKLY ATTENDANCE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Attendance Chart Progress */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px]">
          <CardHeader className="bg-white/5 border-b border-white/5 p-5">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00D9FF]" /> Monthly Attendance Progress Chart
            </CardTitle>
            <CardDescription className="text-xs">Historical transport attendance performance by academic month.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {monthlyStats.map(m => (
              <div key={m.month} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{m.month}</span>
                  <span className="text-slate-400">{m.present} / {m.total} Days ({m.pct}%)</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-[#00D9FF] to-[#4F7CFF] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00D9FF]" 
                    style={{ width: `${m.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Mon-Fri Overview */}
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px]">
          <CardHeader className="bg-white/5 border-b border-white/5 p-5">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F7CFF]" /> Current Week Attendance Overview
            </CardTitle>
            <CardDescription className="text-xs">Daily check-in verification log for Monday through Friday.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {weeklyDays.map(w => (
                <div 
                  key={w.day}
                  className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                    w.status === 'present' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    w.status === 'late' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <span className="text-xs font-bold uppercase block text-white">{w.day}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">{w.date}</span>
                  <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 ${
                    w.status === 'present' ? 'bg-emerald-600 text-white' :
                    w.status === 'late' ? 'bg-amber-500 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {w.status}
                  </Badge>
                  <span className="text-[10px] text-slate-400 block font-mono">{w.time}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Primary Bus: <strong className="text-[#00D9FF]">{assignedBus.busNumber}</strong></span>
              <span>Driver: <strong className="text-[#00D9FF]">{assignedDriver.name}</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ATTENDANCE HISTORY TABLE WITH COMPLETE DETAILS */}
      <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/5 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-white">Transport Attendance Verification Log</CardTitle>
            <CardDescription className="text-xs">Detailed audit history including board date, check-in time, bus, driver, and status.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check-In Time</TableHead>
                <TableHead>Bus Number</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead>Route Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentAttendances.map((att) => (
                <TableRow key={att.id}>
                  <TableCell className="font-bold text-white">{new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                  <TableCell className="font-mono text-xs font-bold text-[#00D9FF]">{(att as any).time || '07:42 AM'}</TableCell>
                  <TableCell className="font-bold text-slate-200">{assignedBus.busNumber}</TableCell>
                  <TableCell className="text-slate-300">{assignedDriver.name}</TableCell>
                  <TableCell className="text-slate-400 text-xs font-semibold">{assignedRoute.name}</TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] uppercase px-3 py-1 font-bold ${
                      att.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      att.status === 'late' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {att.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {studentAttendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
