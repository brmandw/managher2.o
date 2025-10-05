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
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyarankan segmentasi pasar.' });
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
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal merekomendasikan segmentasi pasar target.' });
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
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyarankan posisi pasar.' });
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
      title: 'Stratégi Pasar Disimpan!',
      description: 'Strategi pasarmu telah disimpan dengan sukses.',
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
              <CardTitle>Step 1: Segmentasi Pasar</CardTitle>
              <CardDescription>Identifikasi segmentasi pasar potensial untuk bisnismu.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Berdasarkan data bisnismu, AI akan menyarankan segmentasi pasar potensial.</p>
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
                Saran Segmentasi Pasar
              </Button>
            </CardFooter>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Rekomendasi Target Segmentasi Pasar</CardTitle>
              <CardDescription>Dari segmentasi pasar yang dihasilkan, AI akan merekomendasikan dua segmentasi pasar target terbaik.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="font-semibold">Rekomendasi Segmentasi Pasar Target:</p>
                <div className="flex flex-wrap gap-2">
                  {marketSegments.map((segment, index) => (
                    <Badge key={index} variant="outline" className="text-lg py-1 px-3">{segment}</Badge>
                  ))}
                </div>
                <p className="pt-4">Sekarang, AI akan menganalisis kedua segmentasi pasar ini berdasarkan daya beli, ukuran pasar, dan aksesibilitas untuk merekomendasikan dua segmentasi pasar target terbaik.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRecommendTargets} disabled={loading} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/80">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                Rekomendasikan Segmentasi Pasar Target
              </Button>
            </CardFooter>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Rekomendasi Niche dan Posisi Pasar</CardTitle>
              <CardDescription>Definisikan niche unik bisnismu dan bagaimana kamu ingin dikenali oleh pasar targetmu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Rekomendasi Segmentasi Pasar Target:</h3>
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
              <p className="pt-4">Dengan mempertimbangkan kedua segmentasi pasar target ini, mari kita buat saran niche dan pernyataan posisi yang kuat.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSuggestPositioning} disabled={loading} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/80">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenLine className="mr-2 h-4 w-4" />}
                Rekomendasikan Niche &amp; Posisi Pasar
              </Button>
            </CardFooter>
          </Card>
        );
      case 4:
        return (
          <div className={`grid gap-6 ${showTips ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PartyPopper className="text-accent" /> Strategi Marketabilitymu Siap!</CardTitle>
                <CardDescription>Berikut adalah strategi marketability yang dihasilkan oleh AI. Kamu bisa mengeditnya untuk lebih sesuai dengan visi bisnismu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Rekomendasi Niche</h3>
                  <Textarea id="niche-suggestion" defaultValue={nicheAndPositioning?.nicheSuggestion} rows={3} className="text-base" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rekomendasi Posisi Pasar</h3>
                  <Textarea id="positioning-statement" defaultValue={nicheAndPositioning?.positioningStatement} rows={5} className="text-base" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveStrategy} size="lg" className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Simpan dan Lanjutkan
                </Button>
              </CardFooter>
            </Card>

            {showTips && (
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-accent" size={24} />
                  Langkah Selanjutnya & Tips
                </CardTitle>
                <CardDescription>Cara memanfaatkan ceruk pasar dan posisi pasarmu secara efektif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">1</span>
                    Validasi posisi pasarmu
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Uji pernyataan posisi pasarmu kepada segmen target melalui survei atau diskusi kelompok untuk memastikan pesanmu benar-benar tersampaikan.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">2</span>
                    Selaraskan Pesan
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Pastikan semua materi pemasaran, konten situs web, dan komunikasi apa pun selalu konsisten dengan posisi pasarmu.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">3</span>
                    Bedakan Secara Strategis
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Tentukan 2–3 proposisi nilai unik yang benar-benar membedakanmu dari para kompetitor di ceruk pasarmu.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm">4</span>
                    Bangun Konsistensi Brand
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Buat panduan brand yang mencerminkan posisi pasarmu untuk menjaga konsistensi di semua titik interaksi.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t">
                  <p className="text-sm font-medium mb-2">🚀 Siap Berinovasi?</p>
                  <p className="text-sm text-muted-foreground">
                    Dengan strategi pemasaran yang sudah matang, kini saatnya fokus mengembangkan solusi inovatif yang benar-benar relevan dengan kebutuhan segmen targetmu.
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
