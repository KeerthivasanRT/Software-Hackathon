'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, CalendarCheck } from 'lucide-react';
import { AttendanceStatus } from '@/types';

export default function DriverAttendancePage() {
  const { user, buses, students, attendances, markAttendance } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Find assigned bus and students
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Daily Attendance</h1>
          <p className="text-slate-500 mt-1">Mark student attendance for Bus: {assignedBus?.busNumber || 'None'}</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center">
          <CalendarCheck className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search students..." 
              className="pl-9 bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600 w-16">Profile</TableHead>
                  <TableHead className="font-semibold text-slate-600">Student Name</TableHead>
                  <TableHead className="font-semibold text-slate-600">Stop</TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">Mark Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const status = getStudentStatus(student.id);
                  
                  return (
                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarFallback className="bg-slate-100 text-slate-600">
                            {student.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.studentId} | {student.department}</div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {/* We could lookup the exact stop name here if needed, but keeping it simple */}
                        Pickup Point
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant={status === 'present' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'present' ? 'bg-emerald-600 hover:bg-emerald-700 w-20' : 'w-20 hover:text-emerald-600 hover:border-emerald-600'}
                            onClick={() => handleMark(student.id, 'present')}
                          >
                            Present
                          </Button>
                          <Button 
                            variant={status === 'absent' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'absent' ? 'bg-red-600 hover:bg-red-700 w-20' : 'w-20 hover:text-red-600 hover:border-red-600'}
                            onClick={() => handleMark(student.id, 'absent')}
                          >
                            Absent
                          </Button>
                          <Button 
                            variant={status === 'late' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'late' ? 'bg-orange-500 hover:bg-orange-600 w-20' : 'w-20 hover:text-orange-500 hover:border-orange-500'}
                            onClick={() => handleMark(student.id, 'late')}
                          >
                            Late
                          </Button>
                          <Button 
                            variant={status === 'leave' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'leave' ? 'bg-slate-600 hover:bg-slate-700 w-20' : 'w-20 hover:text-slate-600 hover:border-slate-600'}
                            onClick={() => handleMark(student.id, 'leave')}
                          >
                            Leave
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      No students found assigned to this bus.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
