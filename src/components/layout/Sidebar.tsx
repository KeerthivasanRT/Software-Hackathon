'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Bus, Users, Navigation, CalendarCheck, MessageSquare, Bell, Settings, UserCircle, MapPin, Search, ShieldAlert, LogOut, IndianRupee, CreditCard, ClipboardCheck, Fuel, BookOpen, CalendarDays, GraduationCap } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BitLogo } from '@/components/ui/bit-logo';

interface SidebarProps {
  role: 'admin' | 'driver' | 'student';
  className?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, isSidebarCollapsed, setSidebarCollapsed } = useDataStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
    };
    
    handleResize();
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
      { name: 'Driver Salary Management', path: '/admin/salary', icon: IndianRupee },
      { name: 'Transport Fee Management', path: '/admin/fees', icon: CreditCard },
      { name: 'Vehicle Inspections', path: '/admin/inspections', icon: ClipboardCheck },
      { name: 'Fuel Logs', path: '/admin/fuel', icon: Fuel },
      { name: 'Emergency SOS', path: '/admin/emergencies', icon: ShieldAlert },
      { name: 'Complaints', path: '/admin/complaints', icon: MessageSquare },
      { name: 'Notification Management', path: '/admin/notifications', icon: Bell },
    ],
    driver: [
      { name: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
      { name: 'My Route', path: '/driver/route', icon: Navigation },
      { name: 'Attendance', path: '/driver/attendance', icon: CalendarCheck },
      { name: 'Vehicle Inspection', path: '/driver/inspection', icon: ClipboardCheck },
      { name: 'Fuel Log', path: '/driver/fuel', icon: Fuel },
      { name: 'Trip History', path: '/driver/trips', icon: BookOpen },
      { name: 'Calendar & Schedule', path: '/driver/calendar', icon: CalendarDays },
      { name: 'Salary', path: '/driver/salary', icon: IndianRupee },
      { name: 'Emergency SOS', path: '/driver/emergency', icon: ShieldAlert },
      { name: 'Notifications', path: '/driver/notifications', icon: Bell },
    ],
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Route', path: '/student/route', icon: Navigation },
      { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
      { name: 'Transport Fees', path: '/student/fees', icon: CreditCard },
      { name: 'Emergency SOS', path: '/student/emergency', icon: ShieldAlert },
      { name: 'Complaints', path: '/student/complaint', icon: MessageSquare },
      { name: 'Notifications', path: '/student/notifications', icon: Bell },
      { name: 'Profile', path: '/student/profile', icon: Settings },
    ]
  };

  const navItems = routes[role];

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-b from-[#005BAC] to-[#1976D2] text-white relative transition-all duration-300 ease-in-out border-r border-[#005BAC]/30 shadow-xl rounded-2xl overflow-hidden", isSidebarCollapsed ? "w-[80px]" : "w-[270px]", className)}>
      {/* BRAND HEADER WITH BIT LOGO */}
      <div className="h-20 flex items-center justify-center px-4 shrink-0 overflow-hidden border-b border-white/15 bg-black/10">
        {isSidebarCollapsed ? (
          <div className="w-10 h-10 rounded-xl bg-white text-[#005BAC] flex items-center justify-center font-extrabold text-sm shadow-md">
            BIT
          </div>
        ) : (
          <BitLogo variant="light" size="md" />
        )}
      </div>

      {/* SEARCH BAR */}
      <div className={cn("px-4 py-3 shrink-0 transition-all duration-300 border-b border-white/10", isSidebarCollapsed ? "px-2" : "")}>
        <div className="relative group">
          <Search className={cn("absolute left-3 top-2.5 h-4 w-4 text-sky-200 group-focus-within:text-white transition-colors", isSidebarCollapsed ? "left-1/2 -translate-x-1/2" : "")} />
          <input
            type="text"
            placeholder={isSidebarCollapsed ? "" : "Search Portal..."}
            className={cn("w-full bg-white/15 border border-white/20 rounded-xl py-2 text-xs text-white placeholder:text-sky-200/70 focus:outline-none focus:bg-white/25 focus:border-white transition-all font-medium", isSidebarCollapsed ? "px-0 cursor-pointer text-transparent" : "pl-9 pr-3")}
          />
        </div>
      </div>

      {/* NAVIGATION ITEMS WITH WHITE ICONS & ROUNDED ACTIVE MENU */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 group relative",
                  isActive
                    ? "bg-white text-[#005BAC] shadow-lg font-bold scale-[1.02]"
                    : "text-sky-100 hover:text-white hover:bg-white/15"
                )}
              >
                {/* White Icon for inactive, Primary Blue for active */}
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  isActive 
                    ? "text-[#005BAC]" 
                    : "text-white"
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                <span className={cn("truncate transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* BOTTOM PROFILE CARD */}
      <div className="p-4 shrink-0 border-t border-white/15 bg-black/10">
        <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-white/10 border border-white/15 transition-all hover:bg-white/20", isSidebarCollapsed ? "justify-center px-0 bg-transparent border-0" : "")}>
          <Avatar className="h-9 w-9 border-2 border-white/30 shrink-0">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback className="bg-white text-[#005BAC] font-extrabold text-xs">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'BIT'}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0 transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
            <span className="text-xs font-bold text-white truncate">{user?.name || 'BIT User'}</span>
            <span className="text-[10px] text-sky-200 uppercase tracking-wider font-bold">{role} Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
