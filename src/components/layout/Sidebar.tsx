'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Bus, Users, Navigation, CalendarCheck, MessageSquare, Bell, BarChart3, Settings, UserCircle, MapPin, Search } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  role: 'admin' | 'driver' | 'student';
  className?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useDataStore();

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
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="h-16 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-lg">Transport</span>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 border border-slate-200/60 rounded-md pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group cursor-pointer",
                    isActive 
                      ? "bg-slate-100 text-slate-900 font-medium" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors", 
                    isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-200/60">
        <div className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-md transition-colors cursor-pointer">
          <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-semibold">
              {user?.name?.charAt(0) || role.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-slate-900 truncate">{user?.name || `${role} User`}</span>
            <span className="text-xs text-slate-500 capitalize truncate">{role} Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
