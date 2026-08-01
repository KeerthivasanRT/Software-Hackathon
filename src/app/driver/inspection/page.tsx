'use client';

import { useState, useEffect } from 'react';
import { useDataStore } from '@/lib/store';
import { VehicleChecklist, VehicleInspection } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardCheck, CheckCircle2, AlertTriangle, ShieldCheck, Wrench, XCircle, RotateCcw, Clock, Bus as BusIcon, Navigation } from 'lucide-react';

export default function DriverInspectionPage() {
  const { user, drivers, buses, routes, vehicleInspections, addVehicleInspection } = useDataStore();

  const currentDriverId = user?.role === 'driver' ? user.id : 'd1';
  const currentDriver = drivers.find(d => d.id === currentDriverId) || drivers[0];
  const assignedBus = buses.find(b => b.id === currentDriver?.assignedBusId);
  const assignedRoute = routes.find(r => r.id === currentDriver?.assignedRouteId);

  const [currentTime, setCurrentTime] = useState('07:15 AM');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // Initial checklist items (12 safety points)
  const initialChecklist: VehicleChecklist = {
    brakes: true,
    tyres: true,
    headlights: true,
    indicators: true,
    horn: true,
    mirrors: true,
    windshield: true,
    fuelLevel: true,
    battery: true,
    fireExtinguisher: true,
    firstAidKit: true,
    emergencyExit: true,
  };

  const [checklist, setChecklist] = useState<VehicleChecklist>(initialChecklist);
  const [additionalRemarks, setAdditionalRemarks] = useState('');
  const [status, setStatus] = useState<'Good' | 'Needs Maintenance' | 'Unsafe'>('Good');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleCheck = (key: keyof VehicleChecklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);

    // Auto calculate status based on checklist failures
    const failedCount = Object.values(updated).filter(val => !val).length;
    if (failedCount === 0) setStatus('Good');
    else if (failedCount <= 2) setStatus('Needs Maintenance');
    else setStatus('Unsafe');
  };

  const handleReset = () => {
    setChecklist(initialChecklist);
    setAdditionalRemarks('');
    setStatus('Good');
    setSuccessMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInspection: VehicleInspection = {
      id: `insp-${Math.floor(100 + Math.random() * 900)}`,
      driverId: currentDriver?.id || 'd1',
      driverName: currentDriver?.name || 'S. Kumar',
      busId: assignedBus?.id || 'b1',
      busNumber: assignedBus?.busNumber || 'BUS-001',
      routeId: assignedRoute?.id || 'r1',
      routeName: assignedRoute?.name || 'Route A',
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checklist,
      additionalRemarks: additionalRemarks || 'Pre-trip safety inspection completed.',
      status,
    };

    addVehicleInspection(newInspection);
    setSuccessMsg(`Vehicle inspection for ${newInspection.busNumber} submitted successfully. Status: ${status}. Admin notified.`);
  };

  const myInspections = vehicleInspections.filter(i => i.driverId === currentDriver?.id);

  const checklistItems: { key: keyof VehicleChecklist; label: string }[] = [
    { key: 'brakes', label: 'Brake System' },
    { key: 'tyres', label: 'Tyres & Pressure' },
    { key: 'headlights', label: 'Head Lights & High Beams' },
    { key: 'indicators', label: 'Indicators & Hazard Lights' },
    { key: 'horn', label: 'Horn System' },
    { key: 'mirrors', label: 'Side & Rear Mirrors' },
    { key: 'windshield', label: 'Windshield & Wipers' },
    { key: 'fuelLevel', label: 'Fuel Level' },
    { key: 'battery', label: 'Battery & Electricals' },
    { key: 'fireExtinguisher', label: 'Fire Extinguisher' },
    { key: 'firstAidKit', label: 'First Aid Kit' },
    { key: 'emergencyExit', label: 'Emergency Exit Door' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">🚌</span>
            Pre-Trip Vehicle Inspection
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Perform mandatory pre-trip safety checks before departure to ensure passenger safety.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHECKLIST FORM */}
        <Card className="lg:col-span-2 border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-sky-50/50 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" /> Mandatory Safety Checklist
            </CardTitle>
            <CardDescription className="text-xs">
              Check all 12 mandatory safety items before operating bus {assignedBus ? assignedBus.busNumber : 'BUS-001'}.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 font-bold text-emerald-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {successMsg}
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSuccessMsg(null)} className="h-8 text-xs text-emerald-700">Dismiss</Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver & Bus Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-medium">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Driver</span>
                  <p className="text-slate-900 font-bold text-sm">{currentDriver?.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Bus</span>
                  <p className="text-slate-900 font-bold text-sm">{assignedBus ? assignedBus.busNumber : 'BUS-001'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Route</span>
                  <p className="text-slate-900 font-bold text-sm">{assignedRoute ? assignedRoute.name : 'Route A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Date & Time</span>
                  <p className="text-slate-900 font-bold text-sm" suppressHydrationWarning>{currentTime}</p>
                </div>
              </div>

              {/* 12-Point Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {checklistItems.map(({ key, label }) => {
                  const isChecked = checklist[key];
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => handleToggleCheck(key)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold' 
                          : 'bg-red-50/60 border-red-200 text-red-900 font-semibold shadow-sm'
                      }`}
                    >
                      <span className="text-xs">{label}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isChecked ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                        {isChecked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Status Selector & Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Overall Vehicle Condition</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="h-11 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">🟢 Good - Safe to Operate</SelectItem>
                      <SelectItem value="Needs Maintenance">🟡 Needs Maintenance - Minor Issue</SelectItem>
                      <SelectItem value="Unsafe">🔴 Unsafe - Do Not Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Additional Inspection Remarks</Label>
                  <Input 
                    value={additionalRemarks}
                    onChange={(e) => setAdditionalRemarks(e.target.value)}
                    placeholder="Enter any minor observations or workshop requests..."
                    className="h-11 border-[#D6ECFA] text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 px-6 rounded-xl shadow-md gap-2 flex-1">
                  <ClipboardCheck className="w-4 h-4" /> Submit Safety Inspection
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} className="border-slate-300 h-11 px-4 rounded-xl gap-1">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Side Summary */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-sky-600" /> Inspection Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-medium text-slate-600">
            <p>Mandatory regulations require drivers to perform pre-trip inspections prior to starting academic transit operations.</p>

            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                <span className="font-bold block">🟢 GOOD</span>
                All 12 safety points pass. Bus cleared for service.
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                <span className="font-bold block">🟡 NEEDS MAINTENANCE</span>
                1-2 minor issues reported. Depot workshop notified.
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800">
                <span className="font-bold block">🔴 UNSAFE</span>
                Critical failure (brakes/tyres). Replacement bus assigned.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INSPECTION HISTORY TABLE */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5">
          <CardTitle className="text-lg font-bold text-slate-800">My Inspection Log History</CardTitle>
          <CardDescription className="text-xs">Audit log of all pre-trip inspections completed by you.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Inspection ID</th>
                  <th className="py-3.5 px-4">Bus & Route</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Checklist Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myInspections.map((insp) => {
                  const passedCount = Object.values(insp.checklist).filter(Boolean).length;
                  return (
                    <tr key={insp.id} className="hover:bg-sky-50/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600">{insp.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{insp.busNumber} ({insp.routeName})</td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{new Date(insp.date).toLocaleDateString()} {insp.time}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{passedCount} / 12 Passed</td>
                      <td className="py-3.5 px-4">
                        <Badge className={`text-[10px] uppercase px-2.5 py-1 font-bold ${
                          insp.status === 'Good' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          insp.status === 'Needs Maintenance' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {insp.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{insp.additionalRemarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
