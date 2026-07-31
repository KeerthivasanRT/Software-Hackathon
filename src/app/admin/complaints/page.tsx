'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Clock, AlertCircle, MessageSquareWarning } from 'lucide-react';
import { Complaint } from '@/types';

export default function AdminComplaintsPage() {
  const { complaints, students } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComplaints = complaints.filter(c => 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusChange = (id: string, status: Complaint['status']) => {
    alert(`Complaint ${id} marked as ${status}.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Complaint Management</h1>
          <p className="text-slate-600 mt-1 font-medium">Review and resolve transport issues reported by students.</p>
        </div>
      </div>

      <Card className="border border-[#D6ECFA] border-t-4 border-t-orange-500 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-[#D6ECFA]">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-600 w-4 h-4" />
              <Input 
                placeholder="Search complaints by subject or description..." 
                className="pl-10 h-10 bg-sky-50/50 border-[#D6ECFA] rounded-xl text-sm focus-visible:ring-sky-500/20 focus-visible:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-sky-50/80">
              <TableRow className="border-b border-[#D6ECFA] hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-11 px-6">Date</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Student</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Issue Details</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 h-11 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => {
                const student = students.find(s => s.id === complaint.userId);
                return (
                  <TableRow key={complaint.id} className="hover:bg-sky-50/80 transition-colors border-b border-[#D6ECFA]">
                    <TableCell className="px-6 py-4">
                      <div className="font-semibold text-slate-700 text-sm w-[100px]">
                        {new Date(complaint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="font-medium text-slate-800 text-sm">{student?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{student?.studentId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <MessageSquareWarning className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm tracking-tight">{complaint.subject}</div>
                          <div className="text-sm text-slate-600 mt-1 max-w-md leading-relaxed">{complaint.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[140px]">
                      <Badge variant={complaint.status === 'resolved' ? 'default' : complaint.status === 'in-progress' ? 'secondary' : 'destructive'} 
                        className={
                          complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                          complaint.status === 'in-progress' ? 'bg-sky-50 text-sky-600 hover:bg-blue-100 border border-sky-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                          'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 shadow-none font-semibold px-2.5 py-0.5'
                        }>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(complaint.id, 'in-progress')} className="h-8 text-sky-600 border-sky-200/60 hover:bg-sky-50 rounded-lg shadow-sm transition-all text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          Investigate
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(complaint.id, 'resolved')} className="h-8 text-emerald-600 border-emerald-200/60 hover:bg-emerald-50 rounded-lg shadow-sm transition-all text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                          Resolve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredComplaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <AlertCircle className="w-8 h-8 text-slate-700 mb-3" />
                      <p className="font-medium text-slate-600">No complaints found</p>
                      <p className="text-sm">Great! Everything seems to be running smoothly.</p>
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
