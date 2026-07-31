import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50/50">
      <Sidebar role="driver" className="hidden lg:flex w-72" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header role="driver" />
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
