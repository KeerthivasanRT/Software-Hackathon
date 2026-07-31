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
import { Plus, Search, Edit2, Trash2, GraduationCap } from 'lucide-react';

export default function StudentsPage() {
  const { students, buses, routes, addStudent, updateStudent, deleteStudent } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  
  // Form state
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
  
  // Get available stops for selected route in form
  const selectedRouteObj = formData.assignedRouteId ? routes.find(r => r.id === formData.assignedRouteId) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Management</h1>
          <p className="text-slate-500 mt-1">Manage registered students and transport assignments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 shadow-md text-white" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Register Student
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                {editingStudentId ? 'Edit Student Details' : 'Register New Student'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Student ID *</Label>
                <Input value={formData.studentId || ''} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="e.g. CS2024-01" />
              </div>
              <div className="space-y-2">
                <Label>Register Number</Label>
                <Input value={formData.registerNumber || ''} onChange={e => setFormData({...formData, registerNumber: e.target.value})} placeholder="e.g. 730421104001" />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label>Full Name *</Label>
                <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Student's name" />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email address" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone number" />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Computer Science" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
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
                <Label>Assigned Route</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={formData.assignedRouteId || ''} 
                  onChange={e => {
                    const newRouteId = e.target.value || null;
                    // Reset pickup point if route changes
                    setFormData({...formData, assignedRouteId: newRouteId, pickupStopId: null});
                  }}
                >
                  <option value="">Unassigned</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Pickup Point</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={formData.pickupStopId || ''} 
                  onChange={e => setFormData({...formData, pickupStopId: e.target.value || null})}
                  disabled={!formData.assignedRouteId}
                >
                  <option value="">{formData.assignedRouteId ? 'Select Pickup Point' : 'Select a route first'}</option>
                  {selectedRouteObj?.stops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Assigned Bus</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={formData.assignedBusId || ''} 
                  onChange={e => setFormData({...formData, assignedBusId: e.target.value || null})}
                >
                  <option value="">Unassigned</option>
                  {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber} ({b.registrationNumber})</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search students..." 
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
                  <TableHead className="font-semibold text-slate-600">Student Info</TableHead>
                  <TableHead className="font-semibold text-slate-600">Academics</TableHead>
                  <TableHead className="font-semibold text-slate-600">Contact</TableHead>
                  <TableHead className="font-semibold text-slate-600">Assigned Bus</TableHead>
                  <TableHead className="font-semibold text-slate-600">Route & Pickup</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{student.studentId}</div>
                      {student.registerNumber && <div className="text-xs text-blue-600">{student.registerNumber}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-800">{student.department}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{student.year || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-800 text-sm">{student.phone}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{student.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50">
                        {getBusNumber(student.assignedBusId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-800 text-sm max-w-[150px] truncate" title={getRouteName(student.assignedRouteId)}>
                        {getRouteName(student.assignedRouteId)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-[150px] truncate" title={getPickupPointName(student.assignedRouteId, student.pickupStopId)}>
                        Stop: {getPickupPointName(student.assignedRouteId, student.pickupStopId)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(student)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No students found.
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
