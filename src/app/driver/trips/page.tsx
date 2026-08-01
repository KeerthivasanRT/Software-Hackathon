'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { TripRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, CheckCircle2, Clock, XCircle, Navigation, Bus as BusIcon, Search, Calendar, Users, Eye } from 'lucide-react';

export default function DriverTripHistoryPage() {
  const { user, drivers, routes, tripRecords } = useDataStore();

  const currentDriverId = user?.role === 'driver' ? user.id : 'd1';
  const currentDriver = drivers.find(d => d.id === currentDriverId) || drivers[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');

  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const myTrips = tripRecords.filter(t => t.driverId === currentDriver?.id);

  const filteredTrips = myTrips.filter(trip => {
    const matchesSearch = trip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trip.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trip.busNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    const matchesRoute = routeFilter === 'all' || trip.routeId === routeFilter;

    return matchesSearch && matchesStatus && matchesRoute;
  });

  const totalDistance = myTrips.reduce((acc, t) => acc + t.distanceCovered, 0);
  const totalStudentsTransported = myTrips.reduce((acc, t) => acc + t.studentsPresent, 0);
  const completedCount = myTrips.filter(t => t.status === 'Completed').length;

  const openTripDetail = (trip: TripRecord) => {
    setSelectedTrip(trip);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">📖</span>
            Driver Trip History & Logs
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Log of completed transit runs, passenger attendance counts, and route distance metrics.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Completed Trips</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{completedCount}</h3>
              <p className="text-xs text-sky-600 font-medium">On-time performance: 96%</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Distance</p>
              <h3 className="text-3xl font-extrabold text-emerald-600">{totalDistance} km</h3>
              <p className="text-xs text-emerald-600 font-medium">Log Odometer Verified</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Navigation className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-indigo-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Students Transported</p>
              <h3 className="text-3xl font-extrabold text-indigo-600">{totalStudentsTransported}</h3>
              <p className="text-xs text-indigo-600 font-medium">Safe Transit Delivered</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Roster & Filters */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Trip History Roster</CardTitle>
            <CardDescription className="text-sm">Filter completed, cancelled, or delayed trips.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input 
                placeholder="Search Trip ID, Route..." 
                className="pl-9 h-10 border-[#D6ECFA] bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={routeFilter} onValueChange={(val: any) => setRouteFilter(val || 'all')}>
              <SelectTrigger className="w-36 h-10 border-[#D6ECFA] bg-white text-sm">
                <SelectValue placeholder="All Routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-32 h-10 border-[#D6ECFA] bg-white text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Trip ID</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Route & Bus</th>
                  <th className="py-3.5 px-4">Distance</th>
                  <th className="py-3.5 px-4">Stops</th>
                  <th className="py-3.5 px-4">Students Present / Absent</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-sky-50/30">
                    <td className="py-4 px-4 font-mono font-bold text-sky-600">{trip.id}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                      <div>{new Date(trip.date).toLocaleDateString()}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{trip.startTime} - {trip.endTime}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{trip.routeName} ({trip.busNumber})</td>
                    <td className="py-4 px-4 font-extrabold text-slate-800">{trip.distanceCovered} km</td>
                    <td className="py-4 px-4 text-xs text-slate-600">{trip.stopsCovered} Stops</td>
                    <td className="py-4 px-4 text-xs font-semibold">
                      <span className="text-emerald-600 font-bold">{trip.studentsPresent} Present</span> / <span className="text-amber-600">{trip.studentsAbsent} Absent</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`text-[10px] uppercase px-2.5 py-1 font-bold ${
                        trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        trip.status === 'Delayed' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {trip.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button 
                        variant="outline"
                        onClick={() => openTripDetail(trip)}
                        className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-sky-50 gap-1 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* TRIP DETAILS MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-md border-[#D6ECFA] shadow-2xl p-0 overflow-hidden rounded-2xl">
          <div className="bg-sky-600 h-2.5" />
          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                Trip Summary: {selectedTrip?.id}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Comprehensive log details for {selectedTrip?.routeName}.
              </DialogDescription>
            </DialogHeader>

            {selectedTrip && (
              <div className="space-y-4">
                <div className="bg-sky-50/70 p-4 rounded-xl border border-[#D6ECFA] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-base">{selectedTrip.routeName}</span>
                    <Badge className="bg-sky-600 text-white font-bold">{selectedTrip.busNumber}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Date: {new Date(selectedTrip.date).toLocaleDateString()} ({selectedTrip.startTime} - {selectedTrip.endTime})</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Distance Covered:</span>
                    <p className="text-slate-900 font-bold text-sm">{selectedTrip.distanceCovered} km</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Stops Serviced:</span>
                    <p className="text-slate-900 font-bold text-sm">{selectedTrip.stopsCovered} Stops</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Students Present:</span>
                    <p className="text-emerald-600 font-bold text-sm">{selectedTrip.studentsPresent}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Students Absent:</span>
                    <p className="text-amber-600 font-bold text-sm">{selectedTrip.studentsAbsent}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Driver Notes:</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 italic">
                    "{selectedTrip.notes || 'Trip completed normally.'}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
