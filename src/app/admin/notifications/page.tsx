'use client';

import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, user } = useDataStore();
  
  const filteredNotifications = user?.role === 'admin' 
    ? notifications 
    : notifications.filter(n => n.targetRole === user?.role || n.targetRole === 'all');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 mt-1 font-medium">System announcements and alerts.</p>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden max-w-4xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 px-6 pt-6">
          <CardTitle className="flex items-center text-slate-800 text-lg">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Inbox
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map(notification => (
              <div key={notification.id} className="p-6 bg-white hover:bg-slate-50/50 transition-colors flex gap-4">
                <div className="mt-1">
                  {notification.isRead ? (
                    <CheckCircle2 className="w-5 h-5 text-slate-300" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h4 className={`text-base tracking-tight ${notification.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md border border-slate-200/60">
                        Target: {notification.targetRole}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(notification.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <p className={`${notification.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'} text-sm leading-relaxed mb-1`}>
                    {notification.message}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(notification.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-300" />
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
