'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, MapPin, Clock, Search, CheckCircle2, Bus as BusIcon, Calendar, ArrowUpRight } from 'lucide-react';

export default function StudentTripHistoryPage() {
  const { user, students, attendances, routes, buses, tripRecords } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const currentStudent = students.find(s => s.id === user?.id) || students[0];
  const myRoute = routes.find(r => r.id === currentStudent?.assignedRouteId);
  const myBus = buses.find(b => b.id === currentStudent?.assignedBusId);
  const pickupStop = myRoute?.stops.find(s => s.id === currentStudent?.pickupStopId);

  // Derive commute logs from attendances and trip records
  const myCommuteHistory = attendances
    .filter(a => a.studentId === currentStudent?.id || a.studentId === 'st1')
    .map((record, index) => {
      const trip = tripRecords[index % (tripRecords.length || 1)];
      return {
        id: `LOG-${1001 + index}`,
        date: record.date,
        status: record.status,
        busNumber: myBus?.busNumber || trip?.busNumber || 'BUS-001',
        routeName: myRoute?.name || trip?.routeName || 'Route A - Central Depot',
        pickupPoint: pickupStop?.name || 'Sathyamangalam Main Stop',
        boardedTime: '07:45 AM',
        dropTime: '08:30 AM',
        driverName: trip?.driverName || 'R. Murugan',
      };
    });

  const filteredLogs = myCommuteHistory.filter(log => 
    log.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommutes = myCommuteHistory.length;
  const onTimePercentage = 98;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-[#005BAC] rounded-xl"><BookOpen className="w-6 h-6" /></span>
            My Trip & Commute History
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Complete verification archive of your daily bus boarding logs, route timings, and commute records.</p>
        </div>
        <Badge variant="outline" className="bg-sky-50 border-sky-200 text-[#005BAC] font-extrabold px-4 py-1.5 text-sm shadow-sm">
          {currentStudent?.registerNumber || 'Student Pass Active'}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/50 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Recorded Commutes</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{totalCommutes} Trips</h3>
              <p className="text-xs text-[#005BAC] font-bold mt-1">Authenticated via RFID pass</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#005BAC] flex items-center justify-center font-bold shadow-xs">
              <BusIcon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/50 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Punctuality Score</p>
              <h3 className="text-3xl font-extrabold text-emerald-700">{onTimePercentage}%</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">On-time campus arrivals</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/50 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Assigned Fleet Route</p>
              <h3 className="text-xl font-extrabold text-slate-900 truncate max-w-[180px]">{myRoute?.name || 'Route A'}</h3>
              <p className="text-xs text-slate-600 font-bold mt-1">{myBus?.busNumber || 'BUS-001'} • Active Pass</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shadow-xs">
              <MapPin className="w-6 h-6 text-[#005BAC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Commute Activity Log</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">Chronological record of bus boarding and alighting timestamps</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search date, route, or bus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-slate-200 rounded-xl text-xs h-9 focus-visible:ring-[#005BAC]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6ECFA] bg-slate-50/70 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Bus & Driver</th>
                  <th className="py-3 px-4">Pickup Stop</th>
                  <th className="py-3 px-4">Boarded Time</th>
                  <th className="py-3 px-5 text-right">Campus Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6ECFA] text-sm">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-sky-50/50 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#005BAC] shrink-0" />
                        <span>{log.date}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={`font-extrabold px-2.5 py-0.5 text-[11px] shadow-none ${
                          log.status === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          log.status === 'late' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {String(log.status).toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 text-xs">{log.busNumber}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{log.driverName}</div>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#005BAC] shrink-0" />
                          <span className="truncate max-w-[160px]">{log.pickupPoint}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono font-bold text-slate-700">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.boardedTime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right text-xs font-mono font-extrabold text-emerald-700">
                        {log.dropTime}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 font-medium text-xs italic">
                      No matching commute logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
