'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Filter, X, ShieldAlert, Calendar, PhoneCall, Bus, Navigation, Clock, UserCircle, Activity, ArrowRight, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';
import { Emergency } from '@/types';

export default function AdminEmergencyHistoryPage() {
  const { emergencies, drivers, students, buses, routes } = useDataStore();
  
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterReporter, setFilterReporter] = useState<'all'|'driver'|'student'>('all');
  const [filterRoute, setFilterRoute] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState<Emergency['status'] | ''>('');
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);

  const filteredEmergencies = emergencies.filter(e => {
    const isStudent = e.reportedBy === 'student';
    const driver = drivers.find(d => d.id === e.driverId);
    const student = students.find(s => s.id === e.studentId);
    
    // Search Term (Emergency ID or Reporter Name)
    const matchesSearch = 
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (isStudent ? student?.name.toLowerCase().includes(searchTerm.toLowerCase()) : driver?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    
    // Advanced Filters
    if (filterDate && !e.date.startsWith(filterDate)) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    if (filterReporter !== 'all' && (e.reportedBy || 'driver') !== filterReporter) return false;
    if (filterRoute && e.routeId !== filterRoute) return false;
    if (filterType && e.emergencyType !== filterType && isStudent) return false;

    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const resetFilters = () => {
    setFilterDate('');
    setFilterReporter('all');
    setFilterRoute('');
    setFilterType('');
    setFilterStatus('');
    setSearchTerm('');
  };

  const activeFiltersCount = [filterDate, filterReporter !== 'all' ? filterReporter : '', filterRoute, filterType, filterStatus].filter(Boolean).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-600" />
            Emergency History
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Comprehensive log of all emergency alerts and resolutions.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={`font-semibold shadow-sm rounded-xl h-10 px-4 transition-colors ${showFilters || activeFiltersCount > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-700 border-[#D6ECFA]'}`}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card className="border border-red-100 shadow-sm shadow-red-50/50 bg-white rounded-2xl animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Filter Logs</h3>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-slate-600 hover:text-red-600 h-8">
                  <X className="w-3 h-3 mr-1" /> Clear All Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Date</label>
                <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="h-10 rounded-lg text-sm bg-sky-50 border-[#D6ECFA]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as Emergency['status'])} className="flex h-10 w-full rounded-lg border border-[#D6ECFA] bg-sky-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Reporter</label>
                <select value={filterReporter} onChange={e => setFilterReporter(e.target.value as any)} className="flex h-10 w-full rounded-lg border border-[#D6ECFA] bg-sky-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                  <option value="all">All Reporters</option>
                  <option value="driver">Drivers</option>
                  <option value="student">Students</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Route</label>
                <select value={filterRoute} onChange={e => setFilterRoute(e.target.value)} className="flex h-10 w-full rounded-lg border border-[#D6ECFA] bg-sky-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                  <option value="">All Routes</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-[#D6ECFA] border-t-4 border-t-red-500 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-[#D6ECFA]">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-600 w-4 h-4" />
              <Input 
                placeholder="Search by ID or Driver Name..." 
                className="pl-10 h-10 bg-sky-50/50 border-[#D6ECFA] rounded-xl text-sm focus-visible:ring-red-500/20 focus-visible:bg-white transition-all"
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
                <TableHead className="font-semibold text-slate-600 h-11 px-6">ID & Date</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Reporter</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Type & Location</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11 text-right px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmergencies.map((record) => {
                const isStudent = record.reportedBy === 'student';
                const driver = drivers.find(d => d.id === record.driverId);
                const student = students.find(s => s.id === record.studentId);
                const reporterName = isStudent ? student?.name : driver?.name;
                const reporterId = isStudent ? student?.registerNumber : driver?.employeeId;
                const roleColor = isStudent ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 bg-white';
                
                const bus = buses.find(b => b.id === record.busId);
                const route = routes.find(r => r.id === record.routeId);
                
                return (
                  <TableRow key={record.id} className="hover:bg-sky-50/80 transition-colors border-b border-[#D6ECFA]">
                    <TableCell className="px-6 py-4">
                      <div className="font-bold text-slate-900 tracking-tight text-sm uppercase">{record.id}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(record.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#D6ECFA] ${roleColor}`}>
                          <UserCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                            {reporterName || 'Unknown'} 
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">({isStudent ? 'Student' : 'Driver'})</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">{reporterId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-slate-700">{isStudent ? record.emergencyType : `Bus ${bus?.busNumber}`}</div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5 truncate max-w-[200px]">{route?.name} • {record.pickupPoint}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'active' ? 'destructive' : 'default'} 
                        className={
                          record.status === 'active' ? 'bg-red-600 text-white hover:bg-red-700 shadow-none font-bold px-2.5 py-0.5 capitalize animate-pulse' : 
                          'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 shadow-none font-semibold px-2.5 py-0.5 capitalize'
                        }>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedEmergency(record)} className="font-semibold text-sky-600 hover:text-sky-600 hover:bg-sky-50">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredEmergencies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-slate-700" />
                      </div>
                      <p className="font-bold text-slate-700 text-lg">No emergencies found</p>
                      <p className="text-sm mt-1">Your fleet history is clear based on these filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Emergency Details Dialog */}
      <Dialog open={!!selectedEmergency} onOpenChange={(open) => !open && setSelectedEmergency(null)}>
        {selectedEmergency && (() => {
          const isStudent = selectedEmergency.reportedBy === 'student';
          const driver = drivers.find(d => d.id === selectedEmergency.driverId);
          const student = students.find(s => s.id === selectedEmergency.studentId);
          const reporterName = isStudent ? student?.name : driver?.name;
          const reporterContact = isStudent ? student?.phone : driver?.phone;
          const reporterSecondary = isStudent ? `${student?.department}, Year ${student?.year}` : `License: ${driver?.licenseNumber}`;

          const bus = buses.find(b => b.id === selectedEmergency.busId);
          const route = routes.find(r => r.id === selectedEmergency.routeId);
          const isResolved = selectedEmergency.status === 'resolved';

          return (
            <DialogContent className="sm:max-w-2xl border-[#D6ECFA] shadow-xl overflow-hidden p-0">
              <div className={`h-2 ${isResolved ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex justify-between items-start mb-2">
                    <DialogTitle className="flex flex-col text-xl font-bold text-slate-900">
                      <div className="flex items-center">
                        {isResolved ? <ShieldCheck className="w-6 h-6 mr-2 text-emerald-500" /> : <ShieldAlert className="w-6 h-6 mr-2 text-red-500" />}
                        {isStudent ? 'Student Emergency Report' : 'Driver Emergency Report'}
                      </div>
                      {isStudent && (
                        <span className="text-lg text-red-600 mt-2 font-bold">{selectedEmergency.emergencyType}</span>
                      )}
                    </DialogTitle>
                    <Badge variant={isResolved ? 'default' : 'destructive'} 
                      className={isResolved ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-bold capitalize' : 'bg-red-600 font-bold capitalize'}>
                      {selectedEmergency.status}
                    </Badge>
                  </div>
                  <DialogDescription className="text-sm font-medium text-slate-600">
                    Report ID: {selectedEmergency.id} • Triggered {new Date(selectedEmergency.date).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Personnel Info */}
                  <div className="bg-sky-50 rounded-xl p-5 border border-[#D6ECFA]">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center">
                      <UserCircle className="w-4 h-4 mr-1.5" /> Personnel Information ({isStudent ? 'Student' : 'Driver'})
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-600">Name</p>
                        <p className="font-bold text-slate-900">{reporterName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600">Details</p>
                        <p className="font-bold text-slate-900">{reporterSecondary}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600">Contact Number</p>
                        <p className="font-bold text-slate-900 flex items-center">
                          {reporterContact}
                          <a href={`tel:${reporterContact}`} className="ml-2 text-sky-600 hover:text-blue-800"><PhoneCall className="w-3.5 h-3.5" /></a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Location Info */}
                  <div className="bg-sky-50 rounded-xl p-5 border border-[#D6ECFA]">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center">
                      <Bus className="w-4 h-4 mr-1.5" /> Vehicle & Location
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-600">Bus</p>
                          <p className="font-bold text-slate-900">{bus?.busNumber}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-600">Route</p>
                          <p className="font-bold text-slate-900">{route?.name}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> Last Known Location
                        </p>
                        <p className="font-bold text-slate-900">{selectedEmergency.pickupPoint}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {isStudent && selectedEmergency.description && (
                  <div className="mt-6 bg-red-50/50 rounded-xl p-5 border border-red-100">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Student Description</h4>
                    <p className="text-sm font-medium text-slate-700">"{selectedEmergency.description}"</p>
                  </div>
                )}

                {/* Resolution Info */}
                {isResolved && (
                  <div className="mt-6 bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-1.5" /> Resolution Report
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-600">Action Taken</p>
                        <p className="font-semibold text-slate-800">{selectedEmergency.actionTaken || 'No action recorded.'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600">Administrator Remarks</p>
                        <p className="text-sm font-medium text-slate-700 bg-white p-3 rounded-lg border border-emerald-100/50 mt-1 shadow-sm">
                          "{selectedEmergency.remarks || 'No remarks provided.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isResolved && (
                  <div className="mt-6 flex items-center justify-center p-4 bg-red-50 rounded-xl border border-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="font-semibold text-red-700 text-sm">This emergency requires immediate administrative action.</span>
                  </div>
                )}
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}
