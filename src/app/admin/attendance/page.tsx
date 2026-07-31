'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, CalendarCheck, AlertCircle, UserCircle, Filter, X } from 'lucide-react';
import { AttendanceStatus } from '@/types';

export default function AdminAttendancePage() {
  const { attendances, students, buses, routes, drivers } = useDataStore();
  
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterRoute, setFilterRoute] = useState('');
  const [filterBus, setFilterBus] = useState('');
  const [filterPickupPoint, setFilterPickupPoint] = useState('');
  const [filterDriver, setFilterDriver] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | ''>('');
  
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique options for filters
  const departments = Array.from(new Set(students.map(s => s.department))).filter(Boolean);
  const years = Array.from(new Set(students.map(s => s.year))).filter(Boolean);
  
  // For pickup points, gather all stops from all routes
  const allStops = routes.flatMap(r => r.stops);

  const filteredAttendances = attendances.filter(a => {
    const student = students.find(s => s.id === a.studentId);
    const bus = buses.find(b => b.id === a.busId);
    
    // Search Term (Name or ID)
    const matchesSearch = student && (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!matchesSearch) return false;
    
    // Advanced Filters
    if (filterDate && !a.date.startsWith(filterDate)) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    
    if (student) {
      if (filterDepartment && student.department !== filterDepartment) return false;
      if (filterYear && student.year !== filterYear) return false;
      if (filterRoute && student.assignedRouteId !== filterRoute) return false;
      if (filterPickupPoint && student.pickupStopId !== filterPickupPoint) return false;
    }
    
    if (bus) {
      if (filterBus && bus.id !== filterBus) return false;
      if (filterDriver && bus.driverId !== filterDriver) return false;
    }

    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const resetFilters = () => {
    setFilterDate('');
    setFilterRoute('');
    setFilterBus('');
    setFilterPickupPoint('');
    setFilterDriver('');
    setFilterDepartment('');
    setFilterYear('');
    setFilterStatus('');
    setSearchTerm('');
  };

  const activeFiltersCount = [filterDate, filterRoute, filterBus, filterPickupPoint, filterDriver, filterDepartment, filterYear, filterStatus].filter(Boolean).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Attendance</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor transport attendance across all routes.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={`font-semibold shadow-sm rounded-xl h-10 px-4 transition-colors ${showFilters || activeFiltersCount > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-700 border-slate-200'}`}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card className="border border-blue-100 shadow-sm shadow-blue-50/50 bg-white rounded-2xl animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Filter Attendance</h3>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-slate-500 hover:text-red-600 h-8">
                  <X className="w-3 h-3 mr-1" /> Clear All Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Date</label>
                <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="h-10 rounded-lg text-sm bg-slate-50 border-slate-200" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as AttendanceStatus)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Route</label>
                <select value={filterRoute} onChange={e => setFilterRoute(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Routes</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Bus</label>
                <select value={filterBus} onChange={e => setFilterBus(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Buses</option>
                  {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Pickup Point</label>
                <select value={filterPickupPoint} onChange={e => setFilterPickupPoint(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Pickup Points</option>
                  {allStops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Driver</label>
                <select value={filterDriver} onChange={e => setFilterDriver(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Drivers</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Department</label>
                <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Year</label>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <option value="">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search by student name or ID..." 
                className="pl-10 h-10 bg-slate-50/50 border-slate-200/60 rounded-xl text-sm focus-visible:ring-blue-500/20 focus-visible:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-11 px-6">Date</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Student</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Bus & Route</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Pickup Point</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((record) => {
                const student = students.find(s => s.id === record.studentId);
                const bus = buses.find(b => b.id === record.busId);
                const route = routes.find(r => r.id === bus?.routeId);
                const stop = route?.stops.find(s => s.id === student?.pickupStopId);
                
                return (
                  <TableRow key={record.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-700 text-sm">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <UserCircle className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm tracking-tight">{student?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{student?.studentId} • {student?.department} • {student?.year}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-slate-700">{bus?.busNumber || 'Unknown'}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{route?.name || 'Unknown Route'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-slate-700">{stop?.name || 'Unknown Stop'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'present' ? 'default' : record.status === 'late' ? 'secondary' : record.status === 'leave' ? 'outline' : 'destructive'} 
                        className={
                          record.status === 'present' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 shadow-none font-semibold px-2.5 py-0.5 capitalize' : 
                          record.status === 'late' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 shadow-none font-semibold px-2.5 py-0.5 capitalize' : 
                          record.status === 'leave' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 shadow-none font-semibold px-2.5 py-0.5 capitalize' : 
                          'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60 shadow-none font-semibold px-2.5 py-0.5 capitalize'
                        }>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAttendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No attendance records found</p>
                      <p className="text-sm">Try adjusting your filters.</p>
                    </div>
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
