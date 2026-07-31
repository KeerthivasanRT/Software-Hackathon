'use client';

import { useDataStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, Slash } from 'lucide-react';
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
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <div className="lg:hidden mr-4">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 h-9 w-9 transition-colors">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-white">
              <Sidebar role={role} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex items-center text-sm font-medium text-slate-600 capitalize">
          <span className="hover:text-slate-900 transition-colors cursor-pointer">{role}</span>
          <Slash className="w-3.5 h-3.5 mx-2 text-slate-300 transform -rotate-12" />
          <span className="text-slate-900">{currentPage}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 h-9 w-9 rounded-full relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </Button>
        <div className="h-4 w-px bg-slate-200" />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-9 px-3 rounded-md transition-colors text-sm font-medium flex items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </header>
  );
}
