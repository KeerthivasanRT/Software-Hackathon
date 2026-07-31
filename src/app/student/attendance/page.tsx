'use client';

import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Percent, Calendar } from 'lucide-react';

export default function StudentAttendancePage() {
  const { user, attendances } = useDataStore();
  
  const studentAttendances = attendances.filter(a => a.studentId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalDays = studentAttendances.length;
  const presentDays = studentAttendances.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentDays = studentAttendances.filter(a => a.status === 'absent').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Attendance History</h1>
        <p className="text-slate-500 mt-1">View your transport attendance records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Percent className="w-4 h-4 mr-2 text-blue-600" />
              Overall Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${attendancePercentage < 75 ? 'text-red-600' : 'text-slate-800'}`}>
              {attendancePercentage}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
              Days Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{presentDays}</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-red-600" />
              Days Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{absentDays}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Detailed Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentAttendances.map((record) => (
                  <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-800">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'present' ? 'default' : record.status === 'late' ? 'secondary' : record.status === 'leave' ? 'outline' : 'destructive'} 
                        className={
                          record.status === 'present' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none' : 
                          record.status === 'late' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-none' : 
                          record.status === 'leave' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none' : ''
                        }>
                        {record.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {studentAttendances.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-slate-500">
                      No attendance records found.
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
