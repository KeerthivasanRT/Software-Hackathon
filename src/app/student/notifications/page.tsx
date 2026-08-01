'use client';

import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle2, Trash2, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentNotificationsPage() {
  const { notifications, user, markNotificationRead, markAllNotificationsRead, deleteNotificationForUser, students } = useDataStore();
  
  const studentProfile = students.find(s => s.id === user?.id);
  
  const filteredNotifications = notifications.filter(n => {
    if (n.status && n.status !== 'sent') return false;
    if (n.deletedBy?.includes(user?.id || '')) return false;
    
    // Filtering logic
    if (n.recipientType === 'all') return true;
    if (n.recipientType === 'all_students') return true;
    if (n.recipientType === 'specific_student' && n.recipientIds?.includes(user?.id || '')) return true;
    if (n.recipientType === 'route_students' && n.recipientIds?.includes(studentProfile?.assignedRouteId || '')) return true;
    if (n.recipientType === 'bus_students' && n.recipientIds?.includes(studentProfile?.assignedBusId || '')) return true;
    
    // Backwards compat
    if (!n.recipientType && (n.targetRole === 'student' || n.targetRole === 'all')) return true;
    
    return false;
  }).sort((a, b) => {
    if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
    if (a.priority !== 'emergency' && b.priority === 'emergency') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleMarkAllRead = () => {
    if (user?.id) markAllNotificationsRead(user.id, 'student');
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-slate-600 mt-1 font-medium">Your system announcements and alerts.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} className="text-sky-700 bg-sky-50 hover:bg-sky-100 border-sky-200">
          <CheckSquare className="w-4 h-4 mr-2" /> Mark all as read
        </Button>
      </div>

      <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden max-w-4xl">
        <CardHeader className="border-b border-[#D6ECFA] bg-sky-50/50 pb-4 px-6 pt-6">
          <CardTitle className="flex items-center text-slate-800 text-lg">
            <Bell className="w-5 h-5 mr-2 text-sky-600" />
            Inbox
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map(notification => {
              const isRead = notification.readBy?.includes(user?.id || '') || notification.isRead;
              
              return (
                <div key={notification.id} className="p-6 bg-white hover:bg-sky-50/50 transition-colors flex gap-4 group">
                  <div className="mt-1">
                    {isRead ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-300" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-base tracking-tight ${isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                          {notification.title}
                        </h4>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority || 'low')}`}>
                          {notification.priority || 'Normal'}
                        </span>
                        {notification.category && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600 hidden md:inline-block">
                            {notification.category}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-600 shrink-0">
                        {new Date(notification.date).toLocaleString()}
                      </span>
                    </div>
                    <p className={`${isRead ? 'text-slate-600' : 'text-slate-700 font-medium'} text-sm leading-relaxed mb-3`}>
                      {notification.message}
                    </p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isRead && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => user?.id && markNotificationRead(notification.id, user.id)}>
                          Mark as read
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-red-600" onClick={() => user?.id && deleteNotificationForUser(notification.id, user.id)}>
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-700" />
                </div>
                <p className="font-medium text-slate-600">All caught up!</p>
                <p className="text-sm">You have no new notifications.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
