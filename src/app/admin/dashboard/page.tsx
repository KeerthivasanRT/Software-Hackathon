'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, UserCircle, MessageSquareWarning, Droplet, ArrowUpRight, ArrowDownRight, Sparkles, Activity, AlertTriangle, PhoneCall, CheckCircle, Bell, Navigation, ShieldAlert, CreditCard, ClipboardCheck, CalendarDays } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const { buses, students, drivers, complaints, routes, emergencies, resolveEmergency, activities, notifications, feeRecords } = useDataStore();

  const activeEmergencies = emergencies.filter(e => e.status === 'active');
  const activeBuses = buses.filter(b => b.status === 'active').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  let totalFuelRequired = 0;
  const fuelPrice = 95;
  
  buses.forEach(bus => {
    if (bus.status === 'active' && bus.routeId) {
      const route = routes.find(r => r.id === bus.routeId);
      const distance = route?.distanceKm || 0;
      const mileage = bus.averageMileage || 5;
      if (mileage > 0) {
        totalFuelRequired += (distance / mileage);
      }
    }
  });

  const totalFuelCost = totalFuelRequired * fuelPrice;

  // TRANSPORT-RELATED STAT CARDS
  const statCards = [
    { title: 'Campus Fleet', value: buses.length, icon: Bus, color: 'text-[#005BAC]', bg: 'bg-[#005BAC]/10', border: 'border-[#005BAC]/20', trend: `${activeBuses} Active Buses`, subtitle: 'Fleet Status' },
    { title: 'Bus Routes', value: routes.length, icon: Navigation, color: 'text-[#1976D2]', bg: 'bg-[#1976D2]/10', border: 'border-[#1976D2]/20', trend: 'Active Routes', subtitle: 'Route Coverage' },
    { title: 'Boarding Students', value: students.length, icon: Users, color: 'text-[#005BAC]', bg: 'bg-[#005BAC]/10', border: 'border-[#005BAC]/20', trend: 'Pass Holders', subtitle: 'Student Registry' },
    { title: 'Campus Drivers', value: drivers.length, icon: UserCircle, color: 'text-[#1976D2]', bg: 'bg-[#1976D2]/10', border: 'border-[#1976D2]/20', trend: 'Assigned Drivers', subtitle: 'Verified Staff' },
    { title: 'Daily Fuel Refill', value: `${totalFuelRequired.toFixed(0)} L`, icon: Droplet, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', trend: `₹${totalFuelCost.toFixed(0)} Est.`, subtitle: 'Fuel Logs' },
    { title: 'Transport Fees', value: `₹${(feeRecords.reduce((acc, f) => acc + f.paidAmount, 0) / 1000).toFixed(0)}k`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', trend: 'Fees Collected', subtitle: 'Transport Billing' },
  ];

  const attendanceData = [
    { name: 'Mon', present: 120, absent: 5 },
    { name: 'Tue', present: 118, absent: 7 },
    { name: 'Wed', present: 122, absent: 3 },
    { name: 'Thu', present: 115, absent: 10 },
    { name: 'Fri', present: 125, absent: 0 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#D6EAF8] p-3 rounded-xl shadow-lg">
          <p className="font-extrabold text-[#005BAC] mb-1 text-xs">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs font-semibold">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
              <span className="text-[#005BAC] font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 pb-10">
      {/* HEADER BANNER WITH BIT BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#005BAC] to-[#1976D2] p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-extrabold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Bannari Amman Institute of Technology</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">BIT Transport Command Dashboard</h1>
          <p className="text-sky-100 mt-1 font-medium text-xs">Real-time bus tracking, student attendance, driver logs & campus telematics.</p>
        </div>
      </div>

      {/* EMERGENCY ALERT BANNER */}
      {activeEmergencies.length > 0 && (
        <div className="space-y-4">
          {activeEmergencies.map(emergency => {
            const isStudent = emergency.reportedBy === 'student';
            const driver = drivers.find(d => d.id === emergency.driverId);
            const student = students.find(s => s.id === emergency.studentId);
            const reporterName = isStudent ? student?.name : driver?.name;
            const reporterContact = isStudent ? student?.phone : driver?.phone;
            const bus = buses.find(b => b.id === emergency.busId);
            const route = routes.find(r => r.id === emergency.routeId);
            
            return (
              <Card key={emergency.id} className="border-red-400 bg-red-50 text-[#1E293B] rounded-2xl shadow-sm">
                <CardContent className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-red-600 text-white rounded-xl shrink-0 animate-bounce">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-red-700">🚨 EMERGENCY SOS ALERT: {emergency.id}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Reported by <strong className="text-slate-900">{reporterName}</strong> ({reporterContact}) • Bus: <strong className="text-slate-900">{bus?.busNumber}</strong> • Route: <strong className="text-slate-900">{route?.name}</strong>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => resolveEmergency(emergency.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs h-9 px-4 rounded-xl shadow-xs transition-all shrink-0"
                  >
                    Resolve Emergency
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 6 TRANSPORT-RELATED STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="bg-[#F8FCFF] border border-[#D6EAF8] rounded-2xl card-hover-effect">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{card.title}</span>
                  <h3 className="text-2xl font-extrabold text-[#005BAC]">{card.value}</h3>
                  <p className={`text-xs font-bold ${card.color}`}>{card.trend}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.color} ${card.border} border flex items-center justify-center font-bold shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CHARTS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2 bg-[#F8FCFF] border border-[#D6EAF8] rounded-2xl">
          <CardHeader className="bg-white/70 border-b border-[#D6EAF8] p-4">
            <CardTitle className="text-sm font-extrabold text-[#005BAC] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1976D2]" /> BIT Student Route Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresentBit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#005BAC" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1976D2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6EAF8" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="present" stroke="#005BAC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPresentBit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Stream */}
        <Card className="bg-[#F8FCFF] border border-[#D6EAF8] rounded-2xl">
          <CardHeader className="bg-white/70 border-b border-[#D6EAF8] p-4">
            <CardTitle className="text-sm font-extrabold text-[#005BAC] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1976D2]" /> Recent Campus Transport Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="p-3 bg-white border border-[#D6EAF8] rounded-xl flex items-start gap-2.5 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-[#005BAC] mt-1.5 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-[#1E293B] truncate">{act.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono block pt-0.5" suppressHydrationWarning>{new Date(act.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
