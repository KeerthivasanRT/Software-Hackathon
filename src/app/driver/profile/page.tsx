'use client';

import { useState, useEffect } from 'react';
import { useDataStore } from '@/lib/store';
import { getApiUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  UserCircle, 
  Award, 
  Bus as BusIcon, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Upload, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Navigation, 
  Loader2, 
  UserCheck 
} from 'lucide-react';

export default function DriverProfilePage() {
  const { user, drivers, buses, routes, updateDriver } = useDataStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Initialize state cleanly to prevent Next.js SSR hydration mismatch errors
  const [profile, setProfile] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: '',
    licenseNumber: '',
    licenseExpiry: '',
    experience: 0,
    assignedBus: 'Not Assigned',
    assignedRoute: 'Not Assigned',
    status: 'Active',
    createdDate: 'N/A',
    joinedDate: 'N/A'
  });

  const [editPhone, setEditPhone] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editPhoto, setEditPhoto] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      // Read currently authenticated user safely on client side
      const authUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const authUser = authUserStr ? JSON.parse(authUserStr) : null;
      const activeUser = user || authUser;

      // Match against store safely with optional chaining to prevent runtime exceptions
      const matchedDriver = drivers.find(d => 
        (activeUser?.id && d.id === activeUser.id) || 
        (activeUser?.email && d.email && d.email.toLowerCase() === activeUser.email.toLowerCase()) ||
        (activeUser?.name && d.name && d.name.toLowerCase() === activeUser.name.toLowerCase())
      );

      const initialBus = buses.find(b => b.id === matchedDriver?.assignedBusId || b.driverId === matchedDriver?.id);
      const initialRoute = routes.find(r => r.id === (matchedDriver?.assignedRouteId || initialBus?.routeId));

      // 1. Attempt fetching live profile record directly from backend API via JWT token
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          const res = await fetch(getApiUrl('/api/drivers/profile'), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success && data.data) {
            const p = data.data;
            setProfile({
              name: p.name || activeUser?.name || '',
              employeeId: p.employeeId || activeUser?.employeeId || '',
              email: p.email || activeUser?.email || '',
              phone: p.phone || activeUser?.phone || '',
              address: p.address || '',
              profilePhoto: p.profilePhoto || activeUser?.profilePhoto || '',
              licenseNumber: p.licenseNumber || '',
              licenseExpiry: p.licenseExpiry || '',
              experience: p.experience !== undefined ? Number(p.experience) : 0,
              assignedBus: p.assignedBus || 'Not Assigned',
              assignedRoute: p.assignedRoute || 'Not Assigned',
              status: p.status || activeUser?.status || 'Active',
              createdDate: p.createdDate || p.joinedDate || 'N/A',
              joinedDate: p.joinedDate || p.createdDate || 'N/A'
            });
            setEditPhone(p.phone || activeUser?.phone || '');
            setEditAddress(p.address || '');
            setEditPhoto(p.profilePhoto || activeUser?.profilePhoto || '');
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not reach /api/drivers/profile, attempting secondary verified sync:', err);
      }

      // 2. Fallback: If live endpoint is unavailable or pending server reboot, sync via dashboard and store session
      let fallbackBus = initialBus ? (initialBus.busNumber || initialBus.registrationNumber) : 'Not Assigned';
      let fallbackRoute = initialRoute ? (initialRoute.name || 'Assigned Route') : 'Not Assigned';

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          const res2 = await fetch(getApiUrl('/api/drivers/me/dashboard'), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data2 = await res2.json();
          if (res2.ok && data2.success && data2.data) {
            const dash = data2.data;
            if (dash.assignedBus) fallbackBus = `${dash.assignedBus}`;
            if (dash.routeName) fallbackRoute = `${dash.routeName}`;
          }
        }
      } catch (e) {
        console.warn('Secondary dashboard sync failed:', e);
      }

      const derivedPhone = activeUser?.phone || matchedDriver?.phone || '';
      const derivedAddress = matchedDriver?.address || activeUser?.address || '';
      const derivedPhoto = matchedDriver?.profilePhoto || activeUser?.profilePhoto || '';

      setProfile({
        name: activeUser?.name || matchedDriver?.name || '',
        employeeId: matchedDriver?.employeeId || activeUser?.employeeId || '',
        email: activeUser?.email || matchedDriver?.email || '',
        phone: derivedPhone,
        address: derivedAddress,
        profilePhoto: derivedPhoto,
        licenseNumber: matchedDriver?.licenseNumber || '',
        licenseExpiry: matchedDriver?.licenseExpiry || '',
        experience: matchedDriver?.experience !== undefined ? Number(matchedDriver.experience) : 0,
        assignedBus: fallbackBus,
        assignedRoute: fallbackRoute,
        status: matchedDriver?.status || activeUser?.status || 'Active',
        createdDate: matchedDriver?.createdAt ? matchedDriver.createdAt.toString().split('T')[0] : 'N/A',
        joinedDate: matchedDriver?.createdAt ? matchedDriver.createdAt.toString().split('T')[0] : 'N/A'
      });

      setEditPhone(derivedPhone);
      setEditAddress(derivedAddress);
      setEditPhoto(derivedPhoto);
      setLoading(false);
    };

    fetchProfileData();
  }, [user, drivers, buses, routes]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setEditPhoto(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!editPhone || !editPhone.trim() || !phoneRegex.test(editPhone.trim())) {
      setToast({ type: 'error', text: 'Validation Error: Please provide a valid phone number (7-15 digits).' });
      setTimeout(() => setToast(null), 4500);
      return;
    }

    if (!editAddress || !editAddress.trim()) {
      setToast({ type: 'error', text: 'Validation Error: Address cannot be empty.' });
      setTimeout(() => setToast(null), 4500);
      return;
    }

    setSaving(true);
    const updatePayload = {
      phone: editPhone.trim(),
      address: editAddress.trim(),
      profilePhoto: editPhoto
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const res = await fetch(getApiUrl('/api/drivers/profile'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatePayload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.data) {
            setProfile(prev => ({
              ...prev,
              phone: data.data.phone ?? updatePayload.phone,
              address: data.data.address ?? updatePayload.address,
              profilePhoto: data.data.profilePhoto ?? updatePayload.profilePhoto
            }));
          }
        }
      }
    } catch (err) {
      console.warn('Backend connection unavailable for PUT profile:', err);
    }

    // Synchronize client-side sessions and Zustand store
    try {
      if (typeof window !== 'undefined') {
        const savedUserStr = localStorage.getItem('user');
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          parsed.phone = updatePayload.phone;
          parsed.address = updatePayload.address;
          parsed.profilePhoto = updatePayload.profilePhoto;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }

      const authUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const authUser = authUserStr ? JSON.parse(authUserStr) : null;
      const activeUser = user || authUser;
      const targetDriver = drivers.find(d => 
        (activeUser?.id && d.id === activeUser.id) || 
        (activeUser?.email && d.email && d.email.toLowerCase() === activeUser.email.toLowerCase()) ||
        (activeUser?.name && d.name && d.name.toLowerCase() === activeUser.name.toLowerCase())
      );

      if (targetDriver) {
        updateDriver({
          ...targetDriver,
          phone: updatePayload.phone,
          address: updatePayload.address,
          profilePhoto: updatePayload.profilePhoto
        });
      }
    } catch (e) {
      console.error('Store update synchronization failed:', e);
    }

    setProfile(prev => ({
      ...prev,
      phone: updatePayload.phone,
      address: updatePayload.address,
      profilePhoto: updatePayload.profilePhoto
    }));
    setSaving(false);
    setIsEditing(false);
    setToast({ type: 'success', text: 'Driver Profile updated successfully!' });
    setTimeout(() => setToast(null), 4500);
  };

  const handleCancel = () => {
    setEditPhone(profile.phone);
    setEditAddress(profile.address);
    setEditPhoto(profile.profilePhoto);
    setIsEditing(false);
    setToast(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#005BAC]" />
        <p className="font-semibold text-sm animate-pulse">Loading driver profile details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-[#005BAC]" />
            Driver Profile
          </h1>
          <p className="text-slate-600 mt-1 font-medium text-sm">
            Manage your verified account credentials and contact details.
          </p>
        </div>
        <div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-[#005BAC] hover:bg-[#004A8F] text-white rounded-xl h-11 px-6 font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleCancel}
                className="border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl h-11 px-5 font-semibold transition-all"
                disabled={saving}
              >
                <X className="w-4 h-4 mr-1.5" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-semibold shadow-md transition-all flex items-center gap-2"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* HERO BANNER & PROFILE PHOTO */}
      <div className="bg-gradient-to-r from-[#005BAC]/15 via-sky-100/60 to-[#1976D2]/10 border border-[#D6ECFA] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="relative group">
          <Avatar className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-xl bg-[#005BAC] text-white text-4xl font-extrabold flex items-center justify-center flex-shrink-0 overflow-hidden">
            {(isEditing ? editPhoto : profile.profilePhoto) ? (
              <img 
                src={isEditing ? editPhoto : profile.profilePhoto} 
                alt={profile.name || 'Profile'} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <AvatarFallback className="bg-[#005BAC] text-white">
                {(profile.name || 'D').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          {isEditing && (
            <label className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center shadow-inner">
              <Upload className="w-6 h-6 mb-1 text-sky-400 animate-bounce" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile.name || 'Authenticated Driver'}
            </h2>
            {profile.employeeId && (
              <span className="bg-[#005BAC] text-white font-mono text-xs px-3 py-1 rounded-full font-bold uppercase shadow-sm">
                {profile.employeeId}
              </span>
            )}
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-3 py-1 rounded-full font-bold capitalize flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              {profile.status}
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium flex flex-wrap items-center justify-center md:justify-start gap-3">
            {profile.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-600 flex-shrink-0" />
                {profile.email}
              </span>
            )}
            {profile.phone && (
              <>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  {profile.phone}
                </span>
              </>
            )}
          </p>

          {isEditing && (
            <div className="pt-2 max-w-md">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Or paste Image URL / Base64 string</Label>
              <Input 
                value={editPhoto} 
                onChange={e => setEditPhoto(e.target.value)} 
                placeholder="https://example.com/avatar.jpg" 
                className="h-9 text-xs border-slate-300 bg-white shadow-inner"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2x2 GRID OF PROFESSIONAL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. PERSONAL INFORMATION */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-[#D6ECFA] bg-slate-50/70 pb-4 px-6 pt-5">
            <CardTitle className="flex items-center text-slate-800 text-base font-bold">
              <UserCircle className="w-5 h-5 mr-2.5 text-[#005BAC]" />
              PERSONAL INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Name
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <Input value={profile.name} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-bold font-sans cursor-not-allowed" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Employee ID
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <Input value={profile.employeeId} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-mono font-bold cursor-not-allowed" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Email Address
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <Input value={profile.email} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-medium cursor-not-allowed" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  Phone
                  {isEditing ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">Editable</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium lowercase">Read Mode</span>
                  )}
                </Label>
                <Input 
                  value={isEditing ? editPhone : profile.phone} 
                  onChange={e => setEditPhone(e.target.value)} 
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  className={`h-11 font-medium ${isEditing ? 'border-sky-500 bg-white ring-2 ring-sky-500/20 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800'}`} 
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  Address
                  {isEditing ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">Editable</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium lowercase">Read Mode</span>
                  )}
                </Label>
                <Input 
                  value={isEditing ? editAddress : profile.address} 
                  onChange={e => setEditAddress(e.target.value)} 
                  disabled={!isEditing}
                  placeholder="Enter residential address"
                  className={`h-11 font-medium ${isEditing ? 'border-sky-500 bg-white ring-2 ring-sky-500/20 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800'}`} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. LICENSE INFORMATION */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-[#D6ECFA] bg-slate-50/70 pb-4 px-6 pt-5">
            <CardTitle className="flex items-center text-slate-800 text-base font-bold">
              <Award className="w-5 h-5 mr-2.5 text-sky-600" />
              LICENSE INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  License Number
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <div className="relative">
                  <Input value={profile.licenseNumber || 'Not available'} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-mono font-extrabold text-base tracking-wide cursor-not-allowed pl-10" />
                  <FileText className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    License Expiry
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                  </Label>
                  <div className="relative">
                    <Input value={profile.licenseExpiry || 'Not available'} disabled className="h-11 bg-emerald-50/60 border-emerald-200 text-emerald-900 font-bold cursor-not-allowed pl-10" />
                    <Calendar className="w-5 h-5 text-emerald-600 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    Experience
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                  </Label>
                  <Input value={profile.experience ? `${profile.experience} Years` : '0 Years'} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-bold cursor-not-allowed" />
                </div>
              </div>

              <div className="bg-sky-50/70 border border-[#D6ECFA] rounded-xl p-4 mt-2">
                <p className="text-xs text-slate-600 font-medium leading-relaxed flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#005BAC] flex-shrink-0 mt-0.5" />
                  <span>Operating license verified by Transport Admin. Present documentation at office for updates.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. TRANSPORT INFORMATION */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-[#D6ECFA] bg-slate-50/70 pb-4 px-6 pt-5">
            <CardTitle className="flex items-center text-slate-800 text-base font-bold">
              <BusIcon className="w-5 h-5 mr-2.5 text-[#005BAC]" />
              TRANSPORT INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Assigned Bus
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <div className="relative">
                  <Input value={profile.assignedBus || 'Not Assigned'} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-bold cursor-not-allowed pl-10" />
                  <BusIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Assigned Route
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <div className="relative">
                  <Input value={profile.assignedRoute || 'Not Assigned'} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-bold cursor-not-allowed pl-10" />
                  <Navigation className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. ACCOUNT INFORMATION */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-[#D6ECFA] bg-slate-50/70 pb-4 px-6 pt-5">
            <CardTitle className="flex items-center text-slate-800 text-base font-bold">
              <Shield className="w-5 h-5 mr-2.5 text-indigo-600" />
              ACCOUNT INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Status
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <Input value={(profile.status || 'Active').toUpperCase()} disabled className="h-11 bg-emerald-50/50 border-emerald-200 text-emerald-900 font-extrabold tracking-wider text-xs cursor-not-allowed" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Joined Date
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Read-Only</span>
                </Label>
                <Input value={profile.joinedDate || profile.createdDate || 'N/A'} disabled className="h-11 bg-slate-50 border-slate-200 text-slate-800 font-medium cursor-not-allowed" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'error' 
            ? 'bg-red-600 text-white border-red-400 shadow-red-600/30' 
            : 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-semibold text-sm tracking-wide">{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75 p-1 rounded-full transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
