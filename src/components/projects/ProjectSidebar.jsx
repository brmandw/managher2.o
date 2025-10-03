'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Home, Telescope, Package, Wallet } from 'lucide-react';
 
export function ProjectSidebar({ className, projectId }) {
  const pathname = usePathname();

  const items = [
    {
      href: `/projects/${projectId}/overview`,
      title: 'Overview',
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      href: `/projects/${projectId}/marketability`,
      title: 'Marketability',
      icon: <Telescope className="mr-2 h-4 w-4" />,
    },
    {
      href: `/projects/${projectId}/innovation`,
      title: 'Innovation',
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      href: `/projects/${projectId}/financials`,
      title: 'Financials Simulator',
      icon: <Wallet className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 ml-8', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname.startsWith(item.href)
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
