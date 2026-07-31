import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Sidebar role="student" className="hidden lg:flex w-[260px] border-r border-slate-200/60 bg-white" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header role="student" />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 lg:p-10 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
