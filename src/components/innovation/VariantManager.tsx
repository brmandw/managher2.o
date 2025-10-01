'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Variant = {
  id: string;
  name: string;
  type: 'flavor' | 'size' | 'personalization';
  isActive: boolean;
};

interface VariantManagerProps {
    selectedSegments: string[];
}

export function VariantManager({ selectedSegments }: VariantManagerProps) {
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Matcha Latte', type: 'flavor', isActive: true },
    { id: '2', name: 'Travel Size', type: 'size', isActive: false },
  ]);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  const handleSaveVariant = (variantData: Omit<Variant, 'id'>) => {
    if (editingVariant) {
      setVariants(variants.map((v) => (v.id === editingVariant.id ? { ...editingVariant, ...variantData } : v)));
    } else {
      setVariants([...variants, { id: Date.now().toString(), ...variantData }]);
    }
    setEditingVariant(null);
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };
  
  const personalizationRecommended = selectedSegments.some(s => ['remaja', 'keluarga', 'pasangan'].includes(s.toLowerCase()));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Product/Feature Variations</CardTitle>
            <CardDescription>Manage different versions of your products or services.</CardDescription>
        </div>
        <Dialog onOpenChange={(open) => !open && setEditingVariant(null)}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Variant
            </Button>
          </DialogTrigger>
          <VariantModalDialog title="Add New Variant" onSave={handleSaveVariant} />
        </Dialog>
      </CardHeader>
      <CardContent>
        {variants.length > 0 ? (
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">{variant.name} <Badge variant="outline">{variant.type}</Badge></div>
                  <p className={`text-sm ${variant.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {variant.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog onOpenChange={(open) => !open && setEditingVariant(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingVariant(variant)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                     {editingVariant && editingVariant.id === variant.id && (
                        <VariantModalDialog 
                            title="Edit Variant" 
                            variant={editingVariant}
                            onSave={handleSaveVariant} 
                        />
                     )}
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteVariant(variant.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No product variants created yet.</p>
            <p className="text-sm text-muted-foreground">Click "Add New Variant" to get started.</p>
          </div>
        )}
         {personalizationRecommended && (
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="mt-4 text-sm text-muted-foreground text-center p-2 bg-muted rounded-lg">
                            💡 Tip: Based on your selected segments, consider adding a personalization variant (e.g., custom names on packaging)!
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Segments like 'remaja' or 'keluarga' often respond well to personalization.</p>
                    </TooltipContent>
                </Tooltip>
             </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}

function VariantModalDialog({ title, variant, onSave }: { title: string, variant?: Variant, onSave: (data: Omit<Variant, 'id'>) => void }) {
  const [name, setName] = useState(variant?.name || '');
  const [type, setType] = useState<Variant['type'] | ''>(variant?.type || '');
  const [isActive, setIsActive] = useState(variant?.isActive || true);

  const handleInternalSave = () => {
    if (name && type) {
      onSave({ name, type, isActive });
    }
  };

  return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variant-name" className="text-right">Name</Label>
            <Input id="variant-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Matcha Latte, Travel Size" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variant-type" className="text-right">Type</Label>
            <Select onValueChange={(value: Variant['type']) => setType(value)} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a variant type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flavor">Flavor</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="personalization">Personalization</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variant-active" className="text-right">Activate</Label>
             <div className="col-span-3">
                 <Switch id="variant-active" checked={isActive} onCheckedChange={(checked: boolean) => setIsActive(checked)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleInternalSave}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
  )
}