'use client';

  import { useState, useEffect, useMemo } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarCheck, MapPin, Users, Check, AlertCircle, Save } from 'lucide-react';
import { AttendanceStatus, Stop } from '@/types';

export default function DriverAttendancePage() {
  const { user, buses, routes, students, attendances, markMultipleAttendances } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStopId, setExpandedStopId] = useState<string | null>(null);
  
  // Local state for attendance before submission
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const assignedBus = buses.find(b => b.driverId === user?.id) || buses[0];
  const assignedRoute = useMemo(() => routes.find(r => r.id === assignedBus?.routeId), [routes, assignedBus]);
  const assignedStudents = useMemo(() => students.filter(s => s.assignedBusId === assignedBus?.id), [students, assignedBus]);
  
  const todayStr = new Date().toISOString().split('T')[0];

  // Initialize local attendance state with existing attendance data
  useEffect(() => {
    const initial: Record<string, AttendanceStatus> = {};
    assignedStudents.forEach(s => {
      const todayAtt = attendances.find(a => a.studentId === s.id && a.date.startsWith(todayStr));
      if (todayAtt) {
        initial[s.id] = todayAtt.status;
      }
    });
    setLocalAttendance(initial);
  }, [assignedStudents, attendances, todayStr]);

  if (!assignedBus || !assignedRoute) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-600">
        <AlertCircle className="w-12 h-12 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">No Assignment</h2>
        <p>You are not assigned to any bus or route.</p>
      </div>
    );
  }

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
    setTimeout(() => setIsSubmitted(false), 3000); // Hide toast after 3s
  };

  // Calculate overall progress
  const totalStudents = assignedStudents.length;
  const markedStudents = Object.keys(localAttendance).length;
  const progressPercentage = totalStudents > 0 ? Math.round((markedStudents / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Daily Attendance</h1>
          <p className="text-slate-600 mt-1 font-medium flex items-center">
            {assignedRoute.name} <span className="mx-2">•</span> {assignedBus.busNumber}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-[#D6ECFA] text-slate-600 px-4 py-2 rounded-xl font-semibold text-sm flex items-center shadow-sm">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            {markedStudents} / {totalStudents} Marked
          </div>
          <div className="bg-sky-50 border border-blue-100 text-sky-600 px-4 py-2 rounded-xl font-semibold text-sm flex items-center shadow-sm">
            <CalendarCheck className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D6ECFA] shadow-sm flex items-center gap-4">
        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-sky-600 transition-all duration-500 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="font-bold text-slate-700 text-sm">{progressPercentage}% Complete</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600 w-5 h-5" />
        <Input 
          placeholder="Search Pickup Point..." 
          className="pl-12 h-14 bg-white border-[#D6ECFA] rounded-2xl text-base focus-visible:ring-sky-500/20 focus-visible:bg-white shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Pickup Points List */}
      <div className="space-y-4">
        {filteredStops.map((stop, index) => {
          const stats = getStopStats(stop.id);
          const isExpanded = expandedStopId === stop.id;
          const stopStudents = getStudentsForStop(stop.id);
          
          if (stopStudents.length === 0) return null; // Only show stops with students

          return (
            <Card key={stop.id} className={`border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-sky-200 shadow-md ring-1 ring-blue-100' : 'border-[#D6ECFA] shadow-sm hover:border-sky-200 hover:shadow-md cursor-pointer'}`}>
              <div 
                className={`px-6 py-4 flex items-center justify-between ${isExpanded ? 'bg-sky-50/50' : 'bg-white'}`}
                onClick={() => !isExpanded && setExpandedStopId(stop.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stats.pending === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600'}`}>
                    {stats.pending === 0 ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{stop.name}</h3>
                    <p className="text-sm text-slate-600 font-medium">Stop {index + 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stats Badges */}
                  <div className="hidden md:flex gap-2">
                    <Badge variant="outline" className="bg-white border-[#D6ECFA] text-slate-600 shadow-none px-3 py-1">
                      Total: {stats.total}
                    </Badge>
                    <Badge variant="success" className="px-3 py-1 bg-emerald-50 text-emerald-700">
                      Present: {stats.present}
                    </Badge>
                    {stats.late > 0 && (
                      <Badge variant="warning" className="px-3 py-1 bg-orange-50 text-orange-700">
                        Late: {stats.late}
                      </Badge>
                    )}
                    {stats.absent > 0 && (
                      <Badge variant="destructive" className="px-3 py-1 bg-red-50 text-red-700">
                        Absent: {stats.absent}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={(e) => { e.stopPropagation(); setExpandedStopId(isExpanded ? null : stop.id); }}>
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#D6ECFA] bg-white p-6">
                  {/* Bulk Actions */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D6ECFA]">
                    <h4 className="font-bold text-slate-800 flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Students ({stats.total})
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" onClick={() => handleBulkAction(stop.id, 'present')}>
                        Mark All Present
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-200" onClick={() => handleBulkAction(stop.id, 'absent')}>
                        Mark All Absent
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-600" onClick={() => handleBulkAction(stop.id, 'reset')}>
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="space-y-3">
                    {stopStudents.map(student => {
                      const status = localAttendance[student.id];
                      
                      return (
                        <div key={student.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-colors ${status === 'present' ? 'border-emerald-200 bg-emerald-50/30' : status === 'absent' ? 'border-red-200 bg-red-50/30' : status === 'late' ? 'border-orange-200 bg-orange-50/30' : 'border-[#D6ECFA] bg-white'}`}>
                          
                          <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <Avatar className="h-12 w-12 border border-[#D6ECFA] shadow-sm">
                              <AvatarFallback className="bg-white text-slate-600 font-bold text-sm">
                                {student.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-slate-900">{student.name}</div>
                              <div className="text-sm text-slate-600 font-medium mt-0.5">
                                {student.registerNumber || student.studentId} • {student.department} • {student.year}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button 
                              variant={status === 'present' ? 'default' : 'outline'}
                              className={`flex-1 md:flex-none md:w-28 h-10 rounded-lg shadow-sm font-bold transition-all ${status === 'present' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' : 'bg-white hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 text-slate-600 border-[#D6ECFA]'}`}
                              onClick={() => handleMarkStudent(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button 
                              variant={status === 'late' ? 'default' : 'outline'}
                              className={`flex-1 md:flex-none md:w-28 h-10 rounded-lg shadow-sm font-bold transition-all ${status === 'late' ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent' : 'bg-white hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 text-slate-600 border-[#D6ECFA]'}`}
                              onClick={() => handleMarkStudent(student.id, 'late')}
                            >
                              Late
                            </Button>
                            <Button 
                              variant={status === 'absent' ? 'default' : 'outline'}
                              className={`flex-1 md:flex-none md:w-28 h-10 rounded-lg shadow-sm font-bold transition-all ${status === 'absent' ? 'bg-red-600 hover:bg-red-700 text-white border-transparent' : 'bg-white hover:border-red-600 hover:text-red-600 hover:bg-red-50 text-slate-600 border-[#D6ECFA]'}`}
                              onClick={() => handleMarkStudent(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {filteredStops.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            <Search className="w-10 h-10 mx-auto text-slate-700 mb-4" />
            <p className="font-semibold text-lg text-slate-600">No pickup points found</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-[#D6ECFA] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 flex justify-between items-center px-6">
        <div>
          <span className="font-bold text-slate-900 text-lg">{markedStudents}</span>
          <span className="text-slate-600 font-medium ml-2">students marked out of {totalStudents}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isSubmitted && (
            <span className="text-emerald-600 font-bold text-sm animate-in fade-in flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Attendance submitted successfully!
            </span>
          )}
          <Button 
            className="bg-sky-600 hover:bg-sky-700 text-white h-12 px-8 rounded-xl font-bold shadow-sm shadow-blue-200 transition-all disabled:opacity-50"
            onClick={handleSubmitAttendance}
            disabled={markedStudents === 0 || isSubmitted}
          >
            <Save className="w-5 h-5 mr-2" />
            Submit Attendance
          </Button>
        </div>
      </div>
    </div>
  );
}
