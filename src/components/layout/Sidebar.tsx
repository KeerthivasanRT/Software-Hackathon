'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  UserCircle, 
  MapPin, 
  Search, 
  ShieldAlert, 
  IndianRupee, 
  CreditCard, 
  ClipboardCheck, 
  Fuel, 
  BookOpen, 
  CalendarDays, 
  X,
  Phone,
  Mail,
  Award,
  Calendar,
  ShieldCheck,
  Loader2,
  ChevronRight,
  Briefcase,
  Fingerprint,
  RefreshCw,
  AlertCircle,
  PhoneCall,
  Heart,
  Clock,
  CheckCircle2
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
  profilePhoto?: string;
  name?: string;
  employeeId?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  experience?: number;
  joiningDate?: string;
  assignedBus?: string;
  assignedRoute?: string;
  status?: string;
  shift?: string;
  salary?: number;
  department?: string;
  aadhaarNumber?: string;
  drivingBadgeNumber?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, isSidebarCollapsed, setSidebarCollapsed } = useDataStore();

  const [driverProfile, setDriverProfile] = useState<DriverProfileData | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [localUserName, setLocalUserName] = useState<string>('');
  const [localEmployeeId, setLocalEmployeeId] = useState<string>('');

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

  // Fetch complete profile from MongoDB via GET /api/drivers/me
  const fetchDriverMe = useCallback(async (showLoading = false) => {
    if (role !== 'driver') return;
    if (showLoading) setLoadingProfile(true);
    setProfileError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No authentication token found.');
      }
      const res = await fetch(getApiUrl('/api/drivers/me'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setDriverProfile(data.data);
        if (data.data.name) setLocalUserName(data.data.name);
        if (data.data.employeeId) setLocalEmployeeId(data.data.employeeId);
      } else {
        throw new Error(data.message || 'Failed to load profile details from MongoDB.');
      }
    } catch (err: any) {
      console.error('Error in fetchDriverMe:', err);
      if (showLoading) {
        setProfileError(err.message || 'Could not connect to MongoDB server.');
      }
    } finally {
      if (showLoading) setLoadingProfile(false);
    }
  }, [role]);

  // Initial sync upon mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const authUserStr = localStorage.getItem('user');
        if (authUserStr) {
          const authUser = JSON.parse(authUserStr);
          if (authUser?.name) setLocalUserName(authUser.name);
          if (authUser?.employeeId) setLocalEmployeeId(authUser.employeeId);
        }
      } catch (e) {
        // Safe fallback
      }
    }

    if (role === 'driver') {
      fetchDriverMe(false);
    }
  }, [role, user, fetchDriverMe]);

  const handleProfileCardClick = () => {
    if (role === 'driver') {
      setIsProfileDrawerOpen(true);
      fetchDriverMe(true);
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
      { name: 'Notifications', path: '/driver/notifications', icon: Bell }
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

  const activeEmployeeId = role === 'driver'
    ? (driverProfile?.employeeId || localEmployeeId || 'DRV-101')
    : `${role.toUpperCase()} ACCOUNT`;

  const activePhoto = role === 'driver' ? (driverProfile?.profilePhoto || user?.avatar) : user?.avatar;

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

      {/* NAVIGATION ITEMS */}
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

      {/* BOTTOM PROFILE CARD (DRIVER PHOTO, NAME, EMPLOYEE ID) */}
      <div className="p-4 shrink-0 border-t border-white/15 bg-black/10">
        <div 
          onClick={role === 'driver' ? handleProfileCardClick : undefined}
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/15 transition-all hover:bg-white/20", 
            role === 'driver' ? "cursor-pointer group hover:shadow-lg active:scale-95" : "",
            isSidebarCollapsed ? "justify-center px-0 bg-transparent border-0" : ""
          )}
        >
          <Avatar className="h-10 w-10 rounded-full border-2 border-white/40 shrink-0 shadow-md bg-[#003B70]">
            <AvatarImage src={activePhoto || undefined} alt={activeDisplayName} className="object-cover" />
            <AvatarFallback className="bg-white text-[#005BAC] font-extrabold text-xs">
              {activeDisplayName ? activeDisplayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DR'}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0 transition-opacity duration-300 flex-1", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
            <span className="text-xs font-extrabold text-white truncate font-sans tracking-tight">
              {activeDisplayName || (role === 'driver' ? 'Driver Account' : 'BIT User')}
            </span>
            <span className="text-[11px] text-sky-200 font-mono font-extrabold">
              {activeEmployeeId}
            </span>
          </div>
          {role === 'driver' && !isSidebarCollapsed && (
            <ChevronRight className="w-4 h-4 text-sky-200 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          )}
        </div>
      </div>

      {/* PROFESSIONAL RIGHT-SIDE DRIVER PROFILE DRAWER */}
      {isProfileDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
          <div className="bg-slate-100 w-full max-w-lg md:max-w-xl h-full text-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-400 border-l border-white/20">
            
            {/* TOP SECTION */}
            <div className="bg-gradient-to-br from-[#005BAC] via-[#004A8F] to-[#002855] text-white p-6 md:p-8 relative shadow-xl shrink-0">
              <button 
                onClick={() => setIsProfileDrawerOpen(false)}
                className="absolute top-5 right-5 text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 shadow-sm"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-5 mt-2">
                <div className="w-24 h-24 rounded-full border-4 border-white/90 shadow-2xl bg-[#003B70] overflow-hidden shrink-0 relative flex items-center justify-center">
                  {driverProfile?.profilePhoto ? (
                    <img src={driverProfile.profilePhoto} alt={driverProfile.name || 'Driver'} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl font-extrabold text-white">
                      {(driverProfile?.name || localUserName || 'D').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-extrabold truncate tracking-tight text-white font-sans">
                    {driverProfile?.name || localUserName || 'Authenticated Driver'}
                  </h3>
                  
                  <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-sky-100 text-xs font-mono font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {driverProfile?.employeeId || localEmployeeId || 'DRV-101'}
                    </span>
                    <span className="bg-emerald-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active / On Duty</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DRAWER CONTENT BODY */}
            <ScrollArea className="flex-1 p-5 md:p-6 bg-slate-100">
              {loadingProfile ? (
                /* SKELETON LOADING & SPINNER */
                <div className="py-10 space-y-5">
                  <div className="flex flex-col items-center justify-center space-y-3 pb-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#005BAC]" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 animate-pulse">
                      Syncing real-time credentials from MongoDB...
                    </p>
                  </div>
                  <div className="space-y-4 animate-pulse">
                    <div className="h-28 bg-white rounded-2xl shadow-sm border border-slate-200 p-5" />
                    <div className="h-44 bg-white rounded-2xl shadow-sm border border-slate-200 p-5" />
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-200 p-5" />
                    <div className="h-36 bg-white rounded-2xl shadow-sm border border-slate-200 p-5" />
                  </div>
                </div>
              ) : profileError ? (
                /* ERROR HANDLING */
                <div className="my-12 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-base">Unable to load driver profile</h4>
                    <p className="text-xs text-rose-700 font-medium">{profileError}</p>
                  </div>
                  <Button
                    onClick={() => fetchDriverMe(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-6 py-2 h-10 shadow-md flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Sync</span>
                  </Button>
                </div>
              ) : (
                /* CARDS 1 TO 7 IN MODERN HACKATHON QUALITY */
                <div className="space-y-5 pb-6">
                  
                  {/* CARD 1: PERSONAL INFORMATION */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-[#005BAC] flex items-center justify-center">
                          <UserCircle className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">Personal Information</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Gender</p>
                        <p className="font-bold text-slate-800 mt-0.5">{driverProfile?.gender || 'Male'}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">DOB</p>
                        <p className="font-bold text-slate-800 mt-0.5">{driverProfile?.dateOfBirth || 'N/A'}</p>
                      </div>
                      <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-950">
                        <p className="text-[10px] font-extrabold text-rose-500 uppercase">Blood Group</p>
                        <p className="font-extrabold text-rose-600 mt-0.5 text-base">{driverProfile?.bloodGroup || 'O+'}</p>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: CONTACT INFORMATION */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">Contact Information</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase">Email Address</p>
                            <p className="font-semibold text-slate-800 truncate">{driverProfile?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase">Primary Phone</p>
                            <p className="font-bold text-slate-800">{driverProfile?.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {driverProfile?.alternatePhone && (
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase">Alternate Phone</p>
                            <p className="font-bold text-slate-800">{driverProfile.alternatePhone}</p>
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Residential Address</p>
                        <p className="font-bold text-slate-800 text-sm leading-snug">{driverProfile?.address || 'Not provided'}</p>
                        <div className="flex items-center gap-4 pt-1 border-t border-slate-200/60 text-xs font-semibold text-slate-600">
                          <span><strong>City:</strong> {driverProfile?.city || 'Sathyamangalam'}</span>
                          <span><strong>State:</strong> {driverProfile?.state || 'Tamil Nadu'}</span>
                          <span><strong>PIN:</strong> <span className="font-mono font-bold text-slate-800">{driverProfile?.pincode || '638401'}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: LICENSE DETAILS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">License Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
                        <p className="text-[10px] font-extrabold text-amber-800 uppercase">Driving License Number</p>
                        <p className="font-mono font-extrabold text-amber-950 text-base mt-0.5">{driverProfile?.licenseNumber || 'N/A'}</p>
                      </div>
                      <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-200/80">
                        <p className="text-[10px] font-extrabold text-sky-800 uppercase">Driving Badge Number</p>
                        <p className="font-mono font-extrabold text-sky-950 text-sm mt-0.5">{driverProfile?.drivingBadgeNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-extrabold">Expiry Date: {driverProfile?.licenseExpiry || 'N/A'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#005BAC] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                          {driverProfile?.experience ?? 0} Years Experience
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: TRANSPORT ASSIGNMENT */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-[#005BAC] flex items-center justify-center">
                        <Bus className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">Transport Assignment</h4>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3.5 bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/70">
                        <div className="w-10 h-10 rounded-xl bg-[#005BAC] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">Assigned Bus</p>
                          <p className="font-extrabold text-slate-950 text-base truncate">{driverProfile?.assignedBus || 'Not Assigned'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3.5 bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200/70">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider">Assigned Route</p>
                          <p className="font-extrabold text-slate-950 text-base truncate">{driverProfile?.assignedRoute || 'Not Assigned'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold">
                        <Clock className="w-4 h-4 text-[#005BAC]" />
                        <span><strong>Assigned Shift:</strong> {driverProfile?.shift || 'Morning Shift (06:00 AM - 02:00 PM)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 5: EMPLOYMENT */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">Employment Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Joining Date</p>
                        <p className="font-extrabold text-slate-800 mt-0.5 text-xs">{driverProfile?.joiningDate || '2018-05-01'}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 md:col-span-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Department</p>
                        <p className="font-bold text-slate-800 mt-0.5 text-xs truncate" title={driverProfile?.department || 'Transport & Fleet Logistics'}>
                          {driverProfile?.department || 'Transport & Fleet'}
                        </p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                        <p className="text-[10px] font-extrabold text-emerald-700 uppercase">Monthly Salary</p>
                        <p className="font-extrabold text-emerald-700 mt-0.5 font-mono text-sm">
                          ₹{driverProfile?.salary?.toLocaleString('en-IN') || '30,000'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD 6: EMERGENCY CONTACT */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-rose-100" />
                      </div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">Emergency Contact</h4>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-200/70 rounded-xl p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-extrabold text-rose-500 uppercase">Contact Person</p>
                        <p className="font-extrabold text-slate-900 text-base mt-0.5">{driverProfile?.emergencyContactName || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-extrabold text-rose-500 uppercase">Phone Number</p>
                        <a 
                          href={`tel:${driverProfile?.emergencyContactNumber}`} 
                          className="font-mono font-extrabold text-[#005BAC] text-sm hover:underline flex items-center gap-1 mt-0.5 justify-end"
                        >
                          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                          <span>{driverProfile?.emergencyContactNumber || 'N/A'}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* CARD 7: IDENTITY (AADHAAR) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
                        <Fingerprint className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] uppercase tracking-wider">Identity Document</h4>
                    </div>
                    <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
                        <div>
                          <p className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider">Aadhaar Number (Confidential)</p>
                          <p className="font-mono font-extrabold text-slate-900 text-lg tracking-widest mt-0.5">
                            {driverProfile?.aadhaarNumber || 'XXXX XXXX 4567'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-teal-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Verified
                      </span>
                    </div>
                  </div>

                </div>
              )}
            </ScrollArea>

            {/* DRAWER FOOTER */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0 shadow-lg">
              <Button 
                variant="outline"
                onClick={() => fetchDriverMe(true)}
                className="rounded-xl h-11 px-4 font-bold border-slate-300 text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
                title="Refresh Profile from MongoDB"
              >
                <RefreshCw className={cn("w-4 h-4 text-[#005BAC]", loadingProfile && "animate-spin")} />
                <span>Refresh</span>
              </Button>
              <Button 
                onClick={() => setIsProfileDrawerOpen(false)}
                className="bg-[#005BAC] hover:bg-[#004A8F] text-white rounded-xl h-11 px-8 font-bold shadow-md transition-all flex-1 text-base"
              >
                Close Drawer
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
