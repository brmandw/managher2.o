'use client';
import { NewProjectHeader } from '@/components/common/NewProjectHeader';
import { AppHeader } from '@/components/common/AppHeader';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col md:mx-16 sm:mx-2">
      {pathname !== '/dashboard' ? <NewProjectHeader /> : <AppHeader />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
