'use client';

import { MarketabilityWizard } from '@/components/marketability/MarketabilityWizard';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { loadProjectData } from '@/lib/project-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useProjectDataStore } from '@/lib/useProjectData';

export default function MarketabilityPage() {
  const { projectData, setProjectData } = useProjectDataStore();
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
                  <CardTitle>Proyek Tidak Ditemukan</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Proyek tidak ditemukan. Silakan buat proyek baru.</p>
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Marketability Analysis</h2>
        <p className="text-muted-foreground">
          Follow these steps to define your market strategy with the help of AI.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <MarketabilityWizard projectData={projectData} />
      </Suspense>
    </div>
  );
}
