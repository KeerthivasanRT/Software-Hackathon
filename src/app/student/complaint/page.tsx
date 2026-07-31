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
import { Plus, MessageSquare, AlertCircle } from 'lucide-react';
import { Complaint } from '@/types';

export default function StudentComplaintPage() {
  const { user, complaints } = useDataStore();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const userComplaints = complaints.filter(c => c.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = () => {
    if (!subject || !description || !user) return;
    
    alert('Complaint submitted successfully!');
    setIsOpen(false);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Complaints</h1>
          <p className="text-slate-500 mt-1 font-medium">Submit and track your transport feedback.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all h-10 px-4">
                <Plus className="w-4 h-4 mr-2" />
                New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <DialogTitle className="flex items-center text-xl font-bold text-slate-800">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                Submit Feedback
              </DialogTitle>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</Label>
                <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Bus delayed, AC issue" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</Label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all resize-none"
                  placeholder="Please describe the issue in detail..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <Button variant="outline" className="rounded-lg h-10 px-5" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 px-5 shadow-sm" onClick={handleSubmit}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-800">Complaint History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-11 px-6">Date</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Subject & Details</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userComplaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                  <TableCell className="font-semibold text-slate-700 text-sm w-[150px] px-6">
                    {new Date(complaint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 tracking-tight text-sm">{complaint.subject}</div>
                    <div className="text-sm text-slate-500 mt-1 max-w-lg">{complaint.description}</div>
                  </TableCell>
                  <TableCell className="w-[150px]">
                    <Badge variant={complaint.status === 'resolved' ? 'default' : complaint.status === 'in-progress' ? 'secondary' : 'destructive'} 
                      className={
                        complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                        complaint.status === 'in-progress' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                        'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 shadow-none font-semibold px-2.5 py-0.5'
                      }>
                      {complaint.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {userComplaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No complaints found</p>
                      <p className="text-sm">You haven't submitted any feedback yet.</p>
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
