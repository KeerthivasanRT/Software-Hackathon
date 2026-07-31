'use client';

import { useState } from 'react';
import { Student } from '@/types';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit2, Trash2, GraduationCap, AlertCircle, UserCircle } from 'lucide-react';

export default function StudentsPage() {
  const { students, buses, routes, addStudent, updateStudent, deleteStudent } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Student>>({});

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.registerNumber && s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getBusNumber = (busId: string | null) => {
    return buses.find(b => b.id === busId)?.busNumber || 'None';
  };

  const getRouteName = (routeId: string | null) => {
    return routes.find(r => r.id === routeId)?.name || 'None';
  };
  
  const getPickupPointName = (routeId: string | null, pickupStopId: string | null) => {
    if (!routeId || !pickupStopId) return 'None';
    const route = routes.find(r => r.id === routeId);
    return route?.stops.find(s => s.id === pickupStopId)?.name || 'None';
  };

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudentId(student.id);
      setFormData(student);
    } else {
      setEditingStudentId(null);
      setFormData({
        role: 'student',
        year: '1st Year'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.studentId) return;
    
    if (editingStudentId) {
      updateStudent(formData as Student);
    } else {
      addStudent({
        ...formData,
        id: `st${Date.now()}`
      } as Student);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };
  
  const selectedRouteObj = formData.assignedRouteId ? routes.find(r => r.id === formData.assignedRouteId) : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage registered students and transport assignments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all h-10 px-4" onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Register Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <DialogTitle className="flex items-center text-xl font-bold text-slate-800">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                {editingStudentId ? 'Edit Student Details' : 'Register New Student'}
              </DialogTitle>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Student ID <span className="text-red-500">*</span></Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.studentId || ''} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="e.g. CS2024-01" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Register Number</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.registerNumber || ''} onChange={e => setFormData({...formData, registerNumber: e.target.value})} placeholder="e.g. 730421104001" />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Student's name" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email address" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone number" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Year</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.year || '1st Year'} 
                    onChange={e => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Route</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.assignedRouteId || ''} 
                    onChange={e => {
                      const newRouteId = e.target.value || null;
                      setFormData({...formData, assignedRouteId: newRouteId, pickupStopId: null});
                    }}
                  >
                    <option value="">Unassigned</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pickup Point</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all disabled:opacity-50 disabled:bg-slate-50"
                    value={formData.pickupStopId || ''} 
                    onChange={e => setFormData({...formData, pickupStopId: e.target.value || null})}
                    disabled={!formData.assignedRouteId}
                  >
                    <option value="">{formData.assignedRouteId ? 'Select Pickup Point' : 'Select a route first'}</option>
                    {selectedRouteObj?.stops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Bus</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.assignedBusId || ''} 
                    onChange={e => setFormData({...formData, assignedBusId: e.target.value || null})}
                  >
                    <option value="">Unassigned</option>
                    {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber} ({b.registrationNumber})</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <Button variant="outline" className="rounded-lg h-10 px-5" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 px-5 shadow-sm" onClick={handleSave}>Save Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search students by name or ID..." 
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
                <TableHead className="font-semibold text-slate-600 h-11 px-6">Student Info</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Academics</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Contact</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Assigned Bus</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Route & Pickup</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 h-11 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <UserCircle className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-tight">{student.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{student.studentId}</div>
                        {student.registerNumber && <div className="text-xs font-medium text-slate-400 mt-0.5">{student.registerNumber}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    <div className="font-medium text-slate-800">{student.department || 'N/A'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{student.year || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    <div className="font-medium text-slate-800">{student.phone || 'N/A'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{student.email || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-medium shadow-none">
                      {getBusNumber(student.assignedBusId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium text-slate-800 max-w-[150px] truncate" title={getRouteName(student.assignedRouteId)}>
                      {getRouteName(student.assignedRouteId)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 max-w-[150px] truncate" title={getPickupPointName(student.assignedRouteId, student.pickupStopId)}>
                      {getPickupPointName(student.assignedRouteId, student.pickupStopId)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(student)} className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No students found</p>
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
