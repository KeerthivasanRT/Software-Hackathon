'use client';

import { useState, useEffect } from 'react';
import { useDataStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { BitLogo } from '@/components/ui/bit-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  role: 'admin' | 'driver' | 'student';
}

export function Header({ role }: HeaderProps) {
  const { user, logout, toggleSidebar } = useDataStore();
  const router = useRouter();
  const pathname = usePathname();

  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveTime(`${dateStr} • ${timeStr}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <header className="h-20 bg-white border-b border-[#D6EAF8] flex-none flex items-center justify-between px-6 z-20 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile Sheet Trigger */}
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-[#EAF4FF] h-10 w-10 transition-colors">
              <Menu className="w-5 h-5 text-[#005BAC]" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-[#005BAC] to-[#1976D2]">
              <Sidebar role={role} className="rounded-none bg-transparent" />
            </SheetContent>
          </Sheet>
        </div>

        {/* Sidebar Toggle & BIT Header Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="hidden md:inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-[#EAF4FF] hover:text-[#005BAC] h-10 w-10 transition-colors shrink-0 border border-[#D6EAF8]"
          >
            <Menu className="w-5 h-5 text-[#005BAC]" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
            <BitLogo variant="dark" size="sm" className="hidden sm:flex" />
            <div className="h-5 w-px bg-[#D6EAF8] hidden sm:block" />
            <div>
              <h2 className="text-sm font-extrabold text-[#005BAC] tracking-tight font-heading leading-tight">
                BIT Smart Transport Management Portal
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 capitalize">
                <span>{role} Portal</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#1976D2]" />
                <span className="text-[#005BAC] font-bold">{currentPage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center space-x-4">
        {/* Current Date & Time */}
        <div className="hidden lg:flex items-center gap-2 bg-[#EAF4FF] border border-[#D6EAF8] px-3.5 py-1.5 rounded-xl font-medium text-xs text-[#005BAC]" suppressHydrationWarning>
          <Clock className="w-3.5 h-3.5 text-[#1976D2]" />
          <span>{liveTime || 'Bannari Amman Institute of Technology'}</span>
        </div>

        {/* Notification Icon */}
        <button className="text-slate-600 hover:bg-[#EAF4FF] h-10 w-10 rounded-xl relative transition-all duration-200 flex items-center justify-center hover:text-[#005BAC] group border border-[#D6EAF8]">
          <Bell className="w-4 h-4 text-[#005BAC] group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EAF4FF] border border-[#D6EAF8]">
          <Avatar className="h-7 w-7 border border-[#005BAC]/30">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback className="bg-[#005BAC] text-white font-extrabold text-[10px]">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'BIT'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-bold text-[#005BAC] max-w-[100px] truncate">{user?.name || 'BIT User'}</span>
        </div>

        <div className="h-5 w-px bg-[#D6EAF8]" />

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 h-10 px-3.5 rounded-xl transition-all duration-200 text-xs font-bold flex items-center group"
        >
          <LogOut className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform text-red-500" />
          Log out
        </Button>
      </div>
    </header>
  );
}
