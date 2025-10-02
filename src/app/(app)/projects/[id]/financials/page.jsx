'use client';
import { useEffect, useState } from 'react';
import { loadProjectData } from '@/lib/project-storage';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialsDashboard } from '@/components/financials/FinancialsDashboard';
import { useParams } from 'next/navigation';

export default function FinancialsPage() {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams()

  useEffect(() => {
    // MOCK MODE: Load data from localStorage
    const data = loadProjectData();
    if (data && data.id === params.id) {
        setProjectData(data);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  if (!projectData) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not find project data. Please start a new project.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Financial Readiness</h2>
        <p className="text-muted-foreground">
          Simulate your revenue and assess your business's financial health.
        </p>
      </div>

      <FinancialsDashboard projectData={projectData} />
    </div>
  );
}
