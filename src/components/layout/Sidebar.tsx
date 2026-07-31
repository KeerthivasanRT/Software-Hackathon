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
    <div className={cn("flex flex-col h-full bg-white relative", className)}>
      <div className="h-20 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-xl font-heading">BIT Transport</span>
        </div>
      </div>

      <div className="px-5 py-2 shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group cursor-pointer relative overflow-hidden",
                    isActive 
                      ? "bg-blue-50/80 text-blue-900 font-semibold shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "w-[18px] h-[18px] transition-all duration-200", 
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110"
                  )} />
                  <span className="tracking-wide">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-5 mt-auto border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 hover:bg-slate-50 p-2.5 -mx-2.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200/50 hover:shadow-sm">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 text-sm font-bold">
              {user?.name?.charAt(0) || role.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 truncate tracking-tight">{user?.name || `${role} User`}</span>
            <span className="text-xs text-slate-500 font-medium capitalize truncate">{role} Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
