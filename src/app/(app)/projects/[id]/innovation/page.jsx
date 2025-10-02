'use client';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingBag, MessageSquare } from 'lucide-react';
import { PackagingForm } from '@/components/innovation/PackagingForm';
import { VariantManager } from '@/components/innovation/VariantManager';
import { FeedbackLoop } from '@/components/innovation/FeedbackLoop';
import { loadProjectData } from '@/lib/project-storage';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';

export default function InnovationPage() {
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

  const selectedSegments = projectData.marketability?.recommendedSegments?.map(s => s.segment) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sustainable Innovation</h2>
        <p className="text-muted-foreground">
          Continuously improve your product and packaging based on market feedback.
        </p>
      </div>

      <Tabs defaultValue="packaging" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packaging">
            <Package className="mr-2 h-4 w-4" />
            Packaging
          </TabsTrigger>
          <TabsTrigger value="variants">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Product Variants
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback & Iteration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="packaging" className="mt-6">
          <PackagingForm initialData={projectData.innovation?.packaging} />
        </TabsContent>
        <TabsContent value="variants" className="mt-6">
          <VariantManager selectedSegments={selectedSegments} initialVariants={projectData.innovation?.variants || []} />
        </TabsContent>
        <TabsContent value="feedback" className="mt-6">
          <FeedbackLoop initialData={projectData.innovation?.feedback} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
