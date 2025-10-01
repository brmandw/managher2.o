'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Home, Telescope, Package } from 'lucide-react';

interface ProjectSidebarProps extends React.HTMLAttributes<HTMLElement> {
  projectId: string;
}

export default function ProjectSidebar({ className, projectId }: ProjectSidebarProps) {
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
  ];

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-purple-600 text-white hover:bg-purple-600/70 shadow-lg shadow-blue-500/30'
              : 'hover:bg-transparent hover:text-black hover:underline',
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
