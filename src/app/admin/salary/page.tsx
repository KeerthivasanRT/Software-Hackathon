'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { SalaryRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, Users, CheckCircle2, Clock, CreditCard, Building2, Receipt, ArrowUpRight, ShieldCheck, Download, Search, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminSalaryPage() {
  const { drivers, buses, routes, salaryRecords, paySalary } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  
  // Pay Modal State
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states inside modal
  const [payMethod, setPayMethod] = useState<'Net Banking' | 'UPI' | 'Bank Transfer'>('Net Banking');
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [bankName, setBankName] = useState<string>('');
  const [accNumber, setAccNumber] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('');

  const openPayModal = (record: SalaryRecord) => {
    setSelectedRecord(record);
    setBasicSalary(record.basicSalary);
    setAllowances(record.allowances);
    setBonus(record.bonus || 0);
    setDeductions(record.deductions);
    setPayMethod(record.paymentMethod || 'Net Banking');
    setBankName(record.bankName || 'State Bank of India');
    setAccNumber(record.accountNumberMasked || '•••• •••• 4829');
    setIfsc(record.ifscCode || 'SBIN0001234');
    setSuccessMsg(null);
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = () => {
    if (!selectedRecord) return;

    setIsProcessing(true);
    setTimeout(() => {
      paySalary(selectedRecord.id, {
        paymentMethod: payMethod,
        basicSalary,
        allowances,
        bonus,
        deductions,
        bankName,
        accountNumberMasked: accNumber,
        ifscCode: ifsc,
      });

      const netCalculated = basicSalary + allowances + bonus - deductions;
      setSuccessMsg(`Salary of ₹${netCalculated.toLocaleString('en-IN')} has been successfully credited to ${selectedRecord.driverName} via ${payMethod}.`);
      setIsProcessing(false);
    }, 1000);
  };

  // Metrics
  const totalDrivers = drivers.length;
  const pendingCount = salaryRecords.filter(s => s.paymentStatus === 'pending').length;
  const paidCount = salaryRecords.filter(s => s.paymentStatus === 'paid').length;
  const totalSalaryPaid = salaryRecords
    .filter(s => s.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.netSalary, 0);

  // Filtered records
  const filteredRecords = salaryRecords.filter(rec => {
    const matchesSearch = rec.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rec.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paidHistory = salaryRecords.filter(rec => rec.paymentStatus === 'paid');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">💰</span>
            Driver Salary Management
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Manage driver payrolls, disburse net banking salaries, and generate salary slips.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-sky-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Drivers</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalDrivers}</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Profiles Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-amber-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payments</p>
              <h3 className="text-2xl font-bold text-amber-600">{pendingCount}</h3>
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Awaiting Disbursal
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-emerald-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid This Month</p>
              <h3 className="text-2xl font-bold text-emerald-600">{paidCount}</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct Credit
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Receipt className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D6ECFA] bg-gradient-to-br from-white to-indigo-50/40 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Salary Paid</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{totalSalaryPaid.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Net Banking
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-sky-50 border border-[#D6ECFA] p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            Salary Dashboard
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            Payment History ({paidHistory.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            Payment Reports
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DASHBOARD TABLE */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Driver Payroll Table</CardTitle>
                <CardDescription className="text-sm">Manage, adjust allowances/bonus, and disburse driver salaries.</CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <Input 
                    placeholder="Search by driver or ID..." 
                    className="pl-9 h-10 border-[#D6ECFA] bg-white text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
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
                      <th className="py-3.5 px-4">Driver Name</th>
                      <th className="py-3.5 px-4">Emp ID</th>
                      <th className="py-3.5 px-4">Assigned Bus & Route</th>
                      <th className="py-3.5 px-4">Basic</th>
                      <th className="py-3.5 px-4">Allowances</th>
                      <th className="py-3.5 px-4">Deductions</th>
                      <th className="py-3.5 px-4">Net Salary</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Payment Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredRecords.map((record) => {
                      const driverObj = drivers.find(d => d.id === record.driverId);
                      const busObj = buses.find(b => b.id === driverObj?.assignedBusId);
                      const routeObj = routes.find(r => r.id === driverObj?.assignedRouteId);

                      return (
                        <tr key={record.id} className="hover:bg-sky-50/30 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">{record.driverName}</td>
                          <td className="py-4 px-4 text-slate-600 font-mono text-xs">{record.employeeId}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800">{busObj ? busObj.busNumber : 'Unassigned'}</span>
                              <span className="text-xs text-slate-500">{routeObj ? routeObj.name : 'No route'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-700">₹{record.basicSalary.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4 text-emerald-600">+₹{(record.allowances + record.bonus).toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4 text-red-500">-₹{record.deductions.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4 font-extrabold text-slate-900">₹{record.netSalary.toLocaleString('en-IN')}</td>
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
                          <td className="py-4 px-4 text-xs text-slate-500">{record.paymentDate || 'Not processed'}</td>
                          <td className="py-4 px-4 text-right">
                            {record.paymentStatus === 'pending' ? (
                              <Button 
                                onClick={() => openPayModal(record)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-9 px-3 rounded-lg text-xs"
                              >
                                <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Pay Salary
                              </Button>
                            ) : (
                              <Button 
                                variant="outline"
                                onClick={() => openPayModal(record)}
                                className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 px-3 rounded-lg text-xs"
                              >
                                View Details
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-500 font-medium">
                          No salary records found.
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
              <CardTitle className="text-lg font-bold text-slate-800">Complete Transaction History</CardTitle>
              <CardDescription className="text-sm">Audit trail of all processed driver salary payments.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Payment ID</th>
                      <th className="py-3.5 px-4">Transaction Ref</th>
                      <th className="py-3.5 px-4">Driver</th>
                      <th className="py-3.5 px-4">Month</th>
                      <th className="py-3.5 px-4">Amount Paid</th>
                      <th className="py-3.5 px-4">Payment Method</th>
                      <th className="py-3.5 px-4">Bank Name</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paidHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-sky-50/30">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-sky-600">{rec.id.toUpperCase()}</td>
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-600">{rec.transactionId}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{rec.driverName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{rec.month}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{rec.netSalary.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-4 text-slate-700">{rec.paymentMethod}</td>
                        <td className="py-3.5 px-4 text-slate-600">{rec.bankName}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{rec.paymentDate}</td>
                        <td className="py-3.5 px-4">
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            Completed
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {paidHistory.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-500">No payment history available yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: REPORTS */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
              <CardHeader className="bg-sky-50/30 border-b border-[#D6ECFA] pb-4">
                <CardTitle className="text-base font-bold text-slate-800">Monthly Payout Breakdown</CardTitle>
                <CardDescription className="text-xs">Summary of basic salary vs allowances & bonuses</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-semibold text-slate-600">Total Basic Salary:</span>
                  <span className="text-base font-bold text-slate-900">₹{salaryRecords.reduce((acc, s) => acc + s.basicSalary, 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                  <span className="text-sm font-semibold text-emerald-800">Total Allowances & Bonus:</span>
                  <span className="text-base font-bold text-emerald-700">₹{salaryRecords.reduce((acc, s) => acc + s.allowances + s.bonus, 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-sm font-semibold text-red-800">Total Deductions:</span>
                  <span className="text-base font-bold text-red-700">₹{salaryRecords.reduce((acc, s) => acc + s.deductions, 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-sky-600 text-white rounded-xl shadow-sm">
                  <span className="text-sm font-bold">Estimated Total Net Disbursal:</span>
                  <span className="text-xl font-extrabold">₹{salaryRecords.reduce((acc, s) => acc + s.netSalary, 0).toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
              <CardHeader className="bg-sky-50/30 border-b border-[#D6ECFA] pb-4">
                <CardTitle className="text-base font-bold text-slate-800">Disbursal Method Distribution</CardTitle>
                <CardDescription className="text-xs">Simulated Hackathon Net Banking Gateways</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 flex items-center gap-2"><Building2 className="w-4 h-4 text-sky-600" /> Net Banking (Default)</span>
                    <span className="text-slate-900">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-full w-[75%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-600" /> Direct Bank Transfer</span>
                    <span className="text-slate-900">25%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[25%]" />
                  </div>
                </div>

                <div className="p-4 border border-emerald-200 bg-emerald-50/60 rounded-xl text-xs text-emerald-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Demo Net Banking Enabled</p>
                  <p>All salary payments trigger simulated direct bank transfers with real-time driver notifications.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* PAY SALARY MODAL */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="sm:max-w-xl border-[#D6ECFA] shadow-2xl p-0 overflow-hidden rounded-2xl">
          <div className="bg-emerald-600 h-2.5" />
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                {selectedRecord?.paymentStatus === 'paid' ? 'Salary Record Details' : 'Process Net Banking Salary Payment'}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Review salary calculation breakdown and simulate direct Net Banking credit.
              </DialogDescription>
            </DialogHeader>

            {successMsg ? (
              <div className="space-y-5 py-4 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
                  <p className="text-sm font-medium text-slate-700 max-w-md mx-auto">{successMsg}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 font-mono text-left max-w-md mx-auto">
                  <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="text-emerald-600 font-bold">CREDITED</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold text-slate-900">{selectedRecord?.transactionId || 'TXN240801003'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Notification:</span><span className="text-sky-600 font-bold">Sent to Driver</span></div>
                </div>
                <Button onClick={() => setIsPayModalOpen(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl">
                  Done
                </Button>
              </div>
            ) : selectedRecord && (
              <div className="space-y-5">
                {/* Driver Summary Bar */}
                <div className="bg-sky-50/70 border border-[#D6ECFA] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{selectedRecord.driverName}</h4>
                    <p className="text-xs text-slate-500 font-mono">Employee ID: {selectedRecord.employeeId}</p>
                  </div>
                  <Badge variant="outline" className="bg-white border-sky-200 text-sky-700 font-semibold px-3 py-1">
                    {selectedRecord.month}
                  </Badge>
                </div>

                {/* Banking Info Fields */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Bank Name</Label>
                    <Input 
                      value={bankName} 
                      onChange={e => setBankName(e.target.value)} 
                      disabled={selectedRecord.paymentStatus === 'paid'}
                      className="h-9 text-xs border-[#D6ECFA]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Account Number</Label>
                    <Input 
                      value={accNumber} 
                      onChange={e => setAccNumber(e.target.value)} 
                      disabled={selectedRecord.paymentStatus === 'paid'}
                      className="h-9 text-xs border-[#D6ECFA] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">IFSC Code</Label>
                    <Input 
                      value={ifsc} 
                      onChange={e => setIfsc(e.target.value)} 
                      disabled={selectedRecord.paymentStatus === 'paid'}
                      className="h-9 text-xs border-[#D6ECFA] font-mono"
                    />
                  </div>
                </div>

                {/* Salary Calculation Fields */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600">Basic Salary (₹)</Label>
                      <Input 
                        type="number" 
                        value={basicSalary} 
                        onChange={e => setBasicSalary(Number(e.target.value))} 
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600">Allowance (₹)</Label>
                      <Input 
                        type="number" 
                        value={allowances} 
                        onChange={e => setAllowances(Number(e.target.value))} 
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600">Bonus (₹)</Label>
                      <Input 
                        type="number" 
                        value={bonus} 
                        onChange={e => setBonus(Number(e.target.value))} 
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600">Deductions (₹)</Label>
                      <Input 
                        type="number" 
                        value={deductions} 
                        onChange={e => setDeductions(Number(e.target.value))} 
                        disabled={selectedRecord.paymentStatus === 'paid'}
                        className="h-9 border-slate-300 text-sm font-semibold text-red-600"
                      />
                    </div>
                  </div>

                  {/* Net Salary Live Calculation */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase">Calculated Net Salary:</span>
                    <span className="text-xl font-extrabold text-emerald-600">
                      ₹{(basicSalary + allowances + bonus - deductions).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Method Dropdown */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Payment Method</Label>
                  <Select value={payMethod} onValueChange={(val: any) => setPayMethod(val)} disabled={selectedRecord.paymentStatus === 'paid'}>
                    <SelectTrigger className="h-10 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net Banking">Net Banking (Instant Credit)</SelectItem>
                      <SelectItem value="UPI">UPI Payment</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer (NEFT/RTGS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setIsPayModalOpen(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  {selectedRecord.paymentStatus === 'pending' && (
                    <Button 
                      onClick={handleProcessPayment} 
                      disabled={isProcessing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-lg h-10 shadow-sm"
                    >
                      {isProcessing ? 'Processing Credit...' : `Confirm & Credit ₹${(basicSalary + allowances + bonus - deductions).toLocaleString('en-IN')}`}
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
