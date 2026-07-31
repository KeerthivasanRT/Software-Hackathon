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
  const { logout } = useDataStore();
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
    <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0 transition-all">
      <div className="flex items-center">
        <div className="lg:hidden mr-4">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100/80 h-10 w-10 transition-colors">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-white/50 backdrop-blur-xl border-r-0">
              <Sidebar role={role} className="rounded-none bg-white/80" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex items-center text-sm font-semibold text-slate-500 capitalize tracking-wide">
          <span className="hover:text-slate-900 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-slate-100 -ml-2">{role}</span>
          <ChevronRight className="w-4 h-4 mx-1 text-slate-300" />
          <span className="text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-md">{currentPage}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-slate-500 hover:bg-slate-100 h-10 w-10 rounded-xl relative transition-all duration-200 flex items-center justify-center hover:text-slate-900 group border border-transparent hover:border-slate-200/60 hover:shadow-sm">
          <Bell className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
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
