'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, UserCircle, MessageSquareWarning, Droplet } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const { buses, students, drivers, complaints, routes, attendances } = useDataStore();

  const activeBuses = buses.filter(b => b.status === 'active').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

  // Calculate total fuel required and cost for today
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
    { title: 'Total Buses', value: buses.length, icon: Bus, color: 'text-blue-600', bg: 'bg-blue-100', subtitle: `${activeBuses} active currently` },
    { title: 'Total Students', value: students.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100', subtitle: 'Registered in system' },
    { title: 'Total Drivers', value: drivers.length, icon: UserCircle, color: 'text-violet-600', bg: 'bg-violet-100', subtitle: 'Ready for assignment' },
    { title: 'Pending Complaints', value: pendingComplaints, icon: MessageSquareWarning, color: 'text-red-600', bg: 'bg-red-100', subtitle: 'Needs attention' },
    { title: 'Est. Daily Fuel', value: `${totalFuelRequired.toFixed(1)} L`, icon: Droplet, color: 'text-orange-600', bg: 'bg-orange-100', subtitle: `Cost: ₹${totalFuelCost.toFixed(0)}` },
  ];

  // Mock chart data - in reality derived from `attendances`
  const attendanceData = [
    { name: 'Mon', present: 120, absent: 5 },
    { name: 'Tue', present: 118, absent: 7 },
    { name: 'Wed', present: 122, absent: 3 },
    { name: 'Thu', present: 115, absent: 10 },
    { name: 'Fri', present: 125, absent: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Complaints Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="absent" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Complaints" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
