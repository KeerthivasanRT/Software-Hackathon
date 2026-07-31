import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#EEF8FF] text-slate-900 font-sans p-4 gap-4 overflow-hidden selection:bg-sky-500/30 selection:text-sky-900">
      <Sidebar role="admin" className="hidden md:flex rounded-2xl bg-[#F8FCFF] border border-[#D6ECFA] shadow-lg shrink-0 z-10" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-2xl bg-white border border-[#D6ECFA] shadow-lg relative z-0">
        <Header role="admin" />
        <main className="flex-1 overflow-auto bg-[#EEF8FF]">
          <div className="max-w-7xl mx-auto p-6 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
