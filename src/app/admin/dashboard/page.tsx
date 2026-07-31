'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, UserCircle, MessageSquareWarning, Droplet, ArrowUpRight, ArrowDownRight, Sparkles, Activity } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const { buses, students, drivers, complaints, routes } = useDataStore();

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
    { title: 'Total Fleet', value: buses.length, icon: Bus, gradient: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20', trend: '+2', trendPositive: true, subtitle: `${activeBuses} active currently` },
    { title: 'Total Students', value: students.length, icon: Users, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20', trend: '+12%', trendPositive: true, subtitle: 'Registered in system' },
    { title: 'Active Drivers', value: drivers.length, icon: UserCircle, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20', trend: 'Stable', trendPositive: true, subtitle: 'Ready for assignment' },
    { title: 'Pending Issues', value: pendingComplaints, icon: MessageSquareWarning, gradient: 'from-rose-500 to-red-600', shadow: 'shadow-rose-500/20', trend: '-1', trendPositive: true, subtitle: 'Needs attention' },
    { title: 'Est. Daily Fuel', value: `${totalFuelRequired.toFixed(0)}L`, icon: Droplet, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', trend: '+5%', trendPositive: false, subtitle: `Cost: ₹${totalFuelCost.toFixed(0)}` },
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
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 p-4 rounded-xl shadow-xl shadow-slate-200/50">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 shadow-sm backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Command Center</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Here's what's happening with your transport fleet today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((stat, index) => (
          <Card key={index} className="group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.trendPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</h3>
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                <p className="text-xs font-medium text-slate-400 mt-2">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="border-b border-slate-100/50 pb-5 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Weekly Attendance
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1 font-medium">Student presence over the last 5 days</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                  <Tooltip cursor={{fill: '#f8fafc', rx: 8}} content={<CustomTooltip />} />
                  <Bar dataKey="present" fill="#3b82f6" radius={[6, 6, 6, 6]} name="Present" />
                  <Bar dataKey="absent" fill="#e2e8f0" radius={[6, 6, 6, 6]} name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-slate-100/50 pb-5 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareWarning className="w-5 h-5 text-purple-500" />
                  Complaints Trend
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1 font-medium">Issue reports over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="absent" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorAbsent)" name="Complaints" activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
