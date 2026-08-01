'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardCheck, CheckCircle2, AlertTriangle, ShieldCheck, Wrench, Search, Filter } from 'lucide-react';

export default function AdminInspectionsPage() {
  const { vehicleInspections, buses } = useDataStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = vehicleInspections.filter(insp => {
    const matchesSearch = insp.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          insp.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          insp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || insp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInspections = vehicleInspections.length;
  const goodCount = vehicleInspections.filter(i => i.status === 'Good').length;
  const maintCount = vehicleInspections.filter(i => i.status === 'Needs Maintenance').length;
  const unsafeCount = vehicleInspections.filter(i => i.status === 'Unsafe').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">🚌</span>
            Vehicle Safety Inspection Control
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Real-time driver pre-trip inspection logs, safety scores, and maintenance requests.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Inspections</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{totalInspections}</h3>
              <p className="text-xs text-sky-600 font-medium">Submitted by drivers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Good Condition</p>
              <h3 className="text-3xl font-extrabold text-emerald-600">{goodCount}</h3>
              <p className="text-xs text-emerald-600 font-medium">100% Passed Safety</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Needs Maintenance</p>
              <h3 className="text-3xl font-extrabold text-amber-600">{maintCount}</h3>
              <p className="text-xs text-amber-600 font-medium">Minor issue reported</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Unsafe / Grounded</p>
              <h3 className="text-3xl font-extrabold text-red-600">{unsafeCount}</h3>
              <p className="text-xs text-red-600 font-medium">Do not operate</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Roster */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Vehicle Inspection Audit Roster</CardTitle>
            <CardDescription className="text-sm">Filter and audit driver pre-trip checklists.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input 
                placeholder="Search Bus, Driver, ID..." 
                className="pl-9 h-10 border-[#D6ECFA] bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-40 h-10 border-[#D6ECFA] bg-white text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Needs Maintenance">Needs Maintenance</SelectItem>
                <SelectItem value="Unsafe">Unsafe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Inspection ID</th>
                  <th className="py-3.5 px-4">Driver Name</th>
                  <th className="py-3.5 px-4">Bus & Route</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Checklist Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((insp) => {
                  const passedCount = Object.values(insp.checklist).filter(Boolean).length;
                  return (
                    <tr key={insp.id} className="hover:bg-sky-50/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600">{insp.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{insp.driverName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{insp.busNumber} ({insp.routeName})</td>
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
