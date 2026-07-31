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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-600 mt-1 font-medium">Manage your personal information and contact details.</p>
      </div>

      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl max-w-3xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/50 pb-4 px-6 pt-6">
          <CardTitle className="flex items-center text-slate-800 text-lg">
            <UserCircle className="w-5 h-5 mr-2 text-sky-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</Label>
              <Input className="h-11 rounded-lg border-[#D6ECFA] focus-visible:ring-sky-500/20 text-slate-900 font-medium" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">Student ID <span className="text-[10px] text-slate-600 font-medium lowercase">Read-only</span></Label>
              <Input value={formData.studentId || ''} disabled className="h-11 rounded-lg bg-sky-50 border-[#D6ECFA] text-slate-600 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">Register Number <span className="text-[10px] text-slate-600 font-medium lowercase">Read-only</span></Label>
              <Input value={formData.registerNumber || ''} disabled className="h-11 rounded-lg bg-sky-50 border-[#D6ECFA] text-slate-600 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</Label>
              <Input className="h-11 rounded-lg border-[#D6ECFA] focus-visible:ring-sky-500/20" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</Label>
              <Input className="h-11 rounded-lg border-[#D6ECFA] focus-visible:ring-sky-500/20" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">Department <span className="text-[10px] text-slate-600 font-medium lowercase">Read-only</span></Label>
              <Input value={formData.department || ''} disabled className="h-11 rounded-lg bg-sky-50 border-[#D6ECFA] text-slate-600 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">Year <span className="text-[10px] text-slate-600 font-medium lowercase">Read-only</span></Label>
              <Input value={formData.year || ''} disabled className="h-11 rounded-lg bg-sky-50 border-[#D6ECFA] text-slate-600 cursor-not-allowed" />
            </div>
          </div>
          <div className="pt-4 flex justify-end border-t border-[#D6ECFA]">
            <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg h-11 px-6 shadow-sm font-semibold transition-all mt-4" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
