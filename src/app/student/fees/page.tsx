'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { FeeRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CheckCircle2, Clock, IndianRupee, Printer, Download, ShieldCheck, Bus as BusIcon, Navigation, FileText, Sparkles, Check } from 'lucide-react';

export default function StudentFeesPage() {
  const { user, students, buses, routes, feeRecords, payStudentFee } = useDataStore();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payMethod, setPayMethod] = useState<'Net Banking' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Cash'>('Net Banking');

  // Identify current student. Default to 'st1' (Arun Kumar) if not logged in.
  const currentStudentId = user?.role === 'student' ? user.id : 'st1';
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const myFeeRecord = feeRecords.find(f => f.studentId === currentStudent?.id) || {
    id: 'fee-demo',
    studentId: currentStudent?.id || 'st1',
    studentName: currentStudent?.name || 'Arun Kumar',
    registerNumber: currentStudent?.registerNumber || '7376221CS101',
    routeId: currentStudent?.assignedRouteId || 'r1',
    routeName: 'Route A',
    busId: currentStudent?.assignedBusId || 'b1',
    busNumber: 'BUS-001',
    semester: 'Semester 5 (Odd 2026)',
    transportFee: 18000,
    lateFee: 500,
    scholarshipDiscount: 0,
    totalAmount: 18500,
    paidAmount: 18500,
    pendingAmount: 0,
    dueDate: '15 August 2026',
    paymentStatus: 'paid' as const,
    lastPaymentDate: '01 August 2026',
    paymentMethod: 'Net Banking' as const,
    transactionId: 'TRN240801001',
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payStudentFee(myFeeRecord.id, {
        paymentMethod: payMethod,
      });
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">💳</span>
            My Transport Fees
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Check fee status, simulate online semester fee payment, and download receipts.</p>
        </div>

        {myFeeRecord.paymentStatus === 'paid' ? (
          <Button 
            onClick={() => setIsReceiptOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-5 rounded-xl shadow-sm gap-2"
          >
            <FileText className="w-4 h-4" /> Download Fee Receipt
          </Button>
        ) : (
          <Button 
            onClick={() => { setPaymentSuccess(false); setIsPayModalOpen(true); }}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 px-6 rounded-xl shadow-md gap-2"
          >
            <CreditCard className="w-4 h-4" /> Pay Fee Now
          </Button>
        )}
      </div>

      {/* Main Fee Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-[#D6ECFA] bg-gradient-to-br from-white via-sky-50/20 to-white shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Profile</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{myFeeRecord.studentName}</h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">Register No: {myFeeRecord.registerNumber}</p>
              </div>

              <div>
                {myFeeRecord.paymentStatus === 'paid' ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-3.5 py-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Transport Fee Paid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-sm px-3.5 py-1.5 font-bold">
                    <Clock className="w-4 h-4 mr-1.5" /> Payment Pending
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D6ECFA]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Route</span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-sky-600" /> {myFeeRecord.routeName}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Bus</span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <BusIcon className="w-4 h-4 text-sky-600" /> {myFeeRecord.busNumber}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Semester</span>
                <p className="text-sm font-semibold text-slate-900">{myFeeRecord.semester}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due Card */}
        <Card className={`border shadow-md rounded-2xl flex flex-col justify-between p-6 text-white ${myFeeRecord.paymentStatus === 'paid' ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-200' : 'bg-gradient-to-br from-sky-600 to-indigo-700 border-sky-200'}`}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> {myFeeRecord.paymentStatus === 'paid' ? 'Total Fee Paid' : 'Pending Fee Due'}
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight">
              ₹{(myFeeRecord.paymentStatus === 'paid' ? myFeeRecord.totalAmount : myFeeRecord.pendingAmount).toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-white/80 font-medium">Due Date: {myFeeRecord.dueDate}</p>
          </div>

          <div className="pt-4 border-t border-white/20 space-y-1 text-xs font-mono text-white/90">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-white uppercase">{myFeeRecord.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>TRN ID:</span>
              <span className="font-bold text-white">{myFeeRecord.transactionId || 'Awaiting Payment'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fee Breakdown & Transaction History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/40 p-5">
            <CardTitle className="text-lg font-bold text-slate-800">Fee Component Breakdown</CardTitle>
            <CardDescription className="text-xs">Detailed calculation for {myFeeRecord.semester}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Fee Head</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">Base Transport Fee</td>
                  <td className="py-3.5 px-5 text-xs text-slate-500">Semester Pass Fee</td>
                  <td className="py-3.5 px-5 text-right font-bold text-slate-900">₹{myFeeRecord.transportFee.toLocaleString('en-IN')}</td>
                </tr>
                {myFeeRecord.lateFee > 0 && (
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-slate-800">Late Fee Fine</td>
                    <td className="py-3.5 px-5 text-xs text-amber-600 font-medium">Overdue Fine</td>
                    <td className="py-3.5 px-5 text-right font-bold text-amber-600">+₹{myFeeRecord.lateFee.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {myFeeRecord.scholarshipDiscount > 0 && (
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-slate-800">Scholarship Waiver</td>
                    <td className="py-3.5 px-5 text-xs text-emerald-600 font-medium">Concession</td>
                    <td className="py-3.5 px-5 text-right font-bold text-emerald-600">-₹{myFeeRecord.scholarshipDiscount.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                <tr className="bg-sky-50/60 font-bold">
                  <td className="py-4 px-5 text-slate-900 text-base" colSpan={2}>Total Amount Payable</td>
                  <td className="py-4 px-5 text-right text-sky-700 text-lg font-extrabold">₹{myFeeRecord.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Transaction Card */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" /> Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-medium">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Payment Method</span>
              <p className="text-sm font-bold text-slate-800">{myFeeRecord.paymentMethod || 'Not Paid'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Last Payment Date</span>
              <p className="text-sm font-bold text-slate-800">{myFeeRecord.lastPaymentDate || 'Awaiting Payment'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Transaction Reference</span>
              <p className="text-sm font-mono font-bold text-emerald-600">{myFeeRecord.transactionId || 'None'}</p>
            </div>
            
            {myFeeRecord.paymentStatus === 'paid' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" /> Verified Instant Online Receipt Generated
              </div>
            ) : (
              <Button 
                onClick={() => { setPaymentSuccess(false); setIsPayModalOpen(true); }}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-10 rounded-xl gap-2 mt-2"
              >
                <CreditCard className="w-4 h-4" /> Pay ₹{myFeeRecord.totalAmount.toLocaleString('en-IN')} Now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PAY NOW MODAL */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="sm:max-w-md border-[#D6ECFA] shadow-2xl p-0 overflow-hidden rounded-2xl">
          <div className="bg-sky-600 h-2.5" />
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                Pay Transport Fee
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Simulate online fee payment for {myFeeRecord.semester}.
              </DialogDescription>
            </DialogHeader>

            {paymentSuccess ? (
              <div className="space-y-5 py-4 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">✅ Payment Successful!</h3>
                  <p className="text-sm font-medium text-slate-700">
                    Your transport fee of <span className="font-bold text-slate-900">₹{myFeeRecord.totalAmount.toLocaleString('en-IN')}</span> has been received.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono text-left">
                  <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold text-emerald-600">{myFeeRecord.transactionId || 'TRN240801001'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment Method:</span><span className="font-bold text-slate-800">{payMethod}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="text-emerald-600 font-bold">COMPLETED</span></div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => { setIsPayModalOpen(false); setIsReceiptOpen(true); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl">
                    View Fee Receipt
                  </Button>
                  <Button variant="ghost" onClick={() => setIsPayModalOpen(false)} className="rounded-xl">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Student summary */}
                <div className="bg-sky-50/70 border border-[#D6ECFA] p-4 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-base">{myFeeRecord.studentName}</span>
                    <span className="text-xs font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">{myFeeRecord.registerNumber}</span>
                  </div>
                  <p className="text-xs text-slate-500">{myFeeRecord.routeName} • {myFeeRecord.busNumber}</p>
                </div>

                {/* Amount Box */}
                <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Payable Amount:</span>
                  <span className="text-2xl font-extrabold text-emerald-400">₹{myFeeRecord.totalAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Select Payment Method</Label>
                  <Select value={payMethod} onValueChange={(val: any) => setPayMethod(val)}>
                    <SelectTrigger className="h-11 border-[#D6ECFA]">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net Banking">Net Banking (SBI / HDFC / ICICI)</SelectItem>
                      <SelectItem value="UPI">UPI (GPay / PhonePe / Paytm)</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setIsPayModalOpen(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleProcessPayment} 
                    disabled={isProcessing}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 rounded-lg h-11 shadow-md flex-1"
                  >
                    {isProcessing ? 'Processing Online Payment...' : `Simulate Pay ₹${myFeeRecord.totalAmount.toLocaleString('en-IN')}`}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* PRINTABLE FEE RECEIPT MODAL */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-2xl border-[#D6ECFA] shadow-2xl p-0 overflow-hidden rounded-2xl print:shadow-none print:border-none">
          <div className="bg-emerald-600 h-2 print:hidden" />
          <div className="p-8 space-y-6 bg-white" id="fee-receipt">
            {/* Header / Logo */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">BANNARI AMMAN INSTITUTE OF TECHNOLOGY</h2>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-0.5">Transport Fee Official Receipt</p>
                <p className="text-xs text-slate-500 font-medium">Sathyamangalam, Erode District, Tamil Nadu - 638401</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md border border-emerald-300">
                  OFFICIAL RECEIPT
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Date: {myFeeRecord.lastPaymentDate || '01 August 2026'}</p>
              </div>
            </div>

            {/* Student info grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Student Name:</span>
                <p className="text-slate-900 font-bold text-sm">{myFeeRecord.studentName}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Register Number:</span>
                <p className="text-slate-900 font-bold text-sm font-mono">{myFeeRecord.registerNumber}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Assigned Bus:</span>
                <p className="text-slate-900 font-bold">{myFeeRecord.busNumber}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Assigned Route:</span>
                <p className="text-slate-900 font-bold">{myFeeRecord.routeName}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Semester / Period:</span>
                <p className="text-slate-900 font-bold">{myFeeRecord.semester}</p>
              </div>
            </div>

            {/* Fee Breakdown Table */}
            <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 border-b border-slate-300">Description</th>
                  <th className="py-2.5 px-3 border-b border-slate-300 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3">Base Transport Fee</td>
                  <td className="py-2 px-3 text-right font-semibold">₹{myFeeRecord.transportFee.toLocaleString('en-IN')}</td>
                </tr>
                {myFeeRecord.lateFee > 0 && (
                  <tr>
                    <td className="py-2 px-3">Late Fee Charges</td>
                    <td className="py-2 px-3 text-right font-semibold">₹{myFeeRecord.lateFee.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {myFeeRecord.scholarshipDiscount > 0 && (
                  <tr className="text-emerald-700">
                    <td className="py-2 px-3">Scholarship Waiver / Concession</td>
                    <td className="py-2 px-3 text-right font-semibold">-₹{myFeeRecord.scholarshipDiscount.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                <tr className="bg-slate-900 text-white font-bold text-sm">
                  <td className="py-3 px-3 uppercase">Total Amount Paid</td>
                  <td className="py-3 px-3 text-right text-emerald-400 text-base font-extrabold">₹{myFeeRecord.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            {/* Payment Audit */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-sky-50/80 p-4 rounded-xl border border-sky-200">
              <div>
                <span className="text-sky-800 uppercase text-[10px] font-bold">Payment Gateway / Method:</span>
                <p className="text-slate-900 font-bold">{myFeeRecord.paymentMethod || 'Net Banking'}</p>
              </div>
              <div className="text-right">
                <span className="text-sky-800 uppercase text-[10px] font-bold">Transaction Reference ID:</span>
                <p className="text-emerald-700 font-mono font-extrabold text-sm">{myFeeRecord.transactionId || 'TRN240801001'}</p>
              </div>
            </div>

            {/* Footer Signatory */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700">Computer Generated Official Receipt</p>
                <p>BIT Transport Management Portal • No signature required</p>
              </div>
              <div className="text-right">
                <div className="w-28 border-b border-slate-400 mb-1" />
                <p className="font-bold text-slate-800">Transport Accounts</p>
                <p>BIT Sathy Campus</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 print:hidden">
              <Button onClick={handlePrintReceipt} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold h-10 gap-2">
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </Button>
              <Button variant="ghost" onClick={() => setIsReceiptOpen(false)} className="h-10">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
