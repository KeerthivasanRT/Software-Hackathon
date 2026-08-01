'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Search, CheckCircle, Clock, AlertCircle, MessageSquareWarning, Eye, Save } from 'lucide-react';
import { Complaint } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminComplaintsPage() {
  const { complaints, students, updateComplaint } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);

  const filteredComplaints = complaints.filter(c => 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenEditDialog = (complaint: Complaint) => {
    setEditingComplaint({ ...complaint });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingComplaint) {
      updateComplaint(editingComplaint);
      setIsEditDialogOpen(false);
    }
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
                          complaint.status === 'closed' ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60 shadow-none font-semibold px-2.5 py-0.5' :
                          'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 shadow-none font-semibold px-2.5 py-0.5'
                        }>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(complaint)} className="h-8 text-sky-600 border-sky-200/60 hover:bg-sky-50 rounded-lg shadow-sm transition-all text-xs font-semibold">
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          View & Edit
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

      {/* Edit Complaint Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl border-[#D6ECFA] shadow-xl p-0 overflow-hidden">
          <div className="bg-orange-500 h-2" />
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center">
                <MessageSquareWarning className="w-5 h-5 mr-2 text-orange-500" />
                Complaint Details
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium">
                Review and update the status of this complaint.
              </DialogDescription>
            </DialogHeader>

            {editingComplaint && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</span>
                    <p className="font-bold text-slate-900">{students.find(s => s.id === editingComplaint.userId)?.name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</span>
                    <p className="font-bold text-slate-900">{editingComplaint.subject}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</span>
                    <p className="text-sm text-slate-700 mt-1">{editingComplaint.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</Label>
                    <select 
                      value={editingComplaint.status} 
                      onChange={e => setEditingComplaint({...editingComplaint, status: e.target.value as Complaint['status']})} 
                      className="w-full h-10 rounded-md border border-[#D6ECFA] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Priority</Label>
                    <select 
                      value={editingComplaint.priority || 'low'} 
                      onChange={e => setEditingComplaint({...editingComplaint, priority: e.target.value as Complaint['priority']})} 
                      className="w-full h-10 rounded-md border border-[#D6ECFA] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Resolution Remarks</Label>
                  <Textarea 
                    placeholder="Add notes about how this was resolved..."
                    value={editingComplaint.resolutionRemarks || ''}
                    onChange={e => setEditingComplaint({...editingComplaint, resolutionRemarks: e.target.value})}
                    className="min-h-[100px] border-[#D6ECFA] focus-visible:ring-sky-500/20"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="mt-8 pt-6 border-t border-[#D6ECFA]">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="font-semibold">Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 shadow-md shadow-orange-500/20">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
