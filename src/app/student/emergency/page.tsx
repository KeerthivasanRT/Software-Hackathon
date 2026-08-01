'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, Siren, CheckCircle2, Clock, MapPin, PhoneCall, Bus as BusIcon, Navigation, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

export default function StudentEmergencyPage() {
  const { user, students, buses, routes, emergencies, triggerEmergency } = useDataStore();

  // Identify logged in student or default to st1
  const currentStudentId = user?.role === 'student' ? user.id : 'st1';
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const assignedBus = buses.find(b => b.id === currentStudent?.assignedBusId);
  const assignedRoute = routes.find(r => r.id === currentStudent?.assignedRouteId);

  // Form State
  const [emergencyType, setEmergencyType] = useState<string>('Medical Emergency');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('critical');
  const [pickupPoint, setPickupPoint] = useState<string>(assignedRoute?.stops[0]?.name || 'Annur Bus Stand');
  const [emergencyContact, setEmergencyContact] = useState<string>(currentStudent?.phone || '+91 98765 43210');
  const [description, setDescription] = useState<string>('');

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmitEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `EMG-${Math.floor(100 + Math.random() * 900)}`;

    triggerEmergency({
      id: newId,
      reportedBy: 'student',
      reporterName: currentStudent?.name || 'Arun Kumar',
      reporterId: currentStudent?.id || 'st1',
      registerNumber: currentStudent?.registerNumber || '7376221CS101',
      busId: assignedBus?.id || 'b1',
      busNumber: assignedBus?.busNumber || 'BUS-001',
      routeId: assignedRoute?.id || 'r1',
      routeName: assignedRoute?.name || 'Route A',
      pickupPoint: pickupPoint || 'Pickup Stop',
      latitude: assignedRoute?.stops[0]?.latitude || 11.2333,
      longitude: assignedRoute?.stops[0]?.longitude || 77.1000,
      emergencyType,
      priority,
      description: description || `Student reported ${emergencyType} at ${pickupPoint}.`,
      emergencyContact,
      date: new Date().toISOString(),
      status: 'Active',
      assignedStaff: 'Campus Control Room',
      remarks: 'Alert dispatched to Control Center.'
    });

    setSubmittedId(newId);
    setDescription('');
  };

  // Emergencies reported by this student
  const myEmergencies = emergencies.filter(e => e.reporterId === currentStudent?.id || (e.reportedBy === 'student' && e.registerNumber === currentStudent?.registerNumber));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-red-100 text-red-700 rounded-xl animate-pulse">🚨</span>
            Student Emergency SOS
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Instantly trigger campus medical, safety, or bus delay assistance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REPORT FORM */}
        <Card className="lg:col-span-2 border border-red-200 shadow-md bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-red-50/70 border-b border-red-100 p-5">
            <CardTitle className="text-lg font-bold text-red-800 flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-600 animate-spin" /> Submit Emergency Alert
            </CardTitle>
            <CardDescription className="text-xs text-red-700 font-medium">
              Your student profile, bus, and route details are automatically attached to this dispatch report.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {submittedId && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 space-y-2 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 font-bold text-emerald-700 text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Emergency Report Submitted Successfully!
                </div>
                <p className="text-xs font-medium">
                  Incident ID: <span className="font-mono font-bold text-emerald-900">{submittedId}</span>. Campus Emergency Control Center has dispatched immediate assistance.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitEmergency} className="space-y-5">
              {/* Auto-filled student info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-medium">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Student Name</span>
                  <p className="text-slate-900 font-bold text-sm">{currentStudent?.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Register No</span>
                  <p className="text-slate-900 font-mono font-bold text-sm">{currentStudent?.registerNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Bus Number</span>
                  <p className="text-slate-900 font-bold text-sm">{assignedBus ? assignedBus.busNumber : 'BUS-001'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Route Name</span>
                  <p className="text-slate-900 font-bold text-sm">{assignedRoute ? assignedRoute.name : 'Route A'}</p>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Emergency Type</Label>
                  <Select value={emergencyType} onValueChange={(val) => setEmergencyType(val || 'Medical Emergency')}>
                    <SelectTrigger className="h-10 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Emergency Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                      <SelectItem value="Student Safety">Student Safety / Security</SelectItem>
                      <SelectItem value="Harassment">Harassment Concern</SelectItem>
                      <SelectItem value="Accident">Road Accident</SelectItem>
                      <SelectItem value="Vehicle Breakdown">Bus Breakdown</SelectItem>
                      <SelectItem value="Fire">Fire Hazard</SelectItem>
                      <SelectItem value="Traffic Delay">Severe Delay</SelectItem>
                      <SelectItem value="Lost Student">Lost / Left Behind</SelectItem>
                      <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                      <SelectItem value="Other">Other Concern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Priority Level</Label>
                  <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                    <SelectTrigger className="h-10 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical (Urgent Assistance)</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Pickup Location / Stop</Label>
                  <Input 
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="e.g. Annur Bus Stand / Stop 3"
                    className="h-10 border-[#D6ECFA] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Emergency Phone Number</Label>
                  <Input 
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Enter contact number"
                    className="h-10 border-[#D6ECFA] text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Description / Optional Notes</Label>
                <Textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your emergency situation clearly..."
                  className="border-[#D6ECFA] text-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-base rounded-xl shadow-md gap-2">
                <Siren className="w-5 h-5 animate-pulse" /> Dispatch Student SOS
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Hotlines */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-600" /> Campus Hotlines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <span className="font-bold text-red-800 text-sm">24/7 Security Helpline</span>
              <p className="text-red-700 font-mono font-bold text-base">+91 94422 99999</p>
              <p className="text-[10px] text-red-600">Immediate Campus Response Unit</p>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
              <span className="font-bold text-sky-800 text-sm">BIT Campus Clinic</span>
              <p className="text-sky-700 font-mono font-bold text-base">+91 94422 67890</p>
              <p className="text-[10px] text-sky-600">Ambulance & Trauma Medical Unit</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STUDENT EMERGENCY HISTORY & TRACKER */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5">
          <CardTitle className="text-lg font-bold text-slate-800">My Emergency History & Status Tracker</CardTitle>
          <CardDescription className="text-xs">Real-time status tracking for your reported incidents.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {myEmergencies.map((emg) => {
            const steps = ['Active', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'];
            const currentStepIdx = steps.findIndex(s => s.toLowerCase() === emg.status?.toLowerCase()) >= 0
              ? steps.findIndex(s => s.toLowerCase() === emg.status?.toLowerCase())
              : (emg.status === 'resolved' ? 3 : 0);

            return (
              <div key={emg.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/60 space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-600 text-base">{emg.id}</span>
                      <Badge className="bg-red-100 text-red-800 font-bold text-xs">{emg.emergencyType}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">Location: {emg.pickupPoint} • Priority: {emg.priority?.toUpperCase() || 'CRITICAL'}</p>
                  </div>

                  <span className="text-xs text-slate-400 font-mono" suppressHydrationWarning>{new Date(emg.date).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>

                {/* Step Bar */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Live Response Progress:</span>
                  <div className="flex items-center justify-between relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-slate-200 before:z-0 px-2">
                    {steps.map((stepName, idx) => {
                      const isPassed = idx <= currentStepIdx;
                      return (
                        <div key={stepName} className="relative z-10 flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all ${isPassed ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-300'}`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold mt-1 ${isPassed ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {emg.assignedStaff && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-sky-600" /> Assigned Staff / Remarks:
                    </span>
                    <p className="text-slate-800 font-medium">{emg.assignedStaff} — {emg.remarks || 'Action in progress.'}</p>
                  </div>
                )}
              </div>
            );
          })}

          {myEmergencies.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-6">No previous emergency alerts submitted.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
