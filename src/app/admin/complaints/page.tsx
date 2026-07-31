'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Clock } from 'lucide-react';
import { Complaint } from '@/types';

export default function AdminComplaintsPage() {
  const { complaints, students } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComplaints = complaints.filter(c => 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // In a real app we'd have an updateComplaint action in the store. 
  // For the prototype we'll just show the UI for it.
  const handleStatusChange = (id: string, status: Complaint['status']) => {
    alert(`Complaint ${id} marked as ${status}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Complaint Management</h1>
          <p className="text-slate-500 mt-1">Review and resolve transport issues reported by students.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search complaints..." 
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
                  <TableHead className="font-semibold text-slate-600">Issue Details</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => {
                  const student = students.find(s => s.id === complaint.userId);
                  return (
                    <TableRow key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-800 w-[120px]">
                        {new Date(complaint.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="w-[150px]">
                        <div className="font-medium text-slate-800">{student?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{student?.studentId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">{complaint.subject}</div>
                        <div className="text-sm text-slate-500 mt-1">{complaint.description}</div>
                      </TableCell>
                      <TableCell className="w-[120px]">
                        <Badge variant={complaint.status === 'resolved' ? 'default' : complaint.status === 'in-progress' ? 'secondary' : 'destructive'} 
                          className={
                            complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none' : 
                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-none' : 
                            'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-none'
                          }>
                          {complaint.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(complaint.id, 'in-progress')} className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50">
                            <Clock className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(complaint.id, 'resolved')} className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredComplaints.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No complaints found.
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
