'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useDataStore((state) => state.login);
  const drivers = useDataStore((state) => state.drivers);
  const students = useDataStore((state) => state.students);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    let role: 'admin' | 'driver' | 'student' | null = null;
    let foundUserId: string | null = null;
    const lowerEmail = email.toLowerCase();
    const lowerName = name.toLowerCase();
    
    // Find driver by name or email (partial match)
    const matchedDriver = drivers.find(d => 
      d.email.toLowerCase() === lowerEmail || 
      lowerEmail.includes(d.name.toLowerCase().split(' ').pop() || d.name.toLowerCase()) || 
      d.name.toLowerCase().includes(lowerName)
    );
    if (matchedDriver) {
      role = 'driver';
      foundUserId = matchedDriver.id;
    }
    
    // Find student by name or email (partial match)
    if (!role) {
      const matchedStudent = students.find(s => 
        s.email.toLowerCase() === lowerEmail || 
        s.name.toLowerCase().includes(lowerName)
      );
      if (matchedStudent) {
        role = 'student';
        foundUserId = matchedStudent.id;
      }
    }
    
    if (!role && (lowerEmail.includes('@admin') || lowerEmail === 'admin@college.edu')) {
      role = 'admin';
    }
    
    if (!role) {
      setError('Invalid credentials. Please use an Admin, Student or Driver account.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    login(role, foundUserId, lowerEmail);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Side: Branding / Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center flex-col p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 opacity-100 z-0" />
        
        {/* Abstract decorative elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
        
        <div className="relative z-10 max-w-md space-y-8 flex flex-col items-center">
          <div className="bg-white/5 p-5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
            <MapPin className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Smart Transport
              <br />
              Management Portal
            </h1>
            <p className="text-lg text-slate-300 font-medium tracking-wide">
              Digitizing Campus Transportation.
            </p>
          </div>

          <div className="pt-12">
            <div className="flex items-center space-x-[-12px] opacity-80">
               <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 shadow-md" />
               <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 shadow-md" />
               <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-slate-900 shadow-md" />
               <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-md">+2k</div>
            </div>
            <p className="text-sm text-slate-400 mt-4 font-medium">Trusted by over 2,000 students and staff.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50 lg:bg-white relative">
        <div className="w-full max-w-sm space-y-8 relative z-10">
          
          <div className="space-y-2 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
               <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-600/20">
                 <MapPin className="w-6 h-6 text-white" />
               </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Sign in to your institutional account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1 flex items-start">
                <svg className="w-5 h-5 mr-2 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">Full Name / Username</Label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="John Doe" 
                  className="h-12 bg-white lg:bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 transition-all rounded-xl shadow-sm text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Institutional Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="john@student.com" 
                  className="h-12 bg-white lg:bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 transition-all rounded-xl shadow-sm text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Password</Label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors" tabIndex={-1}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className="h-12 bg-white lg:bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 transition-all rounded-xl shadow-sm text-base pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-1 transition-colors cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer font-medium">Remember me for 30 days</Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all group mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 font-medium">
              Need help? <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">Contact IT Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
