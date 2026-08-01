import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#EAF4FF] text-[#1E293B] font-sans p-3 gap-3 overflow-hidden selection:bg-[#005BAC]/10 selection:text-[#005BAC]">
      <Sidebar role="student" className="hidden md:flex rounded-2xl shrink-0" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-2xl bg-white border border-[#D6EAF8] shadow-sm relative">
        <Header role="student" />
        <main className="flex-1 overflow-auto bg-[#EAF4FF]/40 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto p-4 md:p-6 w-full">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
