'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Bus, Users, Navigation, CalendarCheck, MessageSquare, Bell, BarChart3, Settings, UserCircle, MapPin } from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'driver' | 'student';
  className?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();

  const routes = {
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Buses', path: '/admin/buses', icon: Bus },
      { name: 'Drivers', path: '/admin/drivers', icon: UserCircle },
      { name: 'Students', path: '/admin/students', icon: Users },
      { name: 'Routes & Map', path: '/admin/routes', icon: Navigation },
      { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
      { name: 'Complaints', path: '/admin/complaints', icon: MessageSquare },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
      { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    ],
    driver: [
      { name: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
      { name: 'My Route', path: '/driver/route', icon: Navigation },
      { name: 'Attendance', path: '/driver/attendance', icon: CalendarCheck },
      { name: 'Notifications', path: '/driver/notifications', icon: Bell },
    ],
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Route', path: '/student/route', icon: Navigation },
      { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
      { name: 'Complaints', path: '/student/complaint', icon: MessageSquare },
      { name: 'Profile', path: '/student/profile', icon: Settings },
    ]
  };

  const navItems = routes[role];

  return (
    <div className={cn("flex flex-col h-full bg-white border-r", className)}>
      <div className="h-16 flex items-center px-6 border-b">
        <MapPin className="w-6 h-6 text-blue-600 mr-2" />
        <span className="font-bold text-lg text-slate-800">Smart Transport</span>
      </div>
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-11 transition-colors",
                  pathname === item.path 
                    ? "bg-blue-50 text-blue-700 font-semibold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-3", pathname === item.path ? "text-blue-600" : "text-slate-400")} />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
