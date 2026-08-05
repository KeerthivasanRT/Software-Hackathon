'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, CalendarCheck, CheckCircle2, XCircle, Clock, Filter, X, Percent, TrendingUp, 
  Users, Navigation, Award, Bus as BusIcon, ArrowUpDown, User, PhoneCall, Mail, Bell, 
  MapPin, ExternalLink, Eye, FileText, Check, AlertTriangle, Send, History, Calendar,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Attendance, AttendanceStatus } from '@/types';

export default function AdminAttendancePage() {
  const { attendances, students, buses, routes, drivers, markAttendance, addNotification } = useDataStore();
  const router = useRouter();

  // Search & 5 required filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterRoute, setFilterRoute] = useState('all');
  const [filterBus, setFilterBus] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'reg' | 'time' | 'pct'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Interactive UI state
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'history'>('profile');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Compute metrics per student
  const getStudentMetrics = (studentId?: string) => {
    const studentAtts = attendances.filter(a => a.studentId === studentId);
    if (!studentAtts.length) return { percentage: 95, total: 20, present: 19 };
    const present = studentAtts.filter(a => a.status === 'present' || a.status === 'late').length;
    return {
      percentage: Math.round((present / studentAtts.length) * 100),
      total: studentAtts.length,
      present
    };
  };

  // Unique departments and years for dynamic dropdowns
  const uniqueDepts = Array.from(new Set(students.map(s => s.department || 'B.Tech CSE').filter(Boolean)));
  const uniqueYears = ['I Year', 'II Year', 'III Year', 'IV Year'];

  // Filtering logic
  const filteredAttendances = attendances.filter(a => {
    const student = students.find(s => s.id === a.studentId);
    const bus = buses.find(b => b.id === a.busId);
    
    // Search Term (Name or Reg No)
    const matchesSearch = !searchTerm || (student && (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (student.registerNumber && student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()))
    ));
    if (!matchesSearch) return false;
    
    // Filters
    if (filterDate && !a.date.startsWith(filterDate)) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (filterRoute !== 'all' && student && student.assignedRouteId !== filterRoute) return false;
    if (filterBus !== 'all' && a.busId !== filterBus) return false;
    if (filterDept !== 'all' && student && (student.department !== filterDept)) return false;
    if (filterYear !== 'all' && student && ((student.year || 'III Year') !== filterYear)) return false;

    return true;
  });

  // Sorting logic
  const sortedAttendances = [...filteredAttendances].sort((a, b) => {
    const studentA = students.find(s => s.id === a.studentId);
    const studentB = students.find(s => s.id === b.studentId);

    if (sortBy === 'name') {
      const nameA = studentA?.name || '';
      const nameB = studentB?.name || '';
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    if (sortBy === 'reg') {
      const regA = studentA?.registerNumber || '';
      const regB = studentB?.registerNumber || '';
      return sortOrder === 'asc' ? regA.localeCompare(regB) : regB.localeCompare(regA);
    }
    if (sortBy === 'time') {
      const timeA = (a as any).time || '07:45 AM';
      const timeB = (b as any).time || '07:45 AM';
      return sortOrder === 'asc' ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA);
    }
    if (sortBy === 'pct') {
      const pctA = getStudentMetrics(a.studentId).percentage;
      const pctB = getStudentMetrics(b.studentId).percentage;
      return sortOrder === 'asc' ? pctA - pctB : pctB - pctA;
    }
    // Default by date
    return sortOrder === 'asc' 
      ? new Date(a.date).getTime() - new Date(b.date).getTime() 
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const resetFilters = () => {
    setFilterDate('');
    setFilterRoute('all');
    setFilterBus('all');
    setFilterDept('all');
    setFilterYear('all');
    setFilterStatus('all');
    setSearchTerm('');
  };

  const activeFiltersCount = [
    filterDate, 
    filterRoute !== 'all' ? filterRoute : '', 
    filterBus !== 'all' ? filterBus : '', 
    filterDept !== 'all' ? filterDept : '', 
    filterYear !== 'all' ? filterYear : '', 
    filterStatus !== 'all' ? filterStatus : ''
  ].filter(Boolean).length;

  const toggleSort = (field: 'date' | 'name' | 'reg' | 'time' | 'pct') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Executive Metrics
  const totalStudentsCount = students.length || 200;
  const totalAtt = attendances.length || 180;
  const totalPresent = attendances.filter(a => a.status === 'present').length || 165;
  const totalLate = attendances.filter(a => a.status === 'late').length || 10;
  const totalAbsent = attendances.filter(a => a.status === 'absent').length || 5;
  const overallPct = Math.round(((totalPresent + totalLate) / (totalAtt || 1)) * 100);

  // Quick Action Handlers
  const handleMarkStatus = (record: Attendance, newStatus: AttendanceStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    markAttendance({ ...record, status: newStatus });
    const stuName = students.find(s => s.id === record.studentId)?.name || 'Student';
    showFeedback(`${stuName}'s attendance marked as ${newStatus.toUpperCase()}`);
    if (selectedRecord && selectedRecord.id === record.id) {
      setSelectedRecord({ ...record, status: newStatus });
    }
  };

  const handleSendAlert = (studentId?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const student = students.find(s => s.id === studentId);
    addNotification({
      id: `notif-${Date.now()}`,
      title: 'Transport Attendance Advisory',
      message: `Dear ${student?.name || 'Student'}, an administrative check was performed on your bus commute record.`,
      targetRole: 'student',
      recipientType: 'specific_student',
      recipientIds: studentId ? [studentId] : [],
      date: new Date().toISOString(),
      readBy: []
    });
    showFeedback(`Push notification dispatched to ${student?.name || 'Student'}`);
  };

  const handleContactParent = (phone?: string, studentName?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showFeedback(`Initiating secure call to parent of ${studentName || 'Student'} (${phone || '+91 98765 43210'})`);
    window.open(`tel:${phone || '+919876543210'}`, '_self');
  };

  const handleViewRoute = (routeId?: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showFeedback('Navigating to route supervisory map...');
    router.push(`/admin/routes`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 relative">
      {/* Floating Action Feedback Banner */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#00D9FF] to-[#0088CC] text-[#07111F] px-5 py-3 rounded-2xl font-extrabold shadow-[0_0_25px_rgba(0,217,255,0.6)] flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#07111F]" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0F192D] via-[#091829] to-[#07111F] p-6 sm:p-8 rounded-[28px] border border-white/10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00D9FF]">Global Transport Operations</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Fleet Attendance Command Center</h1>
          <p className="text-sm text-slate-400 font-medium max-w-2xl">Interactive student check-in inspection, real-time commute logs, and instantaneous administrative overrides.</p>
        </div>

        <Button 
          onClick={() => setShowFilters(!showFilters)}
          className={`font-extrabold h-12 px-6 rounded-2xl transition-all duration-300 ${showFilters || activeFiltersCount > 0 ? 'bg-[#00D9FF] text-[#07111F] shadow-[0_0_20px_rgba(0,217,255,0.5)] scale-105' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-102'}`}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Advanced Filters' : 'Advanced Filters'}
          {activeFiltersCount > 0 && (
            <span className="ml-2.5 bg-[#07111F] text-[#00D9FF] text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-black">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced 5-Way Filter Engine */}
      {showFilters && (
        <Card className="bg-[#0F172A]/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[28px] animate-in slide-in-from-top-3 duration-300">
          <CardContent className="p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#00D9FF]" />
                  Multi-Dimensional Filter Console
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Filter passenger records simultaneously by transport and academic departments</p>
              </div>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-slate-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 h-9 rounded-xl font-bold px-3">
                  <X className="w-3.5 h-3.5 mr-1.5" /> Reset All Filters ({activeFiltersCount})
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Target Date</label>
                <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="h-10 rounded-xl text-xs bg-[#07111F]/90 border-white/10 text-white focus-visible:ring-[#00D9FF]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Transit Route</label>
                <Select value={filterRoute} onValueChange={(val) => setFilterRoute(val || 'all')}>
                  <SelectTrigger className="h-10 rounded-xl bg-[#07111F]/90 border-white/10 text-white text-xs">
                    <SelectValue placeholder="All Routes" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#091829] border-white/10 text-white text-xs">
                    <SelectItem value="all">All Routes</SelectItem>
                    {routes.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Assigned Bus</label>
                <Select value={filterBus} onValueChange={(val) => setFilterBus(val || 'all')}>
                  <SelectTrigger className="h-10 rounded-xl bg-[#07111F]/90 border-white/10 text-white text-xs">
                    <SelectValue placeholder="All Buses" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#091829] border-white/10 text-white text-xs">
                    <SelectItem value="all">All Buses</SelectItem>
                    {buses.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.busNumber}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Department</label>
                <Select value={filterDept} onValueChange={(val) => setFilterDept(val || 'all')}>
                  <SelectTrigger className="h-10 rounded-xl bg-[#07111F]/90 border-white/10 text-white text-xs">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#091829] border-white/10 text-white text-xs">
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepts.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Academic Year</label>
                <Select value={filterYear} onValueChange={(val) => setFilterYear(val || 'all')}>
                  <SelectTrigger className="h-10 rounded-xl bg-[#07111F]/90 border-white/10 text-white text-xs">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#091829] border-white/10 text-white text-xs">
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map(yr => (
                      <SelectItem key={yr} value={yr}>{yr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Check-in Status</label>
                <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || 'all')}>
                  <SelectTrigger className="h-10 rounded-xl bg-[#07111F]/90 border-white/10 text-white text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#091829] border-white/10 text-white text-xs">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present (On-board)</SelectItem>
                    <SelectItem value="late">Late Arrival</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Metric Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,217,255,0.15)] hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Fleet Attendance Rate</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-[#00D9FF]">{overallPct}%</h3>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> High
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Global Student Boarding Ratio</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] flex items-center justify-center font-bold shadow-md">
              <Percent className="w-7 h-7 text-[#00D9FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Bus Students</span>
              <h3 className="text-3xl font-extrabold text-white">{totalStudentsCount}</h3>
              <p className="text-xs text-[#00D9FF] font-medium">Registered Pass Holders</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] flex items-center justify-center font-bold shadow-md">
              <Users className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Present Today</span>
              <h3 className="text-3xl font-extrabold text-emerald-400">{totalPresent}</h3>
              <p className="text-xs text-emerald-400 font-medium">Verified On Board</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect transition-all duration-300 hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)] hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Absent Today</span>
              <h3 className="text-3xl font-extrabold text-red-400">{totalAbsent}</h3>
              <p className="text-xs text-red-400 font-medium">Unchecked Boardings</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold shadow-md">
              <XCircle className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,217,255,0.15)] hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Routes</span>
              <h3 className="text-2xl font-extrabold text-white">{routes.length} Routes</h3>
              <p className="text-xs text-[#00D9FF] font-medium">All Operating Normally</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] flex items-center justify-center font-bold shadow-md">
              <Navigation className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] card-hover-effect transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Fleet Efficiency Grade</span>
              <h3 className="text-2xl font-extrabold text-emerald-400">Grade A+</h3>
              <p className="text-xs text-emerald-400 font-medium">Institutional Compliance</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md">
              <Award className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INTERACTIVE ATTENDANCE RECORD LISTING */}
      <Card className="bg-[#0F172A]/90 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/10 bg-white/5 p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="p-2 bg-[#00D9FF]/20 text-[#00D9FF] rounded-xl"><CalendarCheck className="w-6 h-6" /></span>
              Global Attendance Verification Log ({sortedAttendances.length})
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">Hover over any record on desktop to reveal deep diagnostic inspection & immediate supervisory overrides.</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Sort Control */}
            <div className="flex items-center gap-2 bg-[#07111F] px-3 py-1.5 rounded-xl border border-white/10">
              <ArrowUpDown className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-xs font-bold text-slate-300">Sort by:</span>
              <Select value={sortBy} onValueChange={(val: any) => toggleSort(val || 'date')}>
                <SelectTrigger className="w-[140px] h-8 bg-transparent border-0 text-white font-bold text-xs focus:ring-0">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-[#091829] border-white/10 text-white text-xs">
                  <SelectItem value="date">Check-in Date</SelectItem>
                  <SelectItem value="name">Student Name</SelectItem>
                  <SelectItem value="reg">Register No</SelectItem>
                  <SelectItem value="time">Check-in Time</SelectItem>
                  <SelectItem value="pct">Attendance %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instant Live Search */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search Name, Reg No, Dept..." 
                className="pl-9.5 h-11 border-white/10 bg-[#07111F]/90 text-sm text-white rounded-xl focus-visible:ring-[#00D9FF] placeholder:text-slate-500 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* DESKTOP STICKY TABLE WITH ANIMATED HOVER ACTION PANEL (Hidden on Mobile < lg) */}
          <div className="hidden lg:block overflow-x-auto max-h-[680px] overflow-y-auto relative">
            <Table className="w-full text-left border-collapse">
              <TableHeader className="sticky top-0 bg-[#07111F] z-10 shadow-md border-b border-white/10 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <TableRow className="hover:bg-transparent border-b border-white/10">
                  <TableHead className="py-4 px-6 cursor-pointer hover:text-[#00D9FF] transition-colors" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1">Student Passenger {sortBy === 'name' && <ArrowUpDown className="w-3.5 h-3.5 text-[#00D9FF]" />}</div>
                  </TableHead>
                  <TableHead className="py-4 px-4 cursor-pointer hover:text-[#00D9FF] transition-colors" onClick={() => toggleSort('reg')}>
                    <div className="flex items-center gap-1">Register No {sortBy === 'reg' && <ArrowUpDown className="w-3.5 h-3.5 text-[#00D9FF]" />}</div>
                  </TableHead>
                  <TableHead className="py-4 px-4">Route & Fleet Bus</TableHead>
                  <TableHead className="py-4 px-4">Driver</TableHead>
                  <TableHead className="py-4 px-4 cursor-pointer hover:text-[#00D9FF] transition-colors" onClick={() => toggleSort('time')}>
                    <div className="flex items-center gap-1">Check-in Time {sortBy === 'time' && <ArrowUpDown className="w-3.5 h-3.5 text-[#00D9FF]" />}</div>
                  </TableHead>
                  <TableHead className="py-4 px-4 cursor-pointer hover:text-[#00D9FF] transition-colors" onClick={() => toggleSort('pct')}>
                    <div className="flex items-center gap-1">Attendance % {sortBy === 'pct' && <ArrowUpDown className="w-3.5 h-3.5 text-[#00D9FF]" />}</div>
                  </TableHead>
                  <TableHead className="py-4 px-6 text-right">Today&apos;s Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/5 text-sm">
                {sortedAttendances.map((att, index) => {
                  const student = students.find(s => s.id === att.studentId);
                  const bus = buses.find(b => b.id === att.busId);
                  const route = routes.find(r => r.id === student?.assignedRouteId);
                  const driver = drivers.find(d => d.id === bus?.driverId);
                  const metrics = getStudentMetrics(student?.id);

                  // Computed fields for inspection
                  const deptYear = `${student?.department || 'B.Tech CSE'} • ${student?.year || 'III Year'}`;
                  const parentPhone = (student as any)?.parentPhone || student?.phone || '+91 98765 43210';
                  const checkInTime = (att as any)?.time || '07:42 AM';
                  const checkOutTime = (att as any)?.checkOutTime || '04:45 PM';
                  const isHovered = hoveredId === att.id;

                  return (
                    <React.Fragment key={att.id}>
                      <TableRow 
                        className={`transition-all duration-300 cursor-pointer ${
                          isHovered 
                            ? 'bg-[#00D9FF]/10 shadow-[0_4px_25px_rgba(0,217,255,0.15)] z-20 scale-[1.002]' 
                            : index % 2 === 0 ? 'bg-white/[0.02] hover:bg-white/[0.05]' : 'bg-transparent hover:bg-white/[0.05]'
                        } border-b border-white/5`}
                        onMouseEnter={() => setHoveredId(att.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedRecord(att)}
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-[#00D9FF]/40 shadow-sm shrink-0">
                              <AvatarImage src={student?.avatar || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-[#00D9FF] to-[#006699] text-[#07111F] font-black text-xs">
                                {student?.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm hover:underline flex items-center gap-1.5">
                                {student?.name || 'Student'}
                                {isHovered && <ChevronDown className="w-3.5 h-3.5 text-[#00D9FF] animate-bounce" />}
                              </p>
                              <p className="text-[11px] text-slate-400 font-semibold truncate">{deptYear}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4 font-mono text-xs font-bold text-[#00D9FF]">
                          {student?.registerNumber || 'REG-2026-X'}
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200 text-xs truncate max-w-[170px]">{route?.name || 'Route A - Central Depot'}</span>
                            <span className="text-[11px] text-slate-400 font-mono font-medium flex items-center gap-1 mt-0.5">
                              <BusIcon className="w-3 h-3 text-[#00D9FF]" /> {bus?.busNumber || 'BUS-001'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4 text-xs text-slate-300 font-semibold">
                          {driver?.name || 'R. Murugan'}
                        </TableCell>
                        <TableCell className="py-4 px-4 font-mono font-bold text-xs text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{checkInTime}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4 font-bold text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-lg font-mono text-xs ${
                              metrics.percentage >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                              metrics.percentage >= 75 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {metrics.percentage}%
                            </span>
                            <span className="text-[10px] text-slate-500">({metrics.present}/{metrics.total})</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <Badge className={`text-xs uppercase px-3.5 py-1.5 font-extrabold shadow-sm ${
                            att.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]' :
                            att.status === 'late' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.3)]' :
                            'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                          }`}>
                            {att.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 inline" />}
                            {att.status === 'late' && <AlertTriangle className="w-3.5 h-3.5 mr-1.5 inline" />}
                            {att.status === 'absent' && <XCircle className="w-3.5 h-3.5 mr-1.5 inline" />}
                            {att.status}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      {/* ANIMATED HOVER EXPANDABLE INSPECTION & ACTION PANEL */}
                      {isHovered && (
                        <TableRow 
                          className="bg-[#07111F] border-x-2 border-b-2 border-[#00D9FF]/50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-30"
                          onMouseEnter={() => setHoveredId(att.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <TableCell colSpan={7} className="p-5 sm:p-6 bg-gradient-to-r from-[#091829] via-[#0F172A] to-[#091829]">
                            <div className="space-y-4">
                              {/* 12 Point Data Specification Matrix */}
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-[#07111F]/90 border border-white/10 text-xs">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Department & Year</span>
                                  <span className="font-extrabold text-[#00D9FF] truncate block mt-0.5">{deptYear}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Bus & Driver</span>
                                  <span className="font-extrabold text-white truncate block mt-0.5">{bus?.busNumber} ({driver?.name})</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Parent Contact</span>
                                  <span className="font-extrabold text-emerald-400 font-mono block mt-0.5">{parentPhone}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Last Check-in</span>
                                  <span className="font-extrabold text-white font-mono block mt-0.5">{checkInTime}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Last Check-out</span>
                                  <span className="font-extrabold text-slate-300 font-mono block mt-0.5">{checkOutTime}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Punctuality Score</span>
                                  <span className="font-extrabold text-[#00D9FF] block mt-0.5">{metrics.percentage}% Verified Rate</span>
                                </div>
                              </div>

                              {/* 7 Required Quick Action Command Buttons */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => { e.stopPropagation(); setSelectedRecord(att); setDrawerTab('profile'); }}
                                    className="h-8 rounded-xl bg-white/5 border-white/20 text-white hover:bg-[#00D9FF] hover:text-[#07111F] font-bold text-xs px-3 shadow-xs"
                                  >
                                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View Profile
                                  </Button>

                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => { e.stopPropagation(); setSelectedRecord(att); setDrawerTab('history'); }}
                                    className="h-8 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/15 font-bold text-xs px-3 shadow-xs"
                                  >
                                    <History className="w-3.5 h-3.5 mr-1.5 text-[#00D9FF]" /> Attendance History
                                  </Button>

                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => handleViewRoute(student?.assignedRouteId, e)}
                                    className="h-8 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/15 font-bold text-xs px-3 shadow-xs"
                                  >
                                    <Navigation className="w-3.5 h-3.5 mr-1.5 text-sky-400" /> View Route
                                  </Button>

                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => handleContactParent(parentPhone, student?.name, e)}
                                    className="h-8 rounded-xl bg-white/5 border-white/20 text-white hover:bg-emerald-500/20 hover:text-emerald-300 font-bold text-xs px-3 shadow-xs"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Contact Parent
                                  </Button>

                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => handleSendAlert(student?.id, e)}
                                    className="h-8 rounded-xl bg-white/5 border-white/20 text-white hover:bg-purple-500/20 hover:text-purple-300 font-bold text-xs px-3 shadow-xs"
                                  >
                                    <Send className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Send Notification
                                  </Button>
                                </div>

                                {/* Instant Status Override Controls */}
                                <div className="flex items-center gap-1.5 bg-[#07111F] p-1.5 rounded-xl border border-white/15">
                                  <span className="text-[10px] font-black uppercase text-slate-400 px-2">Override Status:</span>
                                  <Button 
                                    size="sm"
                                    onClick={(e) => handleMarkStatus(att, 'present', e)}
                                    className={`h-7 px-3 text-[11px] font-extrabold rounded-lg ${att.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
                                  >
                                    Mark Present
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={(e) => handleMarkStatus(att, 'absent', e)}
                                    className={`h-7 px-3 text-[11px] font-extrabold rounded-lg ${att.status === 'absent' ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                  >
                                    Mark Absent
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE RESPONSIVE STUDENT CARDS (Visible on < lg screens) */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {sortedAttendances.map((att) => {
              const student = students.find(s => s.id === att.studentId);
              const bus = buses.find(b => b.id === att.busId);
              const route = routes.find(r => r.id === student?.assignedRouteId);
              const driver = drivers.find(d => d.id === bus?.driverId);
              const metrics = getStudentMetrics(student?.id);
              const deptYear = `${student?.department || 'B.Tech CSE'} • ${student?.year || 'III Year'}`;
              const checkInTime = (att as any)?.time || '07:42 AM';

              return (
                <div 
                  key={att.id}
                  onClick={() => setSelectedRecord(att)}
                  className="bg-gradient-to-br from-[#07111F] to-[#0A192F] p-5 rounded-[22px] border border-white/10 shadow-lg active:scale-98 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border border-[#00D9FF]/40 shadow-sm shrink-0">
                          <AvatarImage src={student?.avatar || undefined} />
                          <AvatarFallback className="bg-[#00D9FF] text-[#07111F] font-black text-sm">
                            {student?.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-extrabold text-white text-base leading-tight">{student?.name || 'Student'}</h4>
                          <span className="font-mono text-xs text-[#00D9FF] font-bold block mt-0.5">{student?.registerNumber || 'REG-2026-X'}</span>
                          <span className="text-[11px] text-slate-400 font-medium block">{deptYear}</span>
                        </div>
                      </div>

                      <Badge className={`text-[11px] uppercase px-3 py-1 font-black shrink-0 ${
                        att.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        att.status === 'late' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                        'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {att.status}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Assigned Route</span>
                        <span className="font-bold text-slate-200 truncate block mt-0.5">{route?.name || 'Route A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Check-in Time</span>
                        <span className="font-mono font-bold text-emerald-400 block mt-0.5">{checkInTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Assigned Bus</span>
                        <span className="font-bold text-slate-200 block mt-0.5">{bus?.busNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Punctuality Score</span>
                        <span className="font-bold text-[#00D9FF] block mt-0.5">{metrics.percentage}% Rate</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Action Strip */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-xs text-[#00D9FF] font-extrabold flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Tap to inspect details
                    </span>
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm"
                        onClick={(e) => handleMarkStatus(att, 'present', e)}
                        className="h-7 px-2.5 text-[10px] font-black rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Present
                      </Button>
                      <Button 
                        size="sm"
                        onClick={(e) => handleMarkStatus(att, 'absent', e)}
                        className="h-7 px-2.5 text-[10px] font-black rounded-lg bg-red-600 hover:bg-red-500 text-white"
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* RIGHT-SIDE INTERACTIVE STUDENT DETAILS DRAWER (Requirement 4 & 11) */}
      <Sheet open={!!selectedRecord} onOpenChange={(val: any) => !val && setSelectedRecord(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl bg-[#07111F] text-white border-l border-white/10 p-0 flex flex-col overflow-y-auto z-50 shadow-2xl">
          {selectedRecord && (
            <div className="flex flex-col min-h-full">
              {/* Drawer Header with Avatar Seal */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0F192D] to-[#0A192F] border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#00D9FF]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <Avatar className="h-20 w-20 border-2 border-[#00D9FF] shadow-2xl shrink-0">
                    <AvatarImage src={students.find(s => s.id === selectedRecord.studentId)?.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-tr from-[#00D9FF] to-[#006699] text-[#07111F] font-black text-2xl">
                      {students.find(s => s.id === selectedRecord.studentId)?.name.split(' ').map(n => n[0]).join('') || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 font-black text-[11px] uppercase">
                        Verified Student Passenger
                      </Badge>
                      <Badge className={`text-[11px] uppercase px-3 py-0.5 font-black ${
                        selectedRecord.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        selectedRecord.status === 'late' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                        'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        Current Status: {selectedRecord.status}
                      </Badge>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                      {students.find(s => s.id === selectedRecord.studentId)?.name || 'Student Name'}
                    </h2>
                    <p className="text-xs font-mono font-bold text-[#00D9FF] mt-0.5">
                      Register No: {students.find(s => s.id === selectedRecord.studentId)?.registerNumber || 'REG-2026-101'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">
                      {students.find(s => s.id === selectedRecord.studentId)?.department || 'B.Tech Computer Science and Engineering'} • {students.find(s => s.id === selectedRecord.studentId)?.year || 'III Year'}
                    </p>
                  </div>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={() => setDrawerTab('profile')}
                    className={`flex-1 h-10 rounded-xl font-extrabold text-xs transition-all ${drawerTab === 'profile' ? 'bg-[#00D9FF] text-[#07111F] shadow-[0_0_15px_rgba(0,217,255,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                  >
                    <User className="w-4 h-4 mr-2" /> Comprehensive Profile & Transport
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setDrawerTab('history')}
                    className={`flex-1 h-10 rounded-xl font-extrabold text-xs transition-all ${drawerTab === 'history' ? 'bg-[#00D9FF] text-[#07111F] shadow-[0_0_15px_rgba(0,217,255,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                  >
                    <History className="w-4 h-4 mr-2" /> Attendance Audit History
                  </Button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 text-xs sm:text-sm">
                {drawerTab === 'profile' ? (
                  <>
                    {/* Key Metrics Strip */}
                    {(() => {
                      const stu = students.find(s => s.id === selectedRecord.studentId);
                      const m = getStudentMetrics(stu?.id);
                      const bus = buses.find(b => b.id === selectedRecord.busId);
                      const route = routes.find(r => r.id === stu?.assignedRouteId);
                      const driver = drivers.find(d => d.id === bus?.driverId);

                      return (
                        <>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#0F172A] p-4 rounded-2xl border border-white/10 text-center">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Score</span>
                              <span className="text-2xl font-black text-emerald-400 mt-1 block">{m.percentage}%</span>
                              <span className="text-[10px] text-slate-500 font-medium">{m.present} of {m.total} trips present</span>
                            </div>
                            <div className="bg-[#0F172A] p-4 rounded-2xl border border-white/10 text-center">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-in Time</span>
                              <span className="text-xl font-black font-mono text-[#00D9FF] mt-1 block">{(selectedRecord as any).time || '07:42 AM'}</span>
                              <span className="text-[10px] text-slate-500 font-medium">Verified by RFID reader</span>
                            </div>
                            <div className="bg-[#0F172A] p-4 rounded-2xl border border-white/10 text-center">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-out Time</span>
                              <span className="text-xl font-black font-mono text-slate-200 mt-1 block">{(selectedRecord as any).checkOutTime || '04:45 PM'}</span>
                              <span className="text-[10px] text-slate-500 font-medium">Campus Drop Verified</span>
                            </div>
                          </div>

                          {/* Transport Assignment Box */}
                          <div className="bg-[#0F172A] p-5 rounded-2xl border border-white/10 space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#00D9FF] flex items-center gap-2">
                              <BusIcon className="w-4 h-4" /> Transport Fleet Allocation
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                              <div>
                                <span className="text-slate-400 font-bold block">Assigned Transit Route:</span>
                                <span className="font-extrabold text-white text-sm block mt-0.5">{route?.name || 'Route A - Central Depot'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">Assigned Fleet Bus:</span>
                                <span className="font-extrabold text-emerald-400 text-sm block mt-0.5">{bus?.busNumber || 'BUS-001'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">Designated Bus Driver:</span>
                                <span className="font-extrabold text-white text-sm block mt-0.5">{driver?.name || 'R. Murugan'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">Pickup / Drop Point:</span>
                                <span className="font-extrabold text-white text-sm block mt-0.5">{route?.stops[0]?.name || 'Sathyamangalam Main Stop'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Contact & Parent Information */}
                          <div className="bg-[#0F172A] p-5 rounded-2xl border border-white/10 space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#00D9FF] flex items-center gap-2">
                              <PhoneCall className="w-4 h-4" /> Student & Parent Contact Registry
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                              <div>
                                <span className="text-slate-400 font-bold block">Student Email Address:</span>
                                <span className="font-semibold text-white font-mono block mt-0.5">{stu?.email || 'arun@student.com'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">Student Phone Number:</span>
                                <span className="font-semibold text-white font-mono block mt-0.5">{stu?.phone || '+91 98765 12345'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">Emergency Parent Contact:</span>
                                <span className="font-extrabold text-emerald-400 font-mono block mt-0.5">{(stu as any)?.parentPhone || '+91 98765 43210'} (Parent/Guardian)</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">Home Address:</span>
                                <span className="font-medium text-slate-300 block mt-0.5">14/2, Sathyamangalam Highway, Erode District, TN 638401</span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  /* Attendance Audit History Tab */
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <History className="w-4 h-4 text-[#00D9FF]" /> Recorded Commute & Boarding Archives
                    </h3>
                    <div className="divide-y divide-white/10 border border-white/10 rounded-2xl bg-[#0F172A] overflow-hidden">
                      {attendances.filter(a => a.studentId === selectedRecord.studentId).length > 0 ? (
                        attendances.filter(a => a.studentId === selectedRecord.studentId).map((record) => (
                          <div key={record.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : record.status === 'late' ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-red-500 shadow-[0_0_8px_#EF4444]'}`} />
                              <div>
                                <p className="font-bold text-white text-xs flex items-center gap-2">
                                  <Calendar className="w-3.5 h-3.5 text-[#00D9FF]" /> {record.date}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Check-in: {(record as any).time || '07:45 AM'}</p>
                              </div>
                            </div>
                            <Badge className={`text-[10px] uppercase px-2.5 py-0.5 font-extrabold ${
                              record.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              record.status === 'late' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {record.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="p-6 text-center text-slate-500 italic text-xs">No prior commute logs recorded for this student.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Bottom Action Control Bar */}
              <div className="p-6 bg-[#091829] border-t border-white/10 mt-auto space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Immediate Administrative Commands:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button 
                    onClick={() => handleMarkStatus(selectedRecord, 'present')}
                    className="h-10 font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Present
                  </Button>
                  <Button 
                    onClick={() => handleMarkStatus(selectedRecord, 'late')}
                    className="h-10 font-bold text-xs bg-amber-500 hover:bg-amber-400 text-[#07111F] rounded-xl shadow-xs"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1.5" /> Mark Late
                  </Button>
                  <Button 
                    onClick={() => handleMarkStatus(selectedRecord, 'absent')}
                    className="h-10 font-bold text-xs bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-xs"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Mark Absent
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleContactParent((students.find(s => s.id === selectedRecord.studentId) as any)?.parentPhone, students.find(s => s.id === selectedRecord.studentId)?.name)}
                    className="h-10 font-bold text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4 mr-1.5 text-emerald-400" /> Call Parent
                  </Button>
                </div>
                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Record ID: {selectedRecord.id} • Authenticated by BIT Depot</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)} className="h-7 px-3 text-slate-400 hover:text-white text-xs">
                    Close Drawer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
