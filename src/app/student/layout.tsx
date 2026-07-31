import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans p-3 lg:p-4 gap-3 lg:gap-4 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Sidebar role="student" className="hidden lg:flex w-[260px] rounded-2xl bg-white border border-slate-200/50 shadow-premium shrink-0" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-2xl bg-white border border-slate-200/50 shadow-premium relative">
        <Header role="student" />
        <main className="flex-1 overflow-auto bg-slate-50/30">
          <div className="max-w-7xl mx-auto p-6 lg:p-10 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
