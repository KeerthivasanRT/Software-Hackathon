'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { FeeRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Users, CheckCircle2, Clock, IndianRupee, Search, Receipt, ShieldCheck, Sparkles, AlertCircle, BarChart3, Bus as BusIcon, Navigation, Filter } from 'lucide-react';

export default function AdminFeesPage() {
  const { students, routes, buses, feeRecords, payStudentFee } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal form inputs
  const [transportFee, setTransportFee] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [scholarshipDiscount, setScholarshipDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Net Banking' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Cash'>('Net Banking');

  const openCollectModal = (record: FeeRecord) => {
    setSelectedRecord(record);
    setTransportFee(record.transportFee);
    setLateFee(record.lateFee);
    setScholarshipDiscount(record.scholarshipDiscount);
    setPaymentMethod(record.paymentMethod || 'Net Banking');
    setSuccessMsg(null);
    setIsCollectModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedRecord) return;
    setIsProcessing(true);
    setTimeout(() => {
      payStudentFee(selectedRecord.id, {
        paymentMethod,
        lateFee,
        scholarshipDiscount,
      });

      const totalCalculated = transportFee + lateFee - scholarshipDiscount;
      setSuccessMsg(`Payment of ₹${totalCalculated.toLocaleString('en-IN')} for ${selectedRecord.studentName} confirmed successfully via ${paymentMethod}.`);
      setIsProcessing(false);
    }, 1000);
  };

  // Metrics
  const totalStudentsCount = students.length;
  const totalCollected = feeRecords
    .filter(f => f.paymentStatus === 'paid')
    .reduce((acc, f) => acc + f.paidAmount, 0);
  const pendingAmount = feeRecords
    .filter(f => f.paymentStatus === 'pending' || f.paymentStatus === 'partial')
    .reduce((acc, f) => acc + f.pendingAmount, 0);
  const collectedThisMonth = totalCollected;

  // Filtered Fee Records
  const filteredRecords = feeRecords.filter(rec => {
    const matchesSearch = rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.registerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoute = routeFilter === 'all' || rec.routeId === routeFilter;
    const matchesStatus = statusFilter === 'all' || rec.paymentStatus === statusFilter;
    return matchesSearch && matchesRoute && matchesStatus;
  });

  const paidHistory = feeRecords.filter(f => f.paymentStatus === 'paid');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">💳</span>
            Transport Fee Management
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Manage student transport fees, record payments, and track route collection metrics.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bus Students</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalStudentsCount}</h3>
              <p className="text-xs text-sky-600 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Enrolled Pass Holders
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fees Collected</p>
              <h3 className="text-2xl font-bold text-emerald-600">₹{totalCollected.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct Bank Verified
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-amber-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Fee Dues</p>
              <h3 className="text-2xl font-bold text-amber-600">₹{pendingAmount.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> OutstandingDues
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-indigo-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected This Month</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{collectedThisMonth.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" /> 100% Receipted
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="records" className="space-y-6">
        <TabsList className="bg-sky-50 border border-[#D6ECFA] p-1 rounded-xl">
          <TabsTrigger value="records" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            Student Fee Records
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            Payment History ({paidHistory.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            Collection Analytics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: STUDENT FEE RECORDS */}
        <TabsContent value="records" className="space-y-4">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Transport Fee Roster</CardTitle>
                <CardDescription className="text-sm">Filter, search, collect payments, and view student receipts.</CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-60">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <Input 
                    placeholder="Search student or Reg No..." 
                    className="pl-9 h-10 border-[#D6ECFA] bg-white text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={routeFilter} onValueChange={(val) => setRouteFilter(val || 'all')}>
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

                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
                  <SelectTrigger className="w-36 h-10 border-[#D6ECFA] bg-white text-sm">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Register No</th>
                      <th className="py-3.5 px-4">Route & Bus</th>
                      <th className="py-3.5 px-4">Semester</th>
                      <th className="py-3.5 px-4">Fee Amount</th>
                      <th className="py-3.5 px-4">Due Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Last Payment</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900">{record.studentName}</td>
                        <td className="py-4 px-4 text-slate-600 font-mono text-xs">{record.registerNumber}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{record.routeName}</span>
                            <span className="text-xs text-slate-500">{record.busNumber}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-700 text-xs">{record.semester}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">₹{record.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4 text-xs text-slate-500">{record.dueDate}</td>
                        <td className="py-4 px-4">
                          {record.paymentStatus === 'paid' ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 px-2.5 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 py-1">
                              <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500">{record.lastPaymentDate || 'None'}</td>
                        <td className="py-4 px-4 text-right">
                          {record.paymentStatus === 'pending' ? (
                            <Button 
                              onClick={() => openCollectModal(record)}
                              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm h-9 px-3 rounded-lg text-xs"
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Collect Payment
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              onClick={() => openCollectModal(record)}
                              className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 px-3 rounded-lg text-xs"
                            >
                              View Details
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                          No student fee records found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PAYMENT HISTORY */}
        <TabsContent value="history" className="space-y-4">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5">
              <CardTitle className="text-lg font-bold text-slate-800">Transport Fee Payment Audit Log</CardTitle>
              <CardDescription className="text-sm">Complete history of all online and counter fee collections.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Payment ID</th>
                      <th className="py-3.5 px-4">Transaction Ref</th>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Register No</th>
                      <th className="py-3.5 px-4">Semester</th>
                      <th className="py-3.5 px-4">Amount Paid</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4">Payment Date</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paidHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-sky-50/30">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-sky-600">{rec.id.toUpperCase()}</td>
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-600">{rec.transactionId}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{rec.studentName}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{rec.registerNumber}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">{rec.semester}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{rec.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-4 text-slate-700">{rec.paymentMethod}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{rec.lastPaymentDate}</td>
                        <td className="py-3.5 px-4">
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            Completed
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
              <CardHeader className="bg-sky-50/30 border-b border-[#D6ECFA] pb-4">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-sky-600" /> Fee Collection by Route
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {routes.map(r => {
                  const routeFees = feeRecords.filter(f => f.routeId === r.id);
                  const routeTotal = routeFees.reduce((acc, f) => acc + f.totalAmount, 0);
                  const routePaid = routeFees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + f.paidAmount, 0);
                  const percentage = routeTotal > 0 ? Math.round((routePaid / routeTotal) * 100) : 0;

                  return (
                    <div key={r.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{r.name}</span>
                        <span className="text-slate-600">₹{routePaid.toLocaleString('en-IN')} / ₹{routeTotal.toLocaleString('en-IN')} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
              <CardHeader className="bg-sky-50/30 border-b border-[#D6ECFA] pb-4">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BusIcon className="w-4 h-4 text-emerald-600" /> Fee Collection by Bus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {buses.map(b => {
                  const busFees = feeRecords.filter(f => f.busId === b.id);
                  const busTotal = busFees.reduce((acc, f) => acc + f.totalAmount, 0);
                  const busPaid = busFees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + f.paidAmount, 0);
                  const percentage = busTotal > 0 ? Math.round((busPaid / busTotal) * 100) : 0;

                  return (
                    <div key={b.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{b.busNumber} ({b.busName || 'Bus'})</span>
                        <span className="text-slate-600">₹{busPaid.toLocaleString('en-IN')} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* COLLECT PAYMENT MODAL */}
      <Dialog open={isCollectModalOpen} onOpenChange={setIsCollectModalOpen}>
        <DialogContent className="sm:max-w-lg border-[#D6ECFA] shadow-2xl p-0 overflow-hidden rounded-2xl">
          <div className="bg-sky-600 h-2.5" />
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                {selectedRecord?.paymentStatus === 'paid' ? 'Transport Fee Record Details' : 'Collect Transport Fee'}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Simulate online/counter payment and generate student transport fee receipt.
              </DialogDescription>
            </DialogHeader>

            {successMsg ? (
              <div className="space-y-5 py-4 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Payment Confirmed!</h3>
                  <p className="text-sm font-medium text-slate-700 max-w-md mx-auto">{successMsg}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 font-mono text-left max-w-md mx-auto">
                  <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="text-emerald-600 font-bold">PAID</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold text-slate-900">{selectedRecord?.transactionId || 'TRN240801001'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Notification:</span><span className="text-sky-600 font-bold">Sent to Student</span></div>
                </div>
                <Button onClick={() => setIsCollectModalOpen(false)} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 rounded-xl">
                  Done
                </Button>
              </div>
            ) : selectedRecord && (
              <div className="space-y-5">
                {/* Student Overview Bar */}
                <div className="bg-sky-50/70 border border-[#D6ECFA] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{selectedRecord.studentName}</h4>
                    <p className="text-xs text-slate-500 font-mono">Reg No: {selectedRecord.registerNumber} • {selectedRecord.routeName}</p>
                  </div>
                  <Badge variant="outline" className="bg-white border-sky-200 text-sky-700 font-semibold px-3 py-1 text-xs">
                    {selectedRecord.semester}
                  </Badge>
                </div>

                {/* Calculation Fields */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600 uppercase">Transport Fee (₹)</Label>
                      <Input 
                        type="number"
                        value={transportFee}
                        onChange={(e) => setTransportFee(Number(e.target.value))}
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600 uppercase">Late Fee (₹)</Label>
                      <Input 
                        type="number"
                        value={lateFee}
                        onChange={(e) => setLateFee(Number(e.target.value))}
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-xs font-bold text-amber-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600 uppercase">Scholarship (₹)</Label>
                      <Input 
                        type="number"
                        value={scholarshipDiscount}
                        onChange={(e) => setScholarshipDiscount(Number(e.target.value))}
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-xs font-bold text-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase">Calculated Total Fee:</span>
                    <span className="text-xl font-extrabold text-sky-700">
                      ₹{(transportFee + lateFee - scholarshipDiscount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)} disabled={selectedRecord.paymentStatus === 'paid'}>
                    <SelectTrigger className="h-10 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net Banking">Net Banking</SelectItem>
                      <SelectItem value="UPI">UPI / GPay / PhonePe</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Cash">Cash at Counter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setIsCollectModalOpen(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  {selectedRecord.paymentStatus === 'pending' && (
                    <Button 
                      onClick={handleConfirmPayment} 
                      disabled={isProcessing}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 rounded-lg h-10 shadow-sm"
                    >
                      {isProcessing ? 'Processing Payment...' : `Confirm Payment of ₹${(transportFee + lateFee - scholarshipDiscount).toLocaleString('en-IN')}`}
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
