'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { suggestMarketSegments } from '@/ai/flows/suggest-target-segments';
import { recommendTargetSegments } from '@/ai/flows/recommend-target-segments';
import { suggestNicheAndPositioning } from '@/ai/flows/suggest-niche-and-positioning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, Target, PenLine, ChevronRight, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

type ProjectData = {
  businessName: string;
  businessType: string;
  productsSold: string;
};

interface MarketabilityWizardProps {
  projectData: ProjectData;
}

const steps = [
  { id: 1, title: 'Segmentation', icon: Lightbulb },
  { id: 2, title: 'Targeting', icon: Target },
  { id: 3, title: 'Positioning', icon: PenLine },
];

export function MarketabilityWizard({ projectData }: MarketabilityWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [marketSegments, setMarketSegments] = useState<string[]>([]);
  const [recommendedSegments, setRecommendedSegments] = useState<{ segment: string; reason: string }[]>([]);
  const [nicheAndPositioning, setNicheAndPositioning] = useState<{ nicheSuggestion: string; positioningStatement: string } | null>(null);
  const { toast } = useToast();

  const handleSuggestSegments = async () => {
    setLoading(true);
    try {
      const result = await suggestMarketSegments({
        businessType: projectData.businessType,
        products: projectData.productsSold,
      });
      setMarketSegments(result.marketSegments);
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to suggest market segments.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendTargets = async () => {
    setLoading(true);
    try {
      const result = await recommendTargetSegments({
        businessType: projectData.businessType,
        productsSold: projectData.productsSold,
        marketSegments,
      });
      setRecommendedSegments(result.recommendedSegments);
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to recommend target segments.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestPositioning = async () => {
    setLoading(true);
    try {
      const result = await suggestNicheAndPositioning({
        businessName: projectData.businessName,
        businessType: projectData.businessType,
        productsSold: projectData.productsSold,
        selectedMarketSegments: recommendedSegments.map(s => s.segment),
      });
      setNicheAndPositioning(result);
      setCurrentStep(4);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to suggest positioning.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveStrategy = () => {
    toast({
        title: 'Strategy Saved!',
        description: 'Your marketability strategy has been successfully saved.',
        className: 'bg-primary text-primary-foreground',
    });
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Market Segmentation</CardTitle>
              <CardDescription>Let&apos;s identify potential market segments for your business.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Based on your business details, our AI will suggest relevant market segments.</p>
                <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold">{projectData.businessName}</h4>
                    <h5 className="text-sm"><Badge variant="secondary">{projectData.businessType}</Badge></h5>
                    <p className="text-sm text-muted-foreground mt-2">{projectData.productsSold}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSuggestSegments} disabled={loading} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/80">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Suggest Segments
              </Button>
            </CardFooter>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Targeting</CardTitle>
              <CardDescription>From the generated segments, let&apos;s find the best ones to target.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 <p className="font-semibold">Suggested Market Segments:</p>
                <div className="flex flex-wrap gap-2">
                    {marketSegments.map((segment, index) => (
                        <Badge key={index} variant="outline" className="text-lg py-1 px-3">{segment}</Badge>
                    ))}
                </div>
                <p className="pt-4">Now, the AI will analyze these segments based on purchasing power, market size, and accessibility to recommend the top 2.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRecommendTargets} disabled={loading} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/80">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                Recommend Target Segments
              </Button>
            </CardFooter>
          </Card>
        );
      case 3:
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Step 3: Positioning</CardTitle>
                    <CardDescription>Define your unique niche and how you want to be perceived by your target market.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Recommended Target Segments:</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {recommendedSegments.map((rec, index) => (
                                <Card key={index} className="bg-muted/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Target size={20}/> {rec.segment}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                     <p>With these targets in mind, let's generate a niche suggestion and a powerful positioning statement.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSuggestPositioning} disabled={loading} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/80">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenLine className="mr-2 h-4 w-4" />}
                        Suggest Niche & Positioning
                    </Button>
                </CardFooter>
            </Card>
        );
      case 4:
          return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PartyPopper className="text-accent" /> Your Marketability Strategy is Ready!</CardTitle>
                    <CardDescription>Here is the AI-generated strategy. You can edit it to better fit your vision.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Niche Suggestion</h3>
                        <Textarea defaultValue={nicheAndPositioning?.nicheSuggestion} rows={3} className="text-base" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Positioning Statement</h3>
                        <Textarea defaultValue={nicheAndPositioning?.positioningStatement} rows={5} className="text-base" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveStrategy} size="lg" className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                        Save Strategy
                    </Button>
                </CardFooter>
            </Card>
          );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
        <div className="flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
                {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border'}`}>
                        <step.icon className="h-5 w-5" />
                    </div>
                    <p className={`ml-2 font-medium hidden sm:block ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</p>
                    {index < steps.length - 1 && <ChevronRight className="w-8 h-8 text-muted-foreground mx-2 hidden sm:block" />}
                </div>
                ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            >
            {renderStepContent()}
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
