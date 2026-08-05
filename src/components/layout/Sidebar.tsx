'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  Navigation, 
  CalendarCheck, 
  MessageSquare, 
  Bell, 
  Settings, 
  UserCircle, 
  MapPin, 
  Search, 
  ShieldAlert, 
  LogOut, 
  IndianRupee, 
  CreditCard, 
  ClipboardCheck, 
  Fuel, 
  BookOpen, 
  CalendarDays, 
  GraduationCap,
  X,
  Phone,
  Mail,
  Award,
  Calendar,
  ShieldCheck,
  Loader2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BitLogo } from '@/components/ui/bit-logo';
import { getApiUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  role: 'admin' | 'driver' | 'student';
  className?: string;
}

interface DriverProfileData {
  id?: string;
  name?: string;
  employeeId?: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: number;
  licenseNumber?: string;
  licenseExpiry?: string;
  assignedBus?: string;
  assignedRoute?: string;
  status?: string;
  profilePhoto?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSidebarCollapsed, setSidebarCollapsed } = useDataStore();

  const [driverProfile, setDriverProfile] = useState<DriverProfileData | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [localUserName, setLocalUserName] = useState<string>('');

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

  // Sync with user session & dynamically fetch Driver Profile from GET /api/drivers/me
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const authUserStr = localStorage.getItem('user');
        if (authUserStr) {
          const authUser = JSON.parse(authUserStr);
          if (authUser?.name) setLocalUserName(authUser.name);
        }
      } catch (e) {
        // Safe parsing fallback
      }
    }

    if (role === 'driver') {
      const fetchDriverMe = async () => {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (token) {
            const res = await fetch(getApiUrl('/api/drivers/me'), {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.success && data.data) {
              setDriverProfile(data.data);
              if (data.data.name) setLocalUserName(data.data.name);
              return;
            }
          }
        } catch (err) {
          console.warn('Could not reach /api/drivers/me in background:', err);
        }
      };
      fetchDriverMe();
    }
  }, [role, user]);

  const handleProfileCardClick = async () => {
    if (role === 'driver') {
      setIsProfileDrawerOpen(true);
      setLoadingProfile(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          const res = await fetch(getApiUrl('/api/drivers/me'), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success && data.data) {
            setDriverProfile(data.data);
            if (data.data.name) setLocalUserName(data.data.name);
          }
        }
      } catch (err) {
        console.error('Error fetching real-time data from GET /api/drivers/me:', err);
      } finally {
        setLoadingProfile(false);
      }
    }
  };

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
      { name: 'My Profile', path: '/driver/profile', icon: UserCircle },
    ],
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Bus & Route', path: '/student/bus-route', icon: Bus },
      { name: 'Live Tracking', path: '/student/tracking', icon: MapPin },
      { name: 'Bus Search', path: '/student/search', icon: Search },
      { name: 'My Attendance', path: '/student/attendance', icon: CalendarCheck },
      { name: 'Academic & Bus Calendar', path: '/student/calendar', icon: CalendarDays },
      { name: 'Fee Payments', path: '/student/fees', icon: CreditCard },
      { name: 'Emergency SOS', path: '/student/emergency', icon: ShieldAlert },
      { name: 'Complaint Desk', path: '/student/complaints', icon: MessageSquare },
      { name: 'Campus Notifications', path: '/student/notifications', icon: Bell },
    ],
  };

  const navItems = routes[role];
  const activeDisplayName = role === 'driver' 
    ? (driverProfile?.name || localUserName || user?.name || '')
    : (localUserName || user?.name || 'BIT User');

  return (
    <div className={cn("h-screen bg-[#005BAC] text-white flex flex-col shrink-0 transition-all duration-300 relative shadow-xl z-20", isSidebarCollapsed ? "w-20" : "w-64", className)}>
      
      {/* BRAND HEADER WITH LOGO */}
      <div className={cn("flex items-center px-4 h-20 border-b border-white/15 bg-[#004A8F]/60 backdrop-blur-md", isSidebarCollapsed ? "justify-center" : "gap-3")}>
        <div className="bg-white p-2 rounded-xl shrink-0 shadow-sm flex items-center justify-center border border-white/20">
          <BitLogo className="w-8 h-8 text-[#005BAC]" />
        </div>
        <div className={cn("flex flex-col min-w-0 transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
          <span className="font-extrabold text-white text-base tracking-tight leading-none truncate font-serif">BIT TRANSPORT</span>
          <span className="text-[10px] text-sky-200 font-semibold uppercase tracking-wider mt-1 font-sans">SMART PORTAL</span>
        </div>
      </div>

      {/* QUICK ROLE INDICATOR */}
      <div className={cn("px-4 py-2 border-b border-white/10 bg-black/10", isSidebarCollapsed ? "hidden" : "block")}>
        <div className="flex items-center justify-between text-xs text-sky-100 font-medium">
          <span className="uppercase text-[10px] font-bold tracking-wider text-sky-200">Current View</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] uppercase shadow-sm">
            {role === 'driver' ? 'Driver Account' : role}
          </span>
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
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-[#005BAC]" : "text-white"
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
        <div 
          onClick={role === 'driver' ? handleProfileCardClick : undefined}
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/15 transition-all hover:bg-white/20", 
            role === 'driver' ? "cursor-pointer group hover:shadow-lg active:scale-95" : "",
            isSidebarCollapsed ? "justify-center px-0 bg-transparent border-0" : ""
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-white/30 shrink-0 shadow-md">
            <AvatarImage src={(role === 'driver' ? driverProfile?.profilePhoto : user?.avatar) || undefined} />
            <AvatarFallback className="bg-white text-[#005BAC] font-extrabold text-xs">
              {activeDisplayName ? activeDisplayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DR'}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0 transition-opacity duration-300 flex-1", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
            <span className="text-xs font-extrabold text-white truncate font-sans tracking-tight">
              {activeDisplayName || (role === 'driver' ? 'Driver Account' : 'BIT User')}
            </span>
            <span className="text-[11px] text-sky-200 font-bold font-sans">
              {role === 'driver' ? 'Driver Account' : `${role.toUpperCase()} ACCOUNT`}
            </span>
          </div>
          {role === 'driver' && !isSidebarCollapsed && (
            <ChevronRight className="w-4 h-4 text-sky-200 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          )}
        </div>
      </div>

      {/* BEAUTIFUL RIGHT-SIDE DRIVER PROFILE DRAWER / POPUP */}
      {isProfileDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md h-full text-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            
            {/* DRAWER HEADER */}
            <div className="bg-gradient-to-br from-[#005BAC] via-[#1976D2] to-[#003B70] text-white p-6 relative shadow-md">
              <button 
                onClick={() => setIsProfileDrawerOpen(false)}
                className="absolute top-4 right-4 text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 mt-2">
                <Avatar className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg bg-white/20 text-white text-xl font-extrabold flex items-center justify-center shrink-0">
                  {driverProfile?.profilePhoto ? (
                    <img src={driverProfile.profilePhoto} alt={driverProfile.name || 'Driver'} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <AvatarFallback className="bg-[#003B70] text-white">
                      {(driverProfile?.name || localUserName || 'D').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-extrabold truncate tracking-tight">
                    {driverProfile?.name || localUserName || 'Authenticated Driver'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {driverProfile?.employeeId && (
                      <span className="bg-white/20 border border-white/30 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md uppercase">
                        {driverProfile.employeeId}
                      </span>
                    )}
                    <span className="bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {driverProfile?.status || 'active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DRAWER BODY (FETCHED DETAILS FROM GET /api/drivers/me) */}
            <ScrollArea className="flex-1 p-6">
              {loadingProfile ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                  <Loader2 className="w-10 h-10 animate-spin text-[#005BAC]" />
                  <p className="text-xs font-bold uppercase tracking-wider animate-pulse">Fetching live credentials from MongoDB...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* CONTACT & RESIDENTIAL INFO */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-1.5">
                      <UserCircle className="w-4 h-4" />
                      Contact & Location
                    </h4>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                          <p className="font-semibold text-slate-800 truncate">{driverProfile?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="h-px bg-slate-200/80" />
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                          <p className="font-semibold text-slate-800">{driverProfile?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="h-px bg-slate-200/80" />
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Residential Address</p>
                          <p className="font-semibold text-slate-800 leading-snug">{driverProfile?.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LICENSE & CREDENTIALS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      License & Credentials
                    </h4>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">License Number</p>
                          <p className="font-mono font-extrabold text-slate-800 text-base">{driverProfile?.licenseNumber || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                          <p className="font-extrabold text-slate-800 text-base">{driverProfile?.experience ?? 0} Years</p>
                        </div>
                      </div>
                      <div className="h-px bg-slate-200/80" />
                      <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold">Valid Through: {driverProfile?.licenseExpiry || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* ASSIGNED TRANSPORT */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-1.5">
                      <Bus className="w-4 h-4" />
                      Assigned Transport
                    </h4>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#005BAC] flex items-center justify-center font-bold shrink-0">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Bus</p>
                          <p className="font-bold text-slate-900 truncate">{driverProfile?.assignedBus || 'Not Assigned'}</p>
                        </div>
                      </div>
                      <div className="h-px bg-slate-200/80" />
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Route</p>
                          <p className="font-bold text-slate-900 truncate">{driverProfile?.assignedRoute || 'Not Assigned'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </ScrollArea>

            {/* DRAWER FOOTER */}
            <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
              <Button 
                variant="outline"
                onClick={() => setIsProfileDrawerOpen(false)}
                className="rounded-xl h-11 px-5 font-bold border-slate-300 text-slate-700 hover:bg-slate-200 transition-all flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setIsProfileDrawerOpen(false);
                  router.push('/driver/profile');
                }}
                className="bg-[#005BAC] hover:bg-[#004A8F] text-white rounded-xl h-11 px-6 font-bold shadow-md transition-all flex items-center justify-center gap-2 flex-1"
              >
                <span>Full Profile</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
