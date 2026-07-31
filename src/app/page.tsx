'use client';

import { useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Bus, User, MapPin } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useDataStore((state) => state.login);

  const handleLogin = (role: 'admin' | 'driver' | 'student') => {
    login(role);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-3xl" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      
      <Card className="w-full max-w-md relative z-10 border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-br from-blue-700 to-cyan-600 bg-clip-text text-transparent">Smart Transport</CardTitle>
            <CardDescription className="text-slate-600 mt-2">Select your role to continue</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pb-8">
          <Button 
            variant="outline" 
            className="h-14 text-lg justify-start px-6 bg-white/50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm"
            onClick={() => handleLogin('admin')}
          >
            <Shield className="w-6 h-6 mr-4 text-blue-600" />
            Login as Admin
          </Button>
          <Button 
            variant="outline" 
            className="h-14 text-lg justify-start px-6 bg-white/50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm"
            onClick={() => handleLogin('driver')}
          >
            <Bus className="w-6 h-6 mr-4 text-emerald-600" />
            Login as Driver
          </Button>
          <Button 
            variant="outline" 
            className="h-14 text-lg justify-start px-6 bg-white/50 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all shadow-sm"
            onClick={() => handleLogin('student')}
          >
            <User className="w-6 h-6 mr-4 text-violet-600" />
            Login as Student
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
