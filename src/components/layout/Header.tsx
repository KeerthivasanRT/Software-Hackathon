'use client';

import { useDataStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  role: 'admin' | 'driver' | 'student';
}

export function Header({ role }: HeaderProps) {
  const { user, logout } = useDataStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center lg:hidden">
        <Sheet>
          <SheetTrigger className="mr-2 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 w-10 text-slate-700">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar role={role} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1" />

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-slate-500 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 ring-2 ring-blue-50/50">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-700">{user?.name?.charAt(0) || role.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-slate-700 leading-none">{user?.name || `${role} User`}</p>
            <p className="text-slate-500 text-xs mt-1 capitalize">{role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
