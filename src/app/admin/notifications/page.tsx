'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle2, Send, Clock, Edit3, Trash2, Calendar, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Notification, Role } from '@/types';

const CATEGORIES = [
  'General Announcement', 'Route Update', 'Bus Delay', 'Bus Breakdown', 
  'Schedule Change', 'Holiday Notice', 'Emergency Alert', 'Attendance Reminder', 
  'Maintenance Notice', 'Examination Transport', 'Lost & Found', 'Other'
];

export default function NotificationManagementPage() {
  const { notifications, addNotification, deleteNotification, buses, routes, students, drivers } = useDataStore();
  
  const [activeTab, setActiveTab] = useState('compose');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'emergency'>('low');
  const [recipientType, setRecipientType] = useState('all');
  const [recipientId, setRecipientId] = useState('');
  const [sendTime, setSendTime] = useState('');
  
  const handleSend = (status: 'sent' | 'draft' | 'scheduled') => {
    if (!title || !message) return;
    
    let targetRole: Role | 'all' | 'specific' = 'all';
    if (recipientType === 'all_students' || recipientType === 'route_students' || recipientType === 'bus_students' || recipientType === 'specific_student') targetRole = 'student';
    else if (recipientType === 'all_drivers' || recipientType === 'route_drivers' || recipientType === 'bus_drivers' || recipientType === 'specific_driver') targetRole = 'driver';
    else if (recipientType !== 'all') targetRole = 'specific';

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      category,
      priority,
      targetRole,
      recipientType: recipientType as any,
      recipientIds: recipientId ? [recipientId] : [],
      status,
      date: new Date().toISOString(),
      sendTime: status === 'scheduled' && sendTime ? new Date(sendTime).toISOString() : undefined,
      readBy: [],
      deletedBy: []
    };
    
    addNotification(newNotification);
    
    // Reset form
    setTitle('');
    setMessage('');
    setRecipientId('');
    setSendTime('');
    setActiveTab(status === 'scheduled' || status === 'draft' ? 'scheduled' : 'history');
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
    if (a.priority !== 'emergency' && b.priority === 'emergency') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const historyList = sortedNotifications.filter(n => n.status === 'sent' || !n.status); // backwards compat
  const scheduledList = sortedNotifications.filter(n => n.status === 'scheduled' || n.status === 'draft');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notification Management</h1>
        <p className="text-slate-600 mt-1 font-medium">Create, schedule, and manage communications across all users.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl p-1 bg-slate-100 rounded-xl mb-6">
          <TabsTrigger value="compose" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            <Edit3 className="w-4 h-4 mr-2" /> Compose
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            <Bell className="w-4 h-4 mr-2" /> History
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm">
            <Clock className="w-4 h-4 mr-2" /> Drafts & Scheduled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-sky-50/50 border-b border-[#D6ECFA] pb-6">
              <CardTitle className="text-xl text-slate-800">Compose Notification</CardTitle>
              <CardDescription>Send an announcement to specific users or groups.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Notification Title *</label>
                  <Input placeholder="e.g. Bus Delay Alert" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category *</label>
                  <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message *</label>
                <Textarea placeholder="Type your message here..." className="min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Priority *</label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🟠 High</SelectItem>
                      <SelectItem value="emergency">🔴 Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Recipient *</label>
                  <Select value={recipientType} onValueChange={(val) => { setRecipientType(val || ''); setRecipientId(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="all_students">All Students</SelectItem>
                      <SelectItem value="all_drivers">All Drivers</SelectItem>
                      <SelectItem value="route_students">Students of a Route</SelectItem>
                      <SelectItem value="route_drivers">Drivers of a Route</SelectItem>
                      <SelectItem value="bus_students">Students of a Bus</SelectItem>
                      <SelectItem value="bus_drivers">Drivers of a Bus</SelectItem>
                      <SelectItem value="specific_student">Specific Student</SelectItem>
                      <SelectItem value="specific_driver">Specific Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {['route_students', 'route_drivers', 'bus_students', 'bus_drivers', 'specific_student', 'specific_driver'].includes(recipientType) && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Select Target *</label>
                    <Select value={recipientId} onValueChange={(val) => setRecipientId(val || '')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target..." />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientType.startsWith('route_') && routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                        {recipientType.startsWith('bus_') && buses.map(b => <SelectItem key={b.id} value={b.id}>{b.busNumber}</SelectItem>)}
                        {recipientType === 'specific_student' && students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.studentId})</SelectItem>)}
                        {recipientType === 'specific_driver' && drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name} ({d.employeeId})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 md:w-1/3">
                <label className="text-sm font-semibold text-slate-700">Schedule (Optional)</label>
                <Input type="datetime-local" value={sendTime} onChange={(e) => setSendTime(e.target.value)} />
                <p className="text-xs text-slate-500">Leave blank to send immediately.</p>
              </div>

            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleSend('draft')}>
                <FileText className="w-4 h-4 mr-2" /> Save Draft
              </Button>
              {sendTime ? (
                <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={() => handleSend('scheduled')} disabled={!title || !message}>
                  <Calendar className="w-4 h-4 mr-2" /> Schedule
                </Button>
              ) : (
                <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={() => handleSend('sent')} disabled={!title || !message}>
                  <Send className="w-4 h-4 mr-2" /> Send Now
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-sky-50/50 border-b border-[#D6ECFA] pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-sky-600" /> Sent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {historyList.map(n => (
                  <div key={n.id} className="p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-bold text-slate-900">{n.title}</h4>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(n.priority || 'low')}`}>
                          {n.priority}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600">
                          {n.category || 'General'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{n.message}</p>
                      <div className="flex items-center text-xs text-slate-500 gap-4">
                        <span className="flex items-center gap-1 font-medium"><Calendar className="w-3.5 h-3.5" /> {new Date(n.date).toLocaleString()}</span>
                        <span className="flex items-center gap-1 font-medium bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">
                          To: {n.recipientType?.replace('_', ' ').toUpperCase() || n.targetRole.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-sky-600" onClick={() => {
                        setTitle(n.title); setMessage(n.message); setCategory(n.category || CATEGORIES[0]); 
                        setPriority(n.priority || 'low'); setRecipientType(n.recipientType || 'all');
                        setActiveTab('compose');
                      }}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600" onClick={() => deleteNotification(n.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {historyList.length === 0 && (
                  <div className="p-12 text-center text-slate-500">No sent notifications found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-sky-50/50 border-b border-[#D6ECFA] pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-sky-600" /> Drafts & Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {scheduledList.map(n => (
                  <div key={n.id} className="p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-bold text-slate-900">{n.title}</h4>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${n.status === 'draft' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                          {n.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-1">{n.message}</p>
                      {n.sendTime && (
                         <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                           <Clock className="w-3.5 h-3.5" /> Scheduled for: {new Date(n.sendTime).toLocaleString()}
                         </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-sky-600" onClick={() => {
                        setTitle(n.title); setMessage(n.message); setCategory(n.category || CATEGORIES[0]); 
                        setPriority(n.priority || 'low'); setRecipientType(n.recipientType || 'all');
                        if (n.sendTime) setSendTime(n.sendTime.slice(0, 16));
                        setActiveTab('compose');
                        deleteNotification(n.id); // Remove from drafts as we are editing
                      }}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600" onClick={() => deleteNotification(n.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {scheduledList.length === 0 && (
                  <div className="p-12 text-center text-slate-500">No scheduled or draft notifications found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
