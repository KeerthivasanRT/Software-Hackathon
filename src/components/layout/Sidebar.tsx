'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Bus, Users, Navigation, CalendarCheck, MessageSquare, Bell, Settings, UserCircle, MapPin, Search, ShieldAlert, LogOut } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  role: 'admin' | 'driver' | 'student';
  className?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, isSidebarCollapsed, setSidebarCollapsed } = useDataStore();

  useEffect(() => {
    const handleResize = () => {
      // Auto collapse on tablet sizes (768px to 1024px)
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024 && isSidebarCollapsed) {
        // Expand on desktop if we want, but since prompt says "State Persistence: Remember the user's sidebar preference. If the user collapses the sidebar, keep it collapsed when navigating between pages until changed again", we shouldn't force expand unless they just resized from mobile. We'll leave desktop alone to respect persistence.
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const routes = {
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Buses', path: '/admin/buses', icon: Bus },
      { name: 'Drivers', path: '/admin/drivers', icon: UserCircle },
      { name: 'Students', path: '/admin/students', icon: Users },
      { name: 'Routes & Map', path: '/admin/routes', icon: Navigation },
      { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
      { name: 'Emergency History', path: '/admin/emergencies', icon: ShieldAlert },
      { name: 'Complaints', path: '/admin/complaints', icon: MessageSquare },
      { name: 'Notification Management', path: '/admin/notifications', icon: Bell },
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
      { name: 'Notifications', path: '/student/notifications', icon: Bell },
      { name: 'Profile', path: '/student/profile', icon: Settings },
    ]
  };

  const navItems = routes[role];

  return (
    <div className={cn("flex flex-col h-full bg-[#F8FCFF] relative transition-all duration-300 ease-in-out border-r border-[#D6ECFA]", isSidebarCollapsed ? "w-[80px]" : "w-[260px]", className)}>
      <div className="h-20 flex items-center justify-center px-4 shrink-0 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-2 rounded-xl shadow-[0_4px_10px_rgba(14,165,233,0.3)] shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className={cn("font-bold tracking-tight text-slate-900 text-xl font-heading transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
            BIT Transport
          </span>
        </div>
      </div>

      <div className={cn("px-5 py-2 shrink-0 transition-all duration-300", isSidebarCollapsed ? "px-3" : "")}>
        <div className="relative group">
          <Search className={cn("absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors", isSidebarCollapsed ? "left-1/2 -translate-x-1/2" : "")} />
          <input
            type="text"
            placeholder={isSidebarCollapsed ? "" : "Search..."}
            className={cn("w-full bg-white border border-[#D6ECFA] rounded-xl py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all placeholder:text-slate-400 font-medium", isSidebarCollapsed ? "px-0 cursor-pointer text-transparent" : "pl-9 pr-3")}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 w-full px-3 py-4">
        <div className="flex flex-col flex-nowrap items-center justify-start w-full gap-4 pb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            
            const navLink = (
              <Link key={item.path} href={item.path} className="block w-full flex-none">
                <div
                  className={cn(
                    "flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200 group cursor-pointer relative overflow-hidden",
                    isSidebarCollapsed ? "px-0 justify-center" : "px-3",
                    isActive 
                      ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold" 
                      : "text-slate-600 hover:bg-sky-100/50 hover:text-sky-700 font-medium"
                  )}
                >
                  <item.icon className={cn(
                    "transition-all duration-200 shrink-0", 
                    isSidebarCollapsed ? "w-5 h-5" : "w-[18px] h-[18px]",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-sky-600 group-hover:scale-110"
                  )} />
                  {!isSidebarCollapsed && <span className="tracking-wide truncate">{item.name}</span>}
                </div>
              </Link>
            );

            if (isSidebarCollapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    {navLink}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold text-xs ml-2 bg-white text-slate-900 border-sky-100 shadow-lg">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return navLink;
          })}
        </div>
      </ScrollArea>

      <div className={cn("p-5 mt-auto border-t border-[#D6ECFA] shrink-0", isSidebarCollapsed ? "px-3" : "")}>
        <div className={cn("flex items-center hover:bg-white rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-sky-100 hover:shadow-sm", isSidebarCollapsed ? "p-1.5 justify-center" : "p-2.5 -mx-2.5 gap-3")}>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-sky-100 shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-sky-100 text-sky-600 text-sm font-bold">
              {user?.name?.charAt(0) || role.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isSidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-900 truncate tracking-tight">{user?.name || `${role} User`}</span>
              <span className="text-xs text-slate-500 font-medium capitalize truncate">{role} Account</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
