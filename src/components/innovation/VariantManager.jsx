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
import { updateProjectData } from '@/lib/project-storage';
import { useToast } from '@/hooks/use-toast';





export function VariantManager({ selectedSegments, initialVariants }) {
  const [variants, setVariants] = useState(initialVariants);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const saveVariantsToStorage = (updatedVariants) => {
    // MOCK MODE: Save to localStorage
    updateProjectData(currentData => ({ 
        ...currentData,
        innovation: { 
            ...currentData.innovation,
            variants: updatedVariants 
        }
    }));
    toast({
      title: 'Variants Updated',
      description: 'Your product variants have been saved.',
    });
  }

  const handleSaveVariant = (variantData) => {
    let updatedVariants;
    if (editingVariant) {
      updatedVariants = variants.map((v) => (v.id === editingVariant.id ? { ...v, ...variantData } : v));
    } else {
      updatedVariants = [...variants, { id: `var_${Date.now()}`, ...variantData }];
    }
    setVariants(updatedVariants);
    saveVariantsToStorage(updatedVariants);
    setEditingVariant(null);
    setIsModalOpen(false);
  };

  const handleDeleteVariant = (id) => {
    const updatedVariants = variants.filter((v) => v.id !== id);
    setVariants(updatedVariants);
    saveVariantsToStorage(updatedVariants);
  };

  const openNewVariantModal = () => {
    setEditingVariant(null);
    setIsModalOpen(true);
  }

  const openEditVariantModal = (variant) => {
    setEditingVariant(variant);
    setIsModalOpen(true);
  }
  
  const personalizationRecommended = selectedSegments.some(s => ['remaja', 'keluarga', 'pasangan'].includes(s.toLowerCase()));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Product/Feature Variations</CardTitle>
            <CardDescription>Manage different versions of your products or services.</CardDescription>
        </div>
        <Button onClick={openNewVariantModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Variant
        </Button>
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
                    <Button variant="ghost" size="icon" onClick={() => openEditVariantModal(variant)}>
                        <Edit className="h-4 w-4" />
                    </Button>
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
                        <div className="mt-4 text-sm text-muted-foreground text-center p-2 bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 rounded-lg">
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <VariantModalDialog 
            key={editingVariant?.id || 'new'}
            title={editingVariant ? "Edit Variant" : "Add New Variant"}
            variant={editingVariant}
            onSave={handleSaveVariant}
            onClose={() => setIsModalOpen(false)}
        />
      </Dialog>
    </Card>
  );
}

function VariantModalDialog({ title, variant, onSave, onClose }) {
  const [name, setName] = useState(variant?.name || '');
  const [type, setType] = useState(variant?.type || '');
  const [isActive, setIsActive] = useState(variant?.isActive !== undefined ? variant.isActive : true);

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
            <Select onValueChange={(value) => setType(value)} value={type}>
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
                 <Switch id="variant-active" checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInternalSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
  )
}
