import { AppHeader } from '@/components/common/AppHeader';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
