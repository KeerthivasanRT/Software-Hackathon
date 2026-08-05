'use client';

import React from 'react';
import { useDataStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, ChevronRight } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <header className="w-full h-20 min-h-[80px] bg-white border-b border-[#D6EAF8] flex items-center justify-between px-3 sm:px-5 lg:px-6 z-20 shadow-xs overflow-hidden">
      {/* LEFT SECTION: BIT Logo & University Name */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 max-w-[55%] sm:max-w-[40%] md:max-w-[35%] lg:max-w-[32%]">
        {/* Mobile Sheet Trigger */}
        <div className="md:hidden shrink-0">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-[#EAF4FF] h-9 w-9 sm:h-10 sm:w-10 transition-colors border border-[#D6EAF8]">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#005BAC]" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-[#005BAC] to-[#1976D2]">
              <Sidebar role={role} className="rounded-none bg-transparent" />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar Toggle */}
        <button 
          onClick={toggleSidebar} 
          className="hidden md:inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-[#EAF4FF] hover:text-[#005BAC] h-10 w-10 transition-colors shrink-0 border border-[#D6EAF8]"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-[#005BAC]" />
        </button>

        {/* BIT Logo & Bannari Amman Institute of Technology */}
        <div className="min-w-0 truncate">
          <BitLogo variant="dark" size="sm" className="flex min-w-0 truncate" />
        </div>
      </div>

      {/* CENTER SECTION: Portal Title */}
      <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2 lg:px-4">
        <div className="min-w-0 max-w-[360px] xl:max-w-[480px] truncate">
          <span className="text-xs lg:text-sm xl:text-base font-extrabold text-[#005BAC] tracking-tight font-heading truncate bg-[#EAF4FF]/70 px-3.5 py-1.5 rounded-xl border border-[#D6EAF8] shadow-2xs block w-full text-center">
            BIT Smart Transport Portal
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: Role Badge, Current View Badge, Notifications, Profile, Logout */}
      <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0 min-w-0 max-w-[45%] sm:max-w-[58%] md:max-w-[62%] lg:max-w-[42%]">
        {/* User Role Badge & Current View Badge */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 bg-[#EAF4FF] border border-[#D6EAF8] px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold shrink-0 min-w-0 max-w-[170px] md:max-w-[200px] overflow-hidden">
          <span className="capitalize text-slate-700 shrink-0 font-extrabold">{role}</span>
          <ChevronRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#1976D2] shrink-0" />
          <span className="text-[#005BAC] font-bold truncate min-w-0">{currentPage}</span>
        </div>

        {/* Notification Icon */}
        <button className="text-slate-600 hover:bg-[#EAF4FF] h-9 w-9 sm:h-10 sm:w-10 rounded-xl relative transition-all duration-200 flex items-center justify-center shrink-0 hover:text-[#005BAC] group border border-[#D6EAF8]" title="Notifications">
          <Bell className="w-4 h-4 text-[#005BAC] group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:bg-[#EAF4FF] sm:border sm:border-[#D6EAF8] shrink-0 min-w-0 overflow-hidden">
          <Avatar className="h-7 w-7 sm:h-7 sm:w-7 border border-[#005BAC]/30 shrink-0">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback className="bg-[#005BAC] text-white font-extrabold text-[10px]">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'BIT'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block text-xs font-bold text-[#005BAC] max-w-[75px] xl:max-w-[110px] truncate">{user?.name || 'BIT User'}</span>
        </div>

        <div className="hidden sm:block h-5 w-px bg-[#D6EAF8] shrink-0" />

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 h-9 px-2 sm:h-10 sm:px-3 rounded-xl transition-all duration-200 text-xs font-bold flex items-center shrink-0 group"
          title="Log out"
        >
          <LogOut className="w-4 h-4 sm:mr-1.5 group-hover:-translate-x-0.5 transition-transform text-red-500 shrink-0" />
          <span className="hidden xl:inline font-extrabold">Log out</span>
        </Button>
      </div>
    </header>
  );
}
