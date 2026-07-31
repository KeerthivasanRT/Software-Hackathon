'use client';

import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserCircle, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StudentProfilePage() {
  const { user, students, updateStudent } = useDataStore();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const studentRecord = students.find(s => s.id === user?.id);
    if (studentRecord) {
      setFormData(studentRecord);
    }
  }, [user, students]);

  const handleSave = () => {
    updateStudent(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and contact details.</p>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <UserCircle className="w-6 h-6 mr-2 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Full Name</Label>
              <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Student ID (Read-only)</Label>
              <Input value={formData.studentId || ''} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Register Number (Read-only)</Label>
              <Input value={formData.registerNumber || ''} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={formData.department || ''} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input value={formData.year || ''} disabled className="bg-slate-50" />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
