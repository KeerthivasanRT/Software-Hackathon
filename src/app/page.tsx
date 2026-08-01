'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/store';
import { getApiUrl } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus, ArrowRight, Lock, Mail, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { BitLogo } from '@/components/ui/bit-logo';

export default function LoginPage() {
  const router = useRouter();
  const login = useDataStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'student' | 'driver' | 'admin'>('student');

  const handleLoginSubmit = async (selectedRole: 'admin' | 'driver' | 'student', defaultEmail: string) => {
    setLoading(true);
    setErrorMessage('');

    const targetEmail = email.trim() || defaultEmail;
    const targetPassword = password || (selectedRole === 'admin' ? 'Admin@123' : selectedRole === 'driver' ? 'Driver@123' : 'Student@123');

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword, role: selectedRole })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        login(data.user.role, data.user.id, data.user.email);
        router.push(`/${data.user.role}/dashboard`);
        return;
      } else {
        setErrorMessage(data.message || 'Invalid Email or Password');
      }
    } catch (err) {
      setErrorMessage('Unable to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#005BAC] via-[#1976D2] to-[#004687] flex flex-col justify-between p-4 md:p-8 relative overflow-hidden text-white selection:bg-white/20 selection:text-white">
      {/* Background Subtle Geometric Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full relative z-10">
        <BitLogo variant="light" size="lg" />
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-sky-100 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-sky-300" />
          <span>Official Campus Telematics Portal</span>
        </div>
      </header>

      {/* MAIN LOGIN CARD CONTAINER */}
      <main className="my-auto py-12 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* LOGIN CARD */}
          <Card className="bg-white/95 backdrop-blur-xl border border-white text-[#1E293B] shadow-2xl rounded-3xl p-2">
            <CardHeader className="text-center pb-4 border-b border-[#D6EAF8]/60 bg-transparent">
              <div className="w-14 h-14 bg-[#EAF4FF] text-[#005BAC] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-[#D6EAF8]">
                <Bus className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl font-extrabold text-[#005BAC] tracking-tight">
                BIT Transport Portal
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium mt-1">
                Bannari Amman Institute of Technology
              </CardDescription>
              <p className="text-[11px] font-bold text-[#1976D2] mt-1 italic">
                "Smart, Secure and Efficient Campus Transportation"
              </p>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setErrorMessage(''); }} className="w-full">
                <TabsList className="grid grid-cols-3 bg-[#EAF4FF] p-1 rounded-xl border border-[#D6EAF8] mb-6">
                  <TabsTrigger value="student" className="text-xs font-bold rounded-lg data-[state=active]:bg-[#005BAC] data-[state=active]:text-white">
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="driver" className="text-xs font-bold rounded-lg data-[state=active]:bg-[#005BAC] data-[state=active]:text-white">
                    Driver
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs font-bold rounded-lg data-[state=active]:bg-[#005BAC] data-[state=active]:text-white">
                    Admin
                  </TabsTrigger>
                </TabsList>

                {/* STUDENT LOGIN TAB */}
                <TabsContent value="student" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Student Email / Roll No</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <Input
                        type="text"
                        placeholder="arun@student.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 text-xs border-[#D6EAF8]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <Input
                        type="password"
                        placeholder="Student@123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 text-xs border-[#D6EAF8]"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLoginSubmit('student', 'arun@student.com')}
                    disabled={loading}
                    className="w-full h-11 btn-bit-gradient text-xs font-extrabold shadow-lg flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <span>Sign In as Student</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* DRIVER LOGIN TAB */}
                <TabsContent value="driver" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Driver Email / Employee ID</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <Input
                        type="text"
                        placeholder="murugan@driver.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 text-xs border-[#D6EAF8]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <Input
                        type="password"
                        placeholder="Driver@123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 text-xs border-[#D6EAF8]"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLoginSubmit('driver', 'murugan@driver.com')}
                    disabled={loading}
                    className="w-full h-11 btn-bit-gradient text-xs font-extrabold shadow-lg flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <span>Sign In as Driver</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* ADMIN LOGIN TAB */}
                <TabsContent value="admin" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Admin Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <Input
                        type="email"
                        placeholder="admin@admin.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 text-xs border-[#D6EAF8]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <Input
                        type="password"
                        placeholder="Admin@123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 text-xs border-[#D6EAF8]"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLoginSubmit('admin', 'admin@admin.com')}
                    disabled={loading}
                    className="w-full h-11 btn-bit-gradient text-xs font-extrabold shadow-lg flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <span>Sign In to Executive Portal</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* QUICK DEMO BADGE */}
          <div className="text-center text-xs text-sky-100 font-medium">
            Campus Helpline: <strong className="text-white">+91 4289 226300</strong> • Sathyamangalam, Erode, Tamil Nadu
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-sky-200 font-medium relative z-10 pt-4 border-t border-white/10">
        © 2026 <strong>Bannari Amman Institute of Technology</strong>. Smart Transport Management Portal.
      </footer>
    </div>
  );
}
