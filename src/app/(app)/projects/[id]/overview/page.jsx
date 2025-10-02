'use client';
import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectStore } from '@/lib/useProjectStore';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Loader, Package, Telescope, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';


// const ModuleStatus = ({ title, status, href, icon }) => {
    
//     const isComplete = status === 'complete';
//     return (
//         <Link href={href}>
//             <Card className="hover:border-primary transition-colors">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium flex items-center gap-2">
//                         {icon}
//                         {title}
//                     </CardTitle>
//                     {isComplete ? (
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                     ) : (
//                         <Circle className="h-5 w-5 text-muted-foreground" />
//                     )}
//                 </CardHeader>
//                 <CardContent>
//                     <p className="text-xs text-muted-foreground">
//                         {isComplete ? 'Completed' : 'Ready to start'}
//                     </p>
//                 </CardContent>
//             </Card>
//         </Link>
//     );
// };

export default function ProjectOverviewPage() {
    const params = useParams();
    const projectId = params?.id;

    const { projects } = useProjectStore();
    const project = projects.find(p => p.id === projectId);

  // Handle loading / not found
  if (!projectId) {
    return <div className="mt-16 mx-16">Invalid project ID</div>;
  }

  if (!project) {
    return <div className="mt-16 mx-16">Project not found</div>;
  }
    return (
        <div className="space-y-6 mt-16 mx-16">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Project Overview</h2>
                <p className="text-muted-foreground">A summary of your business project.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{project.business.name}</CardTitle>
                    <CardDescription>
                        <Badge variant="secondary">{project.business.type}</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Products / Services</h4>
                        <p className="text-muted-foreground text-sm">{project.business.products}</p>
                    </div>
                    {project.business.description && (
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Description</h4>
                            <p className="text-muted-foreground text-sm">{project.business.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* <div>
                <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   <ModuleStatus 
                        title="Marketability"
                        status={getStatus(marketability)}
                        href={`/projects/${resolved.id}/marketability`}
                        icon={<Telescope className="h-5 w-5 text-primary"/>}
                   />
                   <ModuleStatus 
                        title="Innovation"
                        status={getStatus(innovation)}
                        href={`/projects/${resolved.id}/innovation`}
                        icon={<Package className="h-5 w-5 text-primary"/>}
                    />
                    <ModuleStatus 
                        title="Financials"
                        status={getStatus(financials)}
                        href={`/projects/${resolved.id}/financials`}
                        icon={<Wallet className="h-5 w-5 text-primary"/>}
                    />
                </div>
            </div> */}

             <div className="text-center pt-4">
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
             </div>
        </div>
    );
}
