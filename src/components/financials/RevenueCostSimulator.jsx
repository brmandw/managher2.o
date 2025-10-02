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
            toast({ variant: 'destructive', title: 'Invalid Input', description: 'Price must be greater than cost.' });
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
      
          toast({ title: 'Simulation Complete!', description: 'Your financial projection has been updated.' });
        } catch (error) {
          console.error('Simulation error:', error);
          toast({
            variant: 'destructive',
            title: 'Simulation Failed',
            description: 'An unexpected error occurred. Please try again.'
          });
        } finally {
          setLoading(false);
        }
      };


    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue & Cost Simulator</CardTitle>
                    <CardDescription>Enter your product details to get a simple monthly financial projection.</CardDescription>
                </CardHeader>
                <form ref={formRef} onSubmit={handleSimulation}>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Average Price per Unit (Rp)</Label>
                            <Input id="price" name="price" type="number" placeholder="e.g., 25000" required defaultValue={initialData?.price || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cost">Average Cost per Unit (Rp)</Label>
                            <Input id="cost" name="cost" type="number" placeholder="e.g., 10000" required defaultValue={initialData?.cost || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frequency">Daily Sales Estimate</Label>
                            <Input id="frequency" name="frequency" type="number" placeholder="e.g., 50 units" required defaultValue={initialData?.frequency || ''} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="ml-auto mt-5">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart className="mr-2 h-4 w-4" />}
                            Simulate Projection
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {projection && (
                 <Card className="bg-background/50">
                    <CardHeader>
                        <CardTitle>Monthly Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Projected Revenue</p>
                            <p className="text-2xl font-bold">Rp {projection.revenue.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Profit Margin</p>
                            <p className="text-2xl font-bold">{projection.margin.toFixed(1)}%</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Break-Even Point</p>
                            <p className="text-2xl font-bold">{projection.breakEvenPoint} units</p>
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}
