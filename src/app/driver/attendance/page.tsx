'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, CalendarCheck, AlertCircle } from 'lucide-react';
import { AttendanceStatus } from '@/types';

export default function DriverAttendancePage() {
  const { user, buses, students, attendances, markAttendance } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const assignedBus = buses.find(b => b.driverId === user?.id) || buses[0];
  const assignedStudents = students.filter(s => s.assignedBusId === assignedBus?.id);
  
  const filteredStudents = assignedStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    if (!assignedBus) return;
    
    markAttendance({
      id: `a${Date.now()}`,
      studentId,
      busId: assignedBus.id,
      date: new Date().toISOString(),
      status
    });
  };

  const getStudentStatus = (studentId: string): AttendanceStatus | null => {
    const todayAttendance = attendances.find(
      a => a.studentId === studentId && a.date.startsWith(todayStr)
    );
    return todayAttendance ? todayAttendance.status : null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Daily Attendance</h1>
          <p className="text-slate-500 mt-1 font-medium">Mark student attendance for Bus: {assignedBus?.busNumber || 'None'}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm flex items-center shadow-sm">
          <CalendarCheck className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search students..." 
              className="pl-10 h-10 bg-white border-slate-200/60 rounded-xl text-sm focus-visible:ring-blue-500/20 focus-visible:bg-white transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-11 px-6 w-20">Profile</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Student Info</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 h-11 px-6">Mark Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const status = getStudentStatus(student.id);
                
                return (
                  <TableRow key={student.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                    <TableCell className="px-6 py-4">
                      <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                          {student.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-sm tracking-tight">{student.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{student.studentId} | {student.department}</div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant={status === 'present' ? 'default' : 'outline'}
                          size="sm"
                          className={status === 'present' ? 'bg-emerald-600 hover:bg-emerald-700 w-20 rounded-lg shadow-sm font-semibold text-xs' : 'w-20 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold text-xs border-slate-200 text-slate-600 transition-colors'}
                          onClick={() => handleMark(student.id, 'present')}
                        >
                          Present
                        </Button>
                        <Button 
                          variant={status === 'absent' ? 'default' : 'outline'}
                          size="sm"
                          className={status === 'absent' ? 'bg-red-600 hover:bg-red-700 w-20 rounded-lg shadow-sm font-semibold text-xs' : 'w-20 hover:text-red-600 hover:border-red-600 hover:bg-red-50 rounded-lg font-semibold text-xs border-slate-200 text-slate-600 transition-colors'}
                          onClick={() => handleMark(student.id, 'absent')}
                        >
                          Absent
                        </Button>
                        <Button 
                          variant={status === 'late' ? 'default' : 'outline'}
                          size="sm"
                          className={status === 'late' ? 'bg-orange-500 hover:bg-orange-600 w-20 rounded-lg shadow-sm font-semibold text-xs' : 'w-20 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 rounded-lg font-semibold text-xs border-slate-200 text-slate-600 transition-colors'}
                          onClick={() => handleMark(student.id, 'late')}
                        >
                          Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No students found</p>
                      <p className="text-sm">No students assigned to this bus.</p>
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
