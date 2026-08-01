'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Fuel, IndianRupee, Droplets, Gauge, Search } from 'lucide-react';

export default function AdminFuelLogsPage() {
  const { fuelLogs } = useDataStore();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = fuelLogs.filter(log => {
    return log.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.fuelStation.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalFuelAdded = fuelLogs.reduce((acc, f) => acc + f.fuelAddedLitres, 0);
  const totalFuelExpense = fuelLogs.reduce((acc, f) => acc + f.fuelCost, 0);
  const avgCostPerLitre = totalFuelAdded > 0 ? Math.round(totalFuelExpense / totalFuelAdded) : 95;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-[#FEE2E2] text-red-600 rounded-xl">⛽</span>
            Fleet Fuel Audit & Expense Control
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Monitor fleet diesel refilling entries, fuel consumption trends, and expense reports.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Fuel Purchased</p>
              <h3 className="text-3xl font-extrabold text-sky-700">{totalFuelAdded} L</h3>
              <p className="text-xs text-sky-600 font-medium">All Campus Buses</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Fuel className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Fuel Expenditure</p>
              <h3 className="text-3xl font-extrabold text-emerald-600">₹{totalFuelExpense.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-emerald-600 font-medium">Accounts Audited</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-amber-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Avg Price / Litre</p>
              <h3 className="text-3xl font-extrabold text-amber-600">₹{avgCostPerLitre} / L</h3>
              <p className="text-xs text-amber-600 font-medium">Institutional Rate</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Gauge className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Roster */}
      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Fleet Fuel Log Audit Trail</CardTitle>
            <CardDescription className="text-sm">Comprehensive log of driver fuel entries across all routes.</CardDescription>
          </div>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search Bus, Driver, Station..." 
              className="pl-9 h-10 border-[#D6ECFA] bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Driver Name</th>
                  <th className="py-3.5 px-4">Bus & Route</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Odometer</th>
                  <th className="py-3.5 px-4">Fuel Added</th>
                  <th className="py-3.5 px-4">Total Cost</th>
                  <th className="py-3.5 px-4">Fuel Station</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-sky-50/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600">{log.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.driverName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{log.busNumber} ({log.routeName})</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{log.odometer.toLocaleString()} km</td>
                    <td className="py-3.5 px-4 font-extrabold text-sky-700">{log.fuelAddedLitres} L</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{log.fuelCost.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">{log.fuelStation}</td>
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
