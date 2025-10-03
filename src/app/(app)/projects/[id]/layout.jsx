'use client';
import { ProjectSidebar } from '@/components/projects/ProjectSidebar';
import { loadProjectData } from '@/lib/project-storage';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectLayout({children}) {
  const [projectExists, setProjectExists] = useState(undefined);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams()

  useEffect(() => {
    // MOCK MODE: Check if project data exists in localStorage
    const data = loadProjectData();
    const exists = data?.id === params.id;
    setProjectExists(exists);

    // Redirect if project does not exist, but not from the "new" page
    // as it's the one that creates the project.
    if (!exists && !pathname.includes('/projects/new')) {
        // Redirect to new project page or dashboard
        router.replace('/projects/new');
    }
  }, [params.id, router, pathname]);

  if (projectExists === undefined) {
    return (
        <div className="container py-10">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <Skeleton className="h-40 w-full" />
                </aside>
                <div className="flex-1">
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!projectExists) {
      return null; // Render nothing while redirecting
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-16">
        <aside className="-mx-4 lg:w-1/5">
          <ProjectSidebar projectId={params.id} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
