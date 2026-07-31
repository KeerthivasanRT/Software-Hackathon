'use client';

import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Percent, Calendar, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

export default function StudentAttendancePage() {
  const { user, attendances } = useDataStore();
  
  const studentAttendances = attendances.filter(a => a.studentId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalDays = studentAttendances.length;
  const presentDays = studentAttendances.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentDays = studentAttendances.filter(a => a.status === 'absent').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = studentAttendances.find(a => a.date.startsWith(todayStr));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance</h1>
        <p className="text-slate-500 mt-1 font-medium">View your daily and historical transport attendance.</p>
      </div>

      {/* Today's Status Banner */}
      <Card className={`border shadow-sm rounded-2xl overflow-hidden transition-all ${
        !todayAttendance ? 'bg-slate-50/50 border-slate-200/60' : 
        todayAttendance.status === 'present' ? 'bg-emerald-50/50 border-emerald-200' : 
        todayAttendance.status === 'late' ? 'bg-orange-50/50 border-orange-200' :
        'bg-red-50/50 border-red-200'
      }`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${
                !todayAttendance ? 'bg-slate-200 text-slate-500' : 
                todayAttendance.status === 'present' ? 'bg-emerald-200 text-emerald-700' : 
                todayAttendance.status === 'late' ? 'bg-orange-200 text-orange-700' :
                'bg-red-200 text-red-700'
              }`}>
                {!todayAttendance ? <Clock className="w-8 h-8" /> : 
                 todayAttendance.status === 'present' ? <CheckCircle2 className="w-8 h-8" /> : 
                 todayAttendance.status === 'late' ? <AlertCircle className="w-8 h-8" /> :
                 <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Today's Status</h2>
                <p className="text-slate-600 font-medium mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div>
              {todayAttendance ? (
                <Badge className={`px-6 py-2 text-base font-bold shadow-sm capitalize ${
                  todayAttendance.status === 'present' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' : 
                  todayAttendance.status === 'late' ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent' : 
                  'bg-red-600 hover:bg-red-700 text-white border-transparent'
                }`}>
                  Marked as {todayAttendance.status}
                </Badge>
              ) : (
                <Badge variant="outline" className="px-6 py-2 text-base font-bold bg-white text-slate-600 border-slate-300">
                  Not Marked Yet
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Overall Attendance</h3>
            <div className={`text-3xl font-bold tracking-tight ${attendancePercentage < 75 ? 'text-red-600' : 'text-slate-900'}`}>
              {attendancePercentage}%
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Days Present</h3>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{presentDays}</div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-50 rounded-xl group-hover:scale-110 transition-transform">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">Days Absent</h3>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{absentDays}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-800">Historical Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-11 px-6">Date</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11 text-right px-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentAttendances.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700 text-sm">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
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
              ))}
              {studentAttendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No attendance records found</p>
                      <p className="text-sm">Attendance hasn't been marked for you yet.</p>
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
