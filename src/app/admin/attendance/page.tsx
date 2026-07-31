'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarCheck, AlertCircle, UserCircle } from 'lucide-react';

export default function AdminAttendancePage() {
  const { attendances, students, buses } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendances = attendances.filter(a => {
    const student = students.find(s => s.id === a.studentId);
    return student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Attendance</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor transport attendance across all routes.</p>
        </div>
      </div>

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
                <TableHead className="font-semibold text-slate-600 h-11">Bus</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((record) => {
                const student = students.find(s => s.id === record.studentId);
                const bus = buses.find(b => b.id === record.busId);
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
                          <div className="text-xs text-slate-500 mt-0.5">{student?.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-medium shadow-none">
                        {bus?.busNumber || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'present' ? 'default' : record.status === 'late' ? 'secondary' : record.status === 'leave' ? 'outline' : 'destructive'} 
                        className={
                          record.status === 'present' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                          record.status === 'late' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                          record.status === 'leave' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                          'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60 shadow-none font-semibold px-2.5 py-0.5'
                        }>
                        {record.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAttendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No attendance records found</p>
                      <p className="text-sm">Try adjusting your search query.</p>
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
