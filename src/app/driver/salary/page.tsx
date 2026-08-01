'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { SalaryRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { IndianRupee, CheckCircle2, Clock, CreditCard, Building2, Printer, Download, ShieldCheck, Bus as BusIcon, Navigation, FileText, Sparkles } from 'lucide-react';

export default function DriverSalaryPage() {
  const { user, drivers, buses, routes, salaryRecords } = useDataStore();
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // Identify current logged in driver. Default to 'd1' (S. Kumar) or first driver if not logged in.
  const currentDriverId = user?.role === 'driver' ? user.id : 'd1';
  const currentDriver = drivers.find(d => d.id === currentDriverId) || drivers[0];
  const assignedBus = buses.find(b => b.id === currentDriver?.assignedBusId);
  const assignedRoute = routes.find(r => r.id === currentDriver?.assignedRouteId);

  // Get salary record for current driver
  const mySalaryRecord = salaryRecords.find(s => s.driverId === currentDriver?.id) || {
    id: 'sal-demo',
    driverId: currentDriver?.id || 'd1',
    driverName: currentDriver?.name || 'S. Kumar',
    employeeId: currentDriver?.employeeId || 'DRV-001',
    month: 'August 2026',
    basicSalary: 32000,
    allowances: 5000,
    bonus: 2000,
    deductions: 1500,
    netSalary: 37500,
    paymentStatus: 'paid' as const,
    paymentDate: '01 August 2026',
    paymentMethod: 'Net Banking' as const,
    bankName: 'State Bank of India',
    accountNumberMasked: '•••• •••• 4829',
    ifscCode: 'SBIN0001234',
    transactionId: 'TXN240801001',
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">💰</span>
            My Salary & Earnings
          </h1>
          <p className="text-slate-600 mt-1 font-medium">View your monthly salary statement, direct net banking status, and download slips.</p>
        </div>

        {mySalaryRecord.paymentStatus === 'paid' && (
          <Button 
            onClick={() => setIsSlipOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-5 rounded-xl shadow-sm gap-2"
          >
            <FileText className="w-4 h-4" /> Download Salary Slip
          </Button>
        )}
      </div>

      {/* Driver & Status Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-[#D6ECFA] bg-gradient-to-br from-white via-sky-50/30 to-emerald-50/20 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver Profile</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{mySalaryRecord.driverName}</h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">Emp ID: {mySalaryRecord.employeeId} • {currentDriver?.email}</p>
              </div>

              <div className="flex items-center gap-2">
                {mySalaryRecord.paymentStatus === 'paid' ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-3 py-1 font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Salary Credited
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-sm px-3 py-1 font-bold">
                    <Clock className="w-4 h-4 mr-1.5" /> Payment Pending
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D6ECFA]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Bus</span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <BusIcon className="w-4 h-4 text-sky-600" /> {assignedBus ? assignedBus.busNumber : 'Unassigned'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Route</span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-sky-600" /> {assignedRoute ? assignedRoute.name : 'No route'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Pay Period</span>
                <p className="text-sm font-semibold text-slate-900">{mySalaryRecord.month}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Salary Highlight Card */}
        <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md rounded-2xl flex flex-col justify-between p-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Net Take-Home Salary
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight">₹{mySalaryRecord.netSalary.toLocaleString('en-IN')}</h2>
            <p className="text-xs text-emerald-100 font-medium">Direct Credited to Bank Account</p>
          </div>

          <div className="pt-4 border-t border-emerald-500/50 space-y-1 text-xs text-emerald-100 font-mono">
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-bold text-white">{mySalaryRecord.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Ref ID:</span>
              <span className="font-bold text-white">{mySalaryRecord.transactionId || 'Awaiting Disbursal'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-bold text-white">{mySalaryRecord.paymentDate || 'Pending'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Salary Breakdown Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5">
            <CardTitle className="text-lg font-bold text-slate-800">Earnings & Deductions Breakdown</CardTitle>
            <CardDescription className="text-xs">Detailed calculation for the current salary period ({mySalaryRecord.month})</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Component</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">Basic Salary</td>
                  <td className="py-3.5 px-5 text-xs text-slate-500">Base Earnings</td>
                  <td className="py-3.5 px-5 text-right font-bold text-slate-900">₹{mySalaryRecord.basicSalary.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">Transport & DA Allowances</td>
                  <td className="py-3.5 px-5 text-xs text-emerald-600 font-medium">Allowance</td>
                  <td className="py-3.5 px-5 text-right font-bold text-emerald-600">+₹{mySalaryRecord.allowances.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">Performance Incentive / Bonus</td>
                  <td className="py-3.5 px-5 text-xs text-emerald-600 font-medium">Incentive</td>
                  <td className="py-3.5 px-5 text-right font-bold text-emerald-600">+₹{mySalaryRecord.bonus.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">PF & Tax Deductions</td>
                  <td className="py-3.5 px-5 text-xs text-red-500 font-medium">Deduction</td>
                  <td className="py-3.5 px-5 text-right font-bold text-red-500">-₹{mySalaryRecord.deductions.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-sky-50/60 font-bold">
                  <td className="py-4 px-5 text-slate-900 text-base" colSpan={2}>Net Payable Amount</td>
                  <td className="py-4 px-5 text-right text-emerald-700 text-lg font-extrabold">₹{mySalaryRecord.netSalary.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Banking Info */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" /> Bank Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Bank Name</span>
              <p className="text-sm font-bold text-slate-800">{mySalaryRecord.bankName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Account Number</span>
              <p className="text-sm font-mono font-bold text-slate-800">{mySalaryRecord.accountNumberMasked}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">IFSC Code</span>
              <p className="text-sm font-mono font-bold text-slate-800">{mySalaryRecord.ifscCode}</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" /> Direct Net Banking Credit Verified
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PRINTABLE SALARY SLIP MODAL */}
      <Dialog open={isSlipOpen} onOpenChange={setIsSlipOpen}>
        <DialogContent className="sm:max-w-2xl border-[#D6ECFA] shadow-2xl p-0 overflow-hidden rounded-2xl print:shadow-none print:border-none">
          <div className="bg-sky-600 h-2 print:hidden" />
          <div className="p-8 space-y-6 bg-white" id="salary-slip">
            {/* Header / Logo */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">BANNARI AMMAN INSTITUTE OF TECHNOLOGY</h2>
                <p className="text-xs font-bold text-sky-700 uppercase tracking-widest mt-0.5">Transport Department • Pay Slip</p>
                <p className="text-xs text-slate-500 font-medium">Sathyamangalam, Erode District, Tamil Nadu - 638401</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-300">
                  {mySalaryRecord.month.toUpperCase()}
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Ref: {mySalaryRecord.id.toUpperCase()}</p>
              </div>
            </div>

            {/* Driver details grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Driver Name:</span>
                <p className="text-slate-900 font-bold text-sm">{mySalaryRecord.driverName}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Employee ID:</span>
                <p className="text-slate-900 font-bold text-sm font-mono">{mySalaryRecord.employeeId}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Assigned Bus:</span>
                <p className="text-slate-900 font-bold">{assignedBus ? `${assignedBus.busNumber} (${assignedBus.registrationNumber})` : 'BUS-001'}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Assigned Route:</span>
                <p className="text-slate-900 font-bold">{assignedRoute ? assignedRoute.name : 'Route A'}</p>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 border-b border-slate-300">Pay Head / Component</th>
                  <th className="py-2.5 px-3 border-b border-slate-300 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3">Basic Salary</td>
                  <td className="py-2 px-3 text-right font-semibold">₹{mySalaryRecord.basicSalary.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Dearness & Transport Allowance</td>
                  <td className="py-2 px-3 text-right font-semibold">₹{mySalaryRecord.allowances.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Performance Bonus</td>
                  <td className="py-2 px-3 text-right font-semibold">₹{mySalaryRecord.bonus.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="text-red-600">
                  <td className="py-2 px-3">Provident Fund & Deductions</td>
                  <td className="py-2 px-3 text-right font-semibold">-₹{mySalaryRecord.deductions.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-900 text-white font-bold text-sm">
                  <td className="py-3 px-3 uppercase">Net Take-Home Salary</td>
                  <td className="py-3 px-3 text-right text-emerald-400 text-base font-extrabold">₹{mySalaryRecord.netSalary.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            {/* Payment Audit */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-emerald-50/80 p-4 rounded-xl border border-emerald-200">
              <div>
                <span className="text-emerald-800 uppercase text-[10px] font-bold">Payment Method:</span>
                <p className="text-slate-900 font-bold">{mySalaryRecord.paymentMethod}</p>
                <p className="text-slate-600 text-[11px]">{mySalaryRecord.bankName} ({mySalaryRecord.accountNumberMasked})</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-800 uppercase text-[10px] font-bold">Transaction Reference:</span>
                <p className="text-emerald-700 font-mono font-extrabold text-sm">{mySalaryRecord.transactionId}</p>
                <p className="text-slate-600 text-[11px]">Credited: {mySalaryRecord.paymentDate}</p>
              </div>
            </div>

            {/* Footer / Signatory */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700">Computer Generated Pay Slip</p>
                <p>BIT Transport Management Portal • No signature required</p>
              </div>
              <div className="text-right">
                <div className="w-28 border-b border-slate-400 mb-1" />
                <p className="font-bold text-slate-800">Authorized Signatory</p>
                <p>Finance & Transport Dept</p>
              </div>
            </div>

            {/* Action buttons (Hidden during print) */}
            <div className="flex gap-3 pt-2 print:hidden">
              <Button onClick={handlePrintSlip} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold h-10 gap-2">
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </Button>
              <Button variant="ghost" onClick={() => setIsSlipOpen(false)} className="h-10">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
