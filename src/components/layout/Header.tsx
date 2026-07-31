'use client';

import { useDataStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  role: 'admin' | 'driver' | 'student';
}

export function Header({ role }: HeaderProps) {
  const { logout, toggleSidebar } = useDataStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Generate simple breadcrumbs from path
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-[#D6ECFA] flex-none flex items-center justify-between px-6 z-20 transition-all shadow-sm shadow-sky-500/5">
      <div className="flex items-center gap-4">
        <div className="md:hidden mr-4">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-xl text-slate-500 hover:bg-sky-50 hover:text-sky-600 h-10 w-10 transition-colors">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-white/95 backdrop-blur-xl border-r border-[#D6ECFA]">
              <Sidebar role={role} className="rounded-none bg-transparent" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={toggleSidebar} 
            className="inline-flex items-center justify-center rounded-xl text-slate-500 hover:bg-sky-50 hover:text-sky-600 h-10 w-10 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center text-sm font-semibold text-slate-500 capitalize tracking-wide">
            <span className="hover:text-slate-900 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-sky-50">{role}</span>
            <ChevronRight className="w-4 h-4 mx-1 text-slate-400 shrink-0" />
            <span className="text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-md">{currentPage}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-slate-500 hover:bg-sky-50 h-10 w-10 rounded-xl relative transition-all duration-200 flex items-center justify-center hover:text-sky-600 group border border-transparent hover:border-sky-200 hover:shadow-sm">
          <Bell className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-10 px-3.5 rounded-xl transition-all duration-200 text-sm font-semibold flex items-center group"
        >
          <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Log out
        </Button>
      </div>
    </header>
  );
}
