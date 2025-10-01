import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingBag, MessageSquare } from 'lucide-react';
import { PackagingForm } from '@/components/innovation/PackagingForm';
import { VariantManager } from '@/components/innovation/VariantManager';
import { FeedbackLoop } from '@/components/innovation/FeedbackLoop';

export default function InnovationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
    const projectData = {
    businessName: searchParams?.name as string || "My Business",
    businessType: searchParams?.type as string || "Other",
    productsSold: searchParams?.products as string || "Various products",
  };
  const selectedSegments = searchParams?.segments ? (searchParams.segments as string).split(',') : [];


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
          <PackagingForm />
        </TabsContent>
        <TabsContent value="variants" className="mt-6">
          <VariantManager selectedSegments={selectedSegments}/>
        </TabsContent>
        <TabsContent value="feedback" className="mt-6">
          <FeedbackLoop />
        </TabsContent>
      </Tabs>
    </div>
  );
}