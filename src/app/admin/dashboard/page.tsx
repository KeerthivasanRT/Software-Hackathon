'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, UserCircle, MessageSquareWarning, Droplet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const { buses, students, drivers, complaints, routes, attendances } = useDataStore();

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
    { title: 'Total Buses', value: buses.length, icon: Bus, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2', trendPositive: true, subtitle: `${activeBuses} active currently` },
    { title: 'Total Students', value: students.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%', trendPositive: true, subtitle: 'Registered in system' },
    { title: 'Total Drivers', value: drivers.length, icon: UserCircle, color: 'text-violet-600', bg: 'bg-violet-50', trend: 'Stable', trendPositive: true, subtitle: 'Ready for assignment' },
    { title: 'Pending Complaints', value: pendingComplaints, icon: MessageSquareWarning, color: 'text-red-600', bg: 'bg-red-50', trend: '-1', trendPositive: true, subtitle: 'Needs attention' },
    { title: 'Est. Daily Fuel', value: `${totalFuelRequired.toFixed(0)}L`, icon: Droplet, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+5%', trendPositive: false, subtitle: `Cost: ₹${totalFuelCost.toFixed(0)}` },
  ];

  const attendanceData = [
    { name: 'Mon', present: 120, absent: 5 },
    { name: 'Tue', present: 118, absent: 7 },
    { name: 'Wed', present: 122, absent: 3 },
    { name: 'Thu', present: 115, absent: 10 },
    { name: 'Fri', present: 125, absent: 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((stat, index) => (
          <Card key={index} className="border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-xs font-semibold ${stat.trendPositive ? 'text-emerald-600' : 'text-red-600'} bg-slate-50 px-2 py-1 rounded-md`}>
                  {stat.trendPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl">
          <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-slate-800">Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="present" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Present" maxBarSize={40} />
                  <Bar dataKey="absent" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Absent" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl">
          <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-slate-800">Complaints Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Area type="monotone" dataKey="absent" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAbsent)" name="Complaints" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
