'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Lock, Smartphone, Shield, Check, AlertCircle, Save } from 'lucide-react';

export default function StudentSettingsPage() {
  const { user, students } = useDataStore();
  const currentStudent = students.find(s => s.id === user?.id) || students[0];

  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Preferences updated successfully and synchronized with BIT Depot alerts!');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Please enter both current and new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setSavedMessage('Security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-[#005BAC] rounded-xl"><Settings className="w-6 h-6" /></span>
            Account & Portal Settings
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Manage your campus notification preferences, security credentials, and transport contact details.</p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NOTIFICATION PREFERENCES */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#005BAC]" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">Configure how you receive transport and bus tracking alerts</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSavePreferences} className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-200/80">
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-slate-800">SMS Bus Delay Alerts</p>
                  <p className="text-[11px] text-slate-500 font-medium">Instant SMS when assigned bus departs depot or is delayed</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={smsNotifications} 
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="w-5 h-5 accent-[#005BAC] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-200/80">
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-slate-800">In-App Push Notifications</p>
                  <p className="text-[11px] text-slate-500 font-medium">Receive real-time banners for fee due dates and announcements</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={pushNotifications} 
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="w-5 h-5 accent-[#005BAC] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/40 border border-rose-200/60">
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-rose-950 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-rose-600" />
                    <span>Emergency SOS Broadcasts</span>
                  </p>
                  <p className="text-[11px] text-rose-700 font-medium">Mandatory safety alerts for route detours or emergency assistance</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emergencyAlerts} 
                  disabled
                  className="w-5 h-5 accent-rose-600 rounded cursor-not-allowed opacity-80"
                />
              </div>

              <Button type="submit" className="w-full bg-[#005BAC] hover:bg-[#004282] text-white font-extrabold rounded-xl h-10 shadow-sm flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                <span>Save Notification Settings</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* SECURITY & PASSWORD */}
        <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#005BAC]" />
              <span>Security & Credentials</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">Update your account login password and security tokens</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Current Password</Label>
                <Input 
                  type="password"
                  placeholder="Enter current password..." 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-50/50 border-slate-200 rounded-xl text-xs h-9 focus-visible:ring-[#005BAC]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">New Password</Label>
                <Input 
                  type="password"
                  placeholder="Enter new password (min 8 characters)..." 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-50/50 border-slate-200 rounded-xl text-xs h-9 focus-visible:ring-[#005BAC]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Confirm New Password</Label>
                <Input 
                  type="password"
                  placeholder="Re-enter new password..." 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-50/50 border-slate-200 rounded-xl text-xs h-9 focus-visible:ring-[#005BAC]"
                />
              </div>

              <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl h-10 shadow-sm mt-2 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
