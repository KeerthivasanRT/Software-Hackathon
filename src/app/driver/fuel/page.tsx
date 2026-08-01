'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { FuelLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Fuel, CheckCircle2, IndianRupee, Droplets, Gauge, MapPin, Plus } from 'lucide-react';

export default function DriverFuelLogPage() {
  const { user, drivers, buses, routes, fuelLogs, addFuelLog } = useDataStore();

  const currentDriverId = user?.role === 'driver' ? user.id : 'd1';
  const currentDriver = drivers.find(d => d.id === currentDriverId) || drivers[0];
  const assignedBus = buses.find(b => b.id === currentDriver?.assignedBusId);
  const assignedRoute = routes.find(r => r.id === currentDriver?.assignedRouteId);

  // Form State
  const [odometer, setOdometer] = useState<number>(48275);
  const [fuelAddedLitres, setFuelAddedLitres] = useState<number>(45);
  const [fuelCost, setFuelCost] = useState<number>(4275); // 45 * 95
  const [fuelStation, setFuelStation] = useState<string>('HP Auto Fuel Station, Sathyamangalam');
  const [remarks, setRemarks] = useState<string>('Full tank refilled before evening route.');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLitresChange = (litres: number) => {
    setFuelAddedLitres(litres);
    setFuelCost(litres * 95); // Approx ₹95 per L
  };

  const handleSubmitFuelLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: FuelLog = {
      id: `fuel-${Math.floor(100 + Math.random() * 900)}`,
      driverId: currentDriver?.id || 'd1',
      driverName: currentDriver?.name || 'S. Kumar',
      busId: assignedBus?.id || 'b1',
      busNumber: assignedBus?.busNumber || 'BUS-001',
      routeId: assignedRoute?.id || 'r1',
      routeName: assignedRoute?.name || 'Route A',
      date: new Date().toISOString(),
      odometer,
      fuelAddedLitres,
      fuelCost,
      fuelStation,
      remarks,
    };

    addFuelLog(newLog);
    setSuccessMsg(`Fuel entry of ${fuelAddedLitres} L (₹${fuelCost.toLocaleString('en-IN')}) saved successfully. Admin notified.`);
  };

  const myFuelLogs = fuelLogs.filter(f => f.driverId === currentDriver?.id);

  // Fuel Dashboard Calculations
  const fuelAddedThisMonth = myFuelLogs.reduce((acc, f) => acc + f.fuelAddedLitres, 0);
  const totalFuelCostThisMonth = myFuelLogs.reduce((acc, f) => acc + f.fuelCost, 0);
  const avgMileage = assignedBus?.averageMileage || 4.5;
  const currentFuelLitres = 46.8; // ~78% of 60L tank
  const estRemainingDistance = Math.round(currentFuelLitres * avgMileage);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-[#FEE2E2] text-red-600 rounded-xl">⛽</span>
            Bus Fuel Refilling Log
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Log diesel refilling entries, monitor fuel metrics, and track average mileage.</p>
        </div>
      </div>

      {/* Fuel Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Current Fuel Level</p>
              <h3 className="text-3xl font-extrabold text-sky-700">{currentFuelLitres} L</h3>
              <p className="text-xs text-sky-600 font-medium">~78% Tank Capacity</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Droplets className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Added This Month</p>
              <h3 className="text-3xl font-extrabold text-emerald-600">{fuelAddedThisMonth} L</h3>
              <p className="text-xs text-emerald-600 font-medium">Total: ₹{totalFuelCostThisMonth.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Fuel className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-amber-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Average Mileage</p>
              <h3 className="text-3xl font-extrabold text-amber-600">{avgMileage} km/L</h3>
              <p className="text-xs text-amber-600 font-medium">Depot Standard Range</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Gauge className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-indigo-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Est Remaining Range</p>
              <h3 className="text-3xl font-extrabold text-indigo-600">{estRemainingDistance} km</h3>
              <p className="text-xs text-indigo-600 font-medium">Sufficient for 6 Trips</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ADD FUEL ENTRY FORM */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-sky-600" /> Record Fuel Refilling Entry
          </CardTitle>
          <CardDescription className="text-xs">
            Log diesel volume, refilling cost, and current odometer reading for bus {assignedBus ? assignedBus.busNumber : 'BUS-001'}.
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

          <form onSubmit={handleSubmitFuelLog} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Bus Number</Label>
                <Input value={assignedBus ? assignedBus.busNumber : 'BUS-001'} disabled className="h-10 border-[#D6ECFA] bg-slate-50 font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Assigned Route</Label>
                <Input value={assignedRoute ? assignedRoute.name : 'Route A'} disabled className="h-10 border-[#D6ECFA] bg-slate-50 font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Current Odometer (km)</Label>
                <Input 
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(Number(e.target.value))}
                  className="h-10 border-[#D6ECFA] font-mono text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Fuel Added (Litres)</Label>
                <Input 
                  type="number"
                  value={fuelAddedLitres}
                  onChange={(e) => handleLitresChange(Number(e.target.value))}
                  className="h-10 border-[#D6ECFA] font-bold text-sky-700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Fuel Cost (₹)</Label>
                <Input 
                  type="number"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(Number(e.target.value))}
                  className="h-10 border-[#D6ECFA] font-bold text-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 uppercase">Fuel Station / Location</Label>
                <Input 
                  value={fuelStation}
                  onChange={(e) => setFuelStation(e.target.value)}
                  className="h-10 border-[#D6ECFA] text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700 uppercase">Remarks / Notes</Label>
              <Input 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional fuel log remarks..."
                className="h-10 border-[#D6ECFA] text-sm"
              />
            </div>

            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 px-6 rounded-xl shadow-md gap-2">
              <Fuel className="w-4 h-4" /> Save Fuel Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FUEL LOG HISTORY TABLE */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5">
          <CardTitle className="text-lg font-bold text-slate-800">My Fuel Log History</CardTitle>
          <CardDescription className="text-xs">Complete history of diesel refilling entries.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Bus</th>
                  <th className="py-3.5 px-4">Odometer</th>
                  <th className="py-3.5 px-4">Fuel Added</th>
                  <th className="py-3.5 px-4">Total Cost</th>
                  <th className="py-3.5 px-4">Fuel Station</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myFuelLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-sky-50/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600">{log.id}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.busNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{log.odometer.toLocaleString()} km</td>
                    <td className="py-3.5 px-4 font-extrabold text-sky-700">{log.fuelAddedLitres} L</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{log.fuelCost.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">{log.fuelStation}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{log.remarks || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
