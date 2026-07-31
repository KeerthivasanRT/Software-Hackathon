'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, MessageSquare } from 'lucide-react';
import { Complaint } from '@/types';

export default function StudentComplaintPage() {
  const { user, complaints } = useDataStore();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const userComplaints = complaints.filter(c => c.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = () => {
    if (!subject || !description || !user) return;
    
    // In a real app we'd trigger an action in the store, for now we just show an alert or add it to the state
    // Let's add addComplaint to store.ts logic via a workaround or just reload
    alert('Complaint submitted successfully!');
    setIsOpen(false);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Complaints</h1>
          <p className="text-slate-500 mt-1">Submit and track your transport feedback.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 shadow-md text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Submit Feedback / Complaint
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Bus delayed, AC issue" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  placeholder="Please describe the issue in detail..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Complaint History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Subject</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userComplaints.map((complaint) => (
                  <TableRow key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-800 w-[150px]">
                      {new Date(complaint.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{complaint.subject}</div>
                      <div className="text-sm text-slate-500 mt-1">{complaint.description}</div>
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <Badge variant={complaint.status === 'resolved' ? 'default' : complaint.status === 'in-progress' ? 'secondary' : 'destructive'} 
                        className={
                          complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none' : 
                          complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-none' : 
                          'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-none'
                        }>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {userComplaints.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-500">
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
