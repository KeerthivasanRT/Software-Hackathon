'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDataStore } from '@/lib/store';
import { Emergency } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, MapPin, Search, Filter, PhoneCall, Bus as BusIcon, Navigation, UserCheck, Trash2, Edit2, ShieldCheck, Siren, Activity } from 'lucide-react';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default function AdminEmergencyControlCenter() {
  const { emergencies, drivers, students, buses, routes, updateEmergencyStatus, deleteEmergencyRecord } = useDataStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');

  // Modal State
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState<string>('');
  const [newStatus, setNewStatus] = useState<Emergency['status']>('Active');
  const [actionRemarks, setActionRemarks] = useState<string>('');

  const openManageModal = (emg: Emergency) => {
    setSelectedEmergency(emg);
    setAssignedStaff(emg.assignedStaff || '');
    setNewStatus(emg.status || 'Active');
    setActionRemarks(emg.remarks || emg.actionTaken || '');
    setIsManageModalOpen(true);
  };

  const handleSaveEmergencyUpdate = () => {
    if (!selectedEmergency) return;
    updateEmergencyStatus(
      selectedEmergency.id,
      newStatus,
      assignedStaff,
      actionRemarks,
      actionRemarks
    );
    setIsManageModalOpen(false);
  };

  // Metrics
  const activeCount = emergencies.filter(e => e.status === 'Active' || e.status === 'Acknowledged' || e.status === 'In Progress' || e.status === 'active').length;
  const resolvedCount = emergencies.filter(e => e.status === 'Resolved' || e.status === 'Closed' || e.status === 'resolved').length;
  const todayCount = emergencies.filter(e => {
    const d = new Date(e.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;
  const avgResponseTime = "4.5 mins";

  // Filtered List
  const filteredEmergencies = emergencies.filter(e => {
    const reporterName = e.reporterName || (e.reportedBy === 'student' ? students.find(s => s.id === e.reporterId)?.name : drivers.find(d => d.id === e.reporterId)?.name) || '';
    const regOrEmp = e.registerNumber || e.employeeId || '';
    const matchesSearch = e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          regOrEmp.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || e.emergencyType === typeFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesRoute = routeFilter === 'all' || e.routeId === routeFilter;

    return matchesSearch && matchesType && matchesStatus && matchesRoute;
  });

  // Active emergencies with coordinates for Map rendering
  const activeEmergencyStops = emergencies
    .filter(e => (e.status === 'Active' || e.status === 'In Progress' || e.status === 'active') && e.latitude && e.longitude)
    .map((e, idx) => ({
      id: e.id,
      name: `🚨 ${e.emergencyType}: ${e.pickupPoint}`,
      latitude: e.latitude!,
      longitude: e.longitude!,
      order: idx + 1
    }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-red-100 text-red-700 rounded-xl animate-pulse">🚨</span>
            Emergency SOS Control Center
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Real-time emergency monitoring, staff dispatch, and incident management.</p>
        </div>
      </div>

      {/* Control Center Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Emergencies</p>
              <h3 className="text-3xl font-extrabold text-red-600">{activeCount}</h3>
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <Siren className="w-3.5 h-3.5 animate-spin" /> High Priority Alert
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Incidents</p>
              <h3 className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Action Completed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Emergencies</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{todayCount}</h3>
              <p className="text-xs text-sky-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Reported Today
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-indigo-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response Time</p>
              <h3 className="text-3xl font-extrabold text-indigo-600">{avgResponseTime}</h3>
              <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Fast Dispatch
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map View */}
      {activeEmergencyStops.length > 0 && (
        <Card className="border border-red-200 shadow-md bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-red-50/60 border-b border-red-100 p-4">
            <CardTitle className="text-base font-bold text-red-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" /> Active Emergency Locations Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[320px]">
            <RouteMap 
              stops={activeEmergencyStops}
              interactive={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Main Roster & Filters */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Emergency Incident Roster</CardTitle>
            <CardDescription className="text-sm">Filter, monitor, assign staff, and update incident statuses.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input 
                placeholder="Search ID, Name, Reg No..." 
                className="pl-9 h-10 border-[#D6ECFA] bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || 'all')}>
              <SelectTrigger className="w-36 h-10 border-[#D6ECFA] bg-white text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                <SelectItem value="Accident">Accident</SelectItem>
                <SelectItem value="Vehicle Breakdown">Vehicle Breakdown</SelectItem>
                <SelectItem value="Harassment">Harassment</SelectItem>
                <SelectItem value="Student Safety">Student Safety</SelectItem>
                <SelectItem value="Fire">Fire</SelectItem>
                <SelectItem value="Traffic Delay">Traffic Delay</SelectItem>
                <SelectItem value="Road Block">Road Block</SelectItem>
                <SelectItem value="Lost Student">Lost Student</SelectItem>
                <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-32 h-10 border-[#D6ECFA] bg-white text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Emergency ID</th>
                  <th className="py-3.5 px-4">Reported By</th>
                  <th className="py-3.5 px-4">Role & ID</th>
                  <th className="py-3.5 px-4">Bus & Route</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Reported Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredEmergencies.map((emg) => {
                  const isStudent = emg.reportedBy === 'student';
                  const reporterName = emg.reporterName || (isStudent ? students.find(s => s.id === emg.reporterId)?.name : drivers.find(d => d.id === emg.reporterId)?.name) || 'Unknown';
                  const regOrEmp = emg.registerNumber || emg.employeeId || 'N/A';
                  const busObj = buses.find(b => b.id === emg.busId);
                  const routeObj = routes.find(r => r.id === emg.routeId);

                  return (
                    <tr key={emg.id} className="hover:bg-sky-50/30 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-red-600">{emg.id}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{reporterName}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <Badge variant="outline" className={`w-fit text-[10px] uppercase font-bold ${isStudent ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                            {emg.reportedBy}
                          </Badge>
                          <span className="text-xs font-mono text-slate-500 mt-0.5">{regOrEmp}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{emg.busNumber || busObj?.busNumber || 'Bus'}</span>
                          <span className="text-xs text-slate-500">{emg.routeName || routeObj?.name || 'Route'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">{emg.pickupPoint}</td>
                      <td className="py-4 px-4 font-bold text-slate-800 text-xs">{emg.emergencyType}</td>
                      <td className="py-4 px-4">
                        <Badge className={`text-[10px] uppercase px-2 py-0.5 font-bold ${
                          emg.priority === 'critical' ? 'bg-red-600 text-white' :
                          emg.priority === 'high' ? 'bg-orange-500 text-white' :
                          emg.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {emg.priority || 'high'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`text-[10px] uppercase px-2.5 py-1 font-bold ${
                          emg.status === 'Active' || emg.status === 'active' ? 'bg-red-100 text-red-800 border-red-200' :
                          emg.status === 'Acknowledged' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          emg.status === 'In Progress' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {emg.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500" suppressHydrationWarning>
                        {new Date(emg.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4 text-right flex items-center justify-end gap-1.5 pt-5">
                        <Button 
                          onClick={() => openManageModal(emg)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold h-8 px-3 rounded-lg text-xs"
                        >
                          Manage
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteEmergencyRecord(emg.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEmergencies.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500 font-medium">
                      No emergency records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MANAGE EMERGENCY MODAL */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="sm:max-w-lg border-red-200 shadow-2xl p-0 overflow-hidden rounded-2xl">
          <div className="bg-red-600 h-2.5" />
          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Siren className="w-5 h-5 text-red-600 animate-pulse" />
                Manage Incident: {selectedEmergency?.id}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Assign emergency response staff, update progress status, and enter resolution remarks.
              </DialogDescription>
            </DialogHeader>

            {selectedEmergency && (
              <div className="space-y-4">
                {/* Summary Info */}
                <div className="bg-red-50/60 border border-red-200 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{selectedEmergency.reporterName || 'Reporter'}</h4>
                      <p className="text-xs text-slate-600">{selectedEmergency.emergencyType} • {selectedEmergency.pickupPoint}</p>
                    </div>
                    <Badge className="bg-red-600 text-white text-[10px] uppercase font-bold">
                      {selectedEmergency.priority || 'CRITICAL'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-red-100 italic">
                    "{selectedEmergency.description || 'No description provided.'}"
                  </p>
                </div>

                {/* Status Selector */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Update Status</Label>
                  <Select value={newStatus} onValueChange={(val: any) => setNewStatus(val)}>
                    <SelectTrigger className="h-10 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active (Alert Dispatched)</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged by Control Room</SelectItem>
                      <SelectItem value="In Progress">In Progress (Staff En Route)</SelectItem>
                      <SelectItem value="Resolved">Resolved (Incident Handled)</SelectItem>
                      <SelectItem value="Closed">Closed (Case Closed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Assign Staff */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Assign Emergency Staff</Label>
                  <Input 
                    placeholder="e.g. Dr. Ramesh (Campus Clinic) / Officer Senthil"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="h-10 border-[#D6ECFA] text-sm"
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Action Remarks / Resolution Details</Label>
                  <Input 
                    placeholder="Enter dispatch notes or resolution details..."
                    value={actionRemarks}
                    onChange={(e) => setActionRemarks(e.target.value)}
                    className="h-10 border-[#D6ECFA] text-sm"
                  />
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setIsManageModalOpen(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveEmergencyUpdate} 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 rounded-lg h-10 shadow-md"
                  >
                    Save & Update Status
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
