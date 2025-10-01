import ProjectSidebar from '@/components/projects/ProjectSidebar';
import React from 'react';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ProjectSidebar projectId={params.id} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
