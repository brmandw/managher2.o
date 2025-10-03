'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { suggestMarketSegments } from '@/ai/flows/suggest-market-segments';
import { recommendTargetSegments } from '@/ai/flows/recommend-target-segments';
import { suggestNicheAndPositioning } from '@/ai/flows/suggest-niche-and-positioning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, Target, PenLine, ChevronRight, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import { updateProjectData } from '@/lib/project-storage';

const steps = [
  { id: 1, title: 'Segmentation', icon: Lightbulb },
  { id: 2, title: 'Targeting', icon: Target },
  { id: 3, title: 'Positioning', icon: PenLine },
];

export function MarketabilityWizard({ projectData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [marketSegments, setMarketSegments] = useState(projectData.marketability?.marketSegments || []);
  const [recommendedSegments, setRecommendedSegments] = useState(projectData.marketability?.recommendedSegments || []);
  const [nicheAndPositioning, setNicheAndPositioning] = useState(
    projectData.marketability?.nicheSuggestion ? {
      nicheSuggestion: projectData.marketability.nicheSuggestion,
      positioningStatement: projectData.marketability.positioningStatement || '',
    } : null
  );
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Determine initial step based on loaded project data
    if (nicheAndPositioning) {
      setCurrentStep(4);
    } else if (recommendedSegments.length > 0) {
      setCurrentStep(3);
    } else if (marketSegments.length > 0) {
      setCurrentStep(2);
    }
  }, []);


  const handleSuggestSegments = async () => {
    setLoading(true);
    try {
      const result = await suggestMarketSegments({
        businessType: projectData.business.type,
        products: projectData.business.products,
      });
      setMarketSegments(result.marketSegments);
      // MOCK MODE: Save to localStorage
      updateProjectData(currentData => ({ ...currentData, marketability: { marketSegments: result.marketSegments } }));
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
        businessType: projectData.business.type,
        productsSold: projectData.business.products,
        marketSegments,
      });
      setRecommendedSegments(result.recommendedSegments);
      // MOCK MODE: Save to localStorage
      updateProjectData(currentData => ({
        ...currentData,
        marketability: {
          ...currentData.marketability,
          recommendedSegments: result.recommendedSegments,
        }
      }));
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
        businessName: projectData.business.name,
        businessType: projectData.business.type,
        productsSold: projectData.business.products,
        selectedMarketSegments: recommendedSegments.map(s => s.segment),
      });
      setNicheAndPositioning(result);
      // MOCK MODE: Save to localStorage
      updateProjectData(currentData => ({
        ...currentData,
        marketability: {
          ...currentData.marketability,
          nicheSuggestion: result.nicheSuggestion,
          positioningStatement: result.positioningStatement,
        }
      }));
      setCurrentStep(4);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to suggest positioning.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStrategy = () => {
    // MOCK MODE: Data is already saved on each step, just need to update textareas if changed
    const nicheTextarea = document.getElementById('niche-suggestion');
    const positioningTextarea = document.getElementById('positioning-statement');
    
    updateProjectData(currentData => ({
      ...currentData,
        marketability: {
            ...currentData.marketability,
            nicheSuggestion: nicheTextarea.value,
            positioningStatement: positioningTextarea.value,
        }
    }));

    toast({
      title: 'Strategy Saved!',
      description: 'Your marketability strategy has been successfully saved.',
      className: 'bg-primary text-primary-foreground',
    });
    // router.push(`/projects/${projectData.id}/innovation`);
    
    // Tampilkan card tips
    setShowTips(true);
};


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
                <div className="p-4 border rounded-lg bg-background/50">
                  <h4 className="font-semibold">{projectData.business.name}</h4>
                  <h5 className="text-sm"><Badge variant="secondary">{projectData.business.type}</Badge></h5>
                  <p className="text-sm text-muted-foreground mt-2">{projectData.business.products}</p>
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
                    <Card key={index} className="bg-background/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target size={20} /> {rec.segment}</CardTitle>
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
                Suggest Niche &amp; Positioning
              </Button>
            </CardFooter>
          </Card>
        );
      case 4:
        return (
          <div className={`grid gap-6 ${showTips ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PartyPopper className="text-accent" /> Your Marketability Strategy is Ready!</CardTitle>
                <CardDescription>Here is the AI-generated strategy. You can edit it to better fit your vision.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Niche Suggestion</h3>
                  <Textarea id="niche-suggestion" defaultValue={nicheAndPositioning?.nicheSuggestion} rows={3} className="text-base" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Positioning Statement</h3>
                  <Textarea id="positioning-statement" defaultValue={nicheAndPositioning?.positioningStatement} rows={5} className="text-base" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveStrategy} size="lg" className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Save and Continue to Innovation
                </Button>
              </CardFooter>
            </Card>

            {showTips && (
              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-accent" size={24} />
                    Next Steps & Tips
                  </CardTitle>
                  <CardDescription>How to leverage your niche and positioning effectively</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">1</span>
                      Validate Your Positioning
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8">
                      Test your positioning statement with your target segments through surveys or focus groups to ensure it resonates.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">2</span>
                      Align Your Messaging
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8">
                      Ensure all marketing materials, website content, and communications reflect your positioning statement consistently.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">3</span>
                      Differentiate Strategically
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8">
                      Identify 2-3 unique value propositions that set you apart from competitors in your niche.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">4</span>
                      Build Brand Consistency
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8">
                      Create brand guidelines that reflect your positioning to maintain consistency across all touchpoints.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t">
                    <p className="text-sm font-medium mb-2">🚀 Ready for Innovation?</p>
                    <p className="text-sm text-muted-foreground">
                      With your marketability strategy in place, you can now focus on developing innovative solutions that align with your target segments' needs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
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
