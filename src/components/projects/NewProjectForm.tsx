'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  businessName: z.string().min(2, 'Jangan lupa isi nama bisnismu..'),
  businessType: z.enum(['F&B', 'Fashion', 'Services', 'Tech', 'Other']),
  productsSold: z.string().min(10, 'Jelaskan deskripsi produkmu minimal 10 karakter huruf ya..'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewProjectForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      productsSold: '',
      description: '',
    },
  });

  function onSubmit(values: FormValues) {
    const query = new URLSearchParams({
        name: values.businessName,
        type: values.businessType,
        products: values.productsSold,
    }).toString();

    // In a real app, you'd save this to a DB and get a project ID
    const projectId = 'new-project-123'; 
    router.push(`/projects/${projectId}/marketability?${query}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Bisnis</FormLabel>
              <FormControl>
                <Input placeholder="contoh: Managher" className="hover:border-[#493D9E] focus:ring-[#493D9E]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Bisnis</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="F&B">F&B (Food & Beverage)</SelectItem>
                  <SelectItem value="Fashion">Fashion (Busana)</SelectItem>
                  <SelectItem value="Services">Services (Jasa)</SelectItem>
                  <SelectItem value="Tech"> Tech (Teknologi)</SelectItem>
                  <SelectItem value="Other">Lain - lain</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productsSold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produk atau Jasa yang Dijual</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan apa yang kamu jual, contoh, 'Kue kustom, Roti-rotian'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Singkat (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Rangkuman singkat mengenai bisnismu.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full bg-[#493D9E] hover:bg-[#493D9E]/90 text-accent-foreground">
          Simpan Proyek dan Mulai Analisis
        </Button>
      </form>
    </Form>
  );
}
