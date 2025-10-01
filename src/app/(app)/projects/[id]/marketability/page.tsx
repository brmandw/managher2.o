import { MarketabilityWizard } from '@/components/marketability/MarketabilityWizard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketabilityPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const projectData = {
    businessName: searchParams?.name as string || "My Business",
    businessType: searchParams?.type as string || "Other",
    productsSold: searchParams?.products as string || "Various products",
  };
  
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
