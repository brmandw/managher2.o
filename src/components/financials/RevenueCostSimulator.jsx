'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { updateProjectData } from "@/lib/project-storage";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart } from "lucide-react";



export function RevenueCostSimulator({ initialData }) {
    const [loading, setLoading] = useState(false);
    const [projection, setProjection] = useState(initialData || null);
    const { toast } = useToast();
    const formRef = useRef(null);

    const handleSimulation = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
      
          const form = formRef.current;
          if (!form) {
            throw new Error('Form not found');
          }
          const formData = new FormData(form);
          const price = Number(formData.get('price'));
          const cost = Number(formData.get('cost'));
          const frequency = Number(formData.get('frequency'));
      
          if (!price || !cost || !frequency || isNaN(price) || isNaN(cost) || isNaN(frequency)) {
            throw new Error('Invalid input values');
          }
      
          if (price <= cost) {
            toast({ variant: 'destructive', title: 'Input Tidak Valid', description: 'Harga harus lebih besar dari biaya.' });
            setLoading(false); // Make sure to stop loading on validation error.
            return;
          }
      
          const margin = ((price - cost) / price) * 100;
          const revenue = price * frequency * 30;
          const breakEvenPoint = Math.ceil(cost / (price - cost));
      
          const newProjection = { revenue, breakEvenPoint, margin };
          setProjection(newProjection);
      
          updateProjectData(currentData => ({
            ...currentData,
            financials: {
              ...currentData.financials,
              projection: newProjection
            }
          }));
      
          toast({ title: 'Simulasi Selesai!', description: 'Proyeksi keuangan Anda telah diperbarui.' });
        } catch (error) {
          console.error('Simulation error:', error);
          toast({
            variant: 'destructive',
            title: 'Simulasi Gagal',
            description: 'Terjadi kesalahan tak terduga. Silakan coba lagi.'
          });
        } finally {
          setLoading(false);
        }
      };


    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Simulator Pendapatan & Biaya</CardTitle>
                    <CardDescription>Masukkan detail produk Anda untuk mendapatkan proyeksi keuangan bulanan sederhana.</CardDescription>
                </CardHeader>
                <form ref={formRef} onSubmit={handleSimulation}>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga Rata-rata per Unit (Rp)</Label>
                            <Input id="price" name="price" type="number" placeholder="contoh: 25000" required defaultValue={initialData?.price || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cost">Biaya Rata-rata per Unit (Rp)</Label>
                            <Input id="cost" name="cost" type="number" placeholder="contoh: 10000" required defaultValue={initialData?.cost || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frequency">Perkiraan Penjualan Harian</Label>
                            <Input id="frequency" name="frequency" type="number" placeholder="contoh: 50 unit" required defaultValue={initialData?.frequency || ''} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="ml-auto mt-5">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart className="mr-2 h-4 w-4" />}
                            Simulasikan Proyeksi
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {projection && (
                 <Card className="bg-background/50">
                    <CardHeader>
                        <CardTitle>Proyeksi Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Pendapatan Proyeksi</p>
                            <p className="text-2xl font-bold">Rp {projection.revenue.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Margin Keuntungan</p>
                            <p className="text-2xl font-bold">{projection.margin.toFixed(1)}%</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Titik Impas</p>
                            <p className="text-2xl font-bold">{projection.breakEvenPoint} unit</p>
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}
