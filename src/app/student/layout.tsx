import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans p-4 gap-4 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Sidebar role="student" className="hidden md:flex rounded-2xl bg-white border border-slate-200/50 shadow-sm shrink-0 z-10" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-2xl bg-white border border-slate-200/50 shadow-sm relative z-0">
        <Header role="student" />
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto p-6 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
