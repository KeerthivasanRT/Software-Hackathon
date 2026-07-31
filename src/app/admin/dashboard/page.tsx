'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, UserCircle, MessageSquareWarning, Droplet, ArrowUpRight, ArrowDownRight, Sparkles, Activity, AlertTriangle, PhoneCall, CheckCircle } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const { buses, students, drivers, complaints, routes, emergencies, resolveEmergency } = useDataStore();

  const activeEmergencies = emergencies.filter(e => e.status === 'active');

  const activeBuses = buses.filter(b => b.status === 'active').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

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

  const statCards = [
    { title: 'Total Fleet', value: buses.length, icon: Bus, color: 'text-sky-600', bg: 'bg-sky-50', shadow: 'shadow-sky-500/10', border: 'border-sky-100', trend: '+2', trendPositive: true, subtitle: `${activeBuses} active currently` },
    { title: 'Total Students', value: students.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', shadow: 'shadow-indigo-500/10', border: 'border-indigo-100', trend: '+12%', trendPositive: true, subtitle: 'Registered in system' },
    { title: 'Active Drivers', value: drivers.length, icon: UserCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', shadow: 'shadow-emerald-500/10', border: 'border-emerald-100', trend: 'Stable', trendPositive: true, subtitle: 'Ready for assignment' },
    { title: 'Pending Issues', value: pendingComplaints, icon: MessageSquareWarning, color: 'text-amber-600', bg: 'bg-amber-50', shadow: 'shadow-amber-500/10', border: 'border-amber-100', trend: '-1', trendPositive: true, subtitle: 'Needs attention' },
    { title: 'Est. Daily Fuel', value: `${totalFuelRequired.toFixed(0)}L`, icon: Droplet, color: 'text-orange-600', bg: 'bg-orange-50', shadow: 'shadow-orange-500/10', border: 'border-orange-100', trend: '+5%', trendPositive: false, subtitle: `Cost: ₹${totalFuelCost.toFixed(0)}` },
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
        <div className="bg-white/95 backdrop-blur-md border border-[#D6ECFA] p-4 rounded-xl shadow-xl shadow-sky-500/10">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
              <span className="text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#D6ECFA] shadow-sm shadow-sky-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-xs font-semibold mb-3 shadow-sm shadow-sky-500/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Command Center</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-600 mt-2 font-medium text-lg">Here's what's happening with your transport fleet today.</p>
        </div>
      </div>

      {activeEmergencies.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          {activeEmergencies.map(emergency => {
            const isStudent = emergency.reportedBy === 'student';
            const driver = drivers.find(d => d.id === emergency.driverId);
            const student = students.find(s => s.id === emergency.studentId);
            const reporterName = isStudent ? student?.name : driver?.name;
            const reporterRoleLabel = isStudent ? 'Student' : 'Driver';
            const reporterContact = isStudent ? student?.phone : driver?.phone;
            
            const bus = buses.find(b => b.id === emergency.busId);
            const route = routes.find(r => r.id === emergency.routeId);
            const time = new Date(emergency.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <Card key={emergency.id} className="border-red-500 shadow-lg shadow-red-500/20 bg-gradient-to-r from-red-600 to-rose-600 text-white overflow-hidden relative">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <CardContent className="p-6 relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-full animate-pulse">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold tracking-tight">ACTIVE EMERGENCY</h2>
                        <span className="bg-red-900/50 text-red-100 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">High Priority</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mt-4">
                        <div>
                          <p className="text-red-200 text-xs font-semibold uppercase tracking-wider">{reporterRoleLabel}</p>
                          <p className="font-bold text-lg leading-tight">{reporterName || 'Unknown'}</p>
                          {isStudent && <p className="text-red-200 text-xs mt-0.5">{student?.registerNumber}</p>}
                        </div>
                        {isStudent ? (
                          <div>
                            <p className="text-red-200 text-xs font-semibold uppercase tracking-wider">Emergency Type</p>
                            <p className="font-bold text-lg leading-tight">{emergency.emergencyType}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-red-200 text-xs font-semibold uppercase tracking-wider">Bus</p>
                            <p className="font-bold text-lg leading-tight">{bus?.busNumber || 'Unknown'}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-red-200 text-xs font-semibold uppercase tracking-wider">Location</p>
                          <p className="font-bold text-lg truncate max-w-[200px] leading-tight">{emergency.pickupPoint}</p>
                          {isStudent && <p className="text-red-200 text-xs mt-0.5 truncate">{bus?.busNumber} • {route?.name}</p>}
                        </div>
                        <div>
                          <p className="text-red-200 text-xs font-semibold uppercase tracking-wider">Time</p>
                          <p className="font-bold text-lg">{time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none bg-white text-red-600 border border-red-200 hover:bg-red-50 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors flex items-center justify-center">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Contact {reporterRoleLabel}
                    </button>
                    <button 
                      onClick={() => resolveEmergency(emergency.id, 'Admin acknowledged and handled the emergency alert.', 'Dispatched support team')}
                      className="flex-1 lg:flex-none bg-red-700/50 hover:bg-red-700 text-white border border-red-500/50 font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((stat, index) => (
          <Card key={index} className="group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm border ${stat.border} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {stat.trendPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{stat.title}</h3>
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                <p className="text-xs font-medium text-slate-500 mt-2">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="border-b border-[#D6ECFA] pb-5 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-500" />
                  Weekly Attendance
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1 font-medium">Student presence over the last 5 days</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                  <Tooltip cursor={{fill: '#f1f5f9', rx: 8}} content={<CustomTooltip />} />
                  <Bar dataKey="present" fill="#0ea5e9" radius={[6, 6, 6, 6]} name="Present" />
                  <Bar dataKey="absent" fill="#94a3b8" radius={[6, 6, 6, 6]} name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-[#D6ECFA] pb-5 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareWarning className="w-5 h-5 text-amber-500" />
                  Complaints Trend
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1 font-medium">Issue reports over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="absent" stroke="#38bdf8" strokeWidth={4} fillOpacity={1} fill="url(#colorAbsent)" name="Complaints" activeDot={{ r: 8, strokeWidth: 0, fill: '#38bdf8' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
