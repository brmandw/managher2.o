'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateProjectData } from '@/lib/project-storage';
import { useToast } from '@/hooks/use-toast';



export function PackagingForm({ initialData }) {
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isAdaptive, setIsAdaptive] = useState(initialData?.isAdaptive || false);
  const [isTested, setIsTested] = useState(initialData?.isTested || false);
  const { toast } = useToast();

  const isLogisticsReady = isAdaptive && isTested;
  
  const handleSave = () => {
    // MOCK MODE: Save to localStorage
    const packagingData = { notes, isAdaptive, isTested, isLogisticsReady };
    updateProjectData(currentData => ({
        ...currentData,
        innovation: { 
            ...currentData.innovation,
            packaging: packagingData 
        }
    }));
    toast({
        title: 'Detail Packaging Disimpan',
        description: 'Detail desain packaging-mu telah disimpan.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perkembangan Kemasan</CardTitle>
        <CardDescription>Desain kemasan yang aman untuk logistik dan menarik minat pelanggan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="packaging-notes">Catatan Desain Kemasan</Label>
          <Textarea
            id="packaging-notes"
            placeholder="contoh: material tahan benturan, aman untuk pengiriman cepat, dikemas dengan vacuum seal dan bubble wrap khusus kue kering"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="adaptive-packaging" checked={isAdaptive} onCheckedChange={setIsAdaptive} />
          <Label htmlFor="adaptive-packaging">Apakah desain packaging ini dapat disesuaikan dengan berbagai ukuran produk?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="long-distance-tested" checked={isTested} onCheckedChange={(checked) => setIsTested(checked === true)} />
          <Label htmlFor="long-distance-tested">Apakah desain packaging ini telah diuji untuk pengiriman jarak jauh?</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {isLogisticsReady && (
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            Logistics-Ready Packaging
          </Badge>
        )}
        <Button onClick={handleSave} className="ml-auto">Simpan Detail Packaging</Button>
      </CardFooter>
    </Card>
  );
}
