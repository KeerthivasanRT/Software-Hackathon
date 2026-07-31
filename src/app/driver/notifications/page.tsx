'use client';

import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function DriverNotificationsPage() {
  const { notifications, user } = useDataStore();
  
  const filteredNotifications = notifications.filter(n => n.targetRole === 'driver' || n.targetRole === 'all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Notifications</h1>
        <p className="text-slate-500 mt-1">System announcements and alerts.</p>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-slate-600" />
            Inbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div key={notification.id} className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800 text-lg">{notification.title}</h4>
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </div>
                </div>
                <p className="text-slate-600 mb-3">{notification.message}</p>
                <span className="text-xs text-slate-400">{new Date(notification.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
            {filteredNotifications.length === 0 && <p className="text-slate-500">No notifications.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
