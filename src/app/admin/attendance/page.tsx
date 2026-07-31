'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarCheck } from 'lucide-react';

export default function AdminAttendancePage() {
  const { attendances, students, buses } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendances = attendances.filter(a => {
    const student = students.find(s => s.id === a.studentId);
    return student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Global Attendance</h1>
          <p className="text-slate-500 mt-1">Monitor transport attendance across all routes.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search by student name or ID..." 
                className="pl-9 bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Student</TableHead>
                  <TableHead className="font-semibold text-slate-600">Bus</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendances.map((record) => {
                  const student = students.find(s => s.id === record.studentId);
                  const bus = buses.find(b => b.id === record.busId);
                  return (
                    <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">{student?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{student?.studentId}</div>
                      </TableCell>
                      <TableCell className="text-slate-600">{bus?.busNumber || 'Unknown'}</TableCell>
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
                  );
                })}
                {filteredAttendances.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
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
