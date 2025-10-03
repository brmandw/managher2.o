'use client';
import { NewProjectForm } from '@/components/projects/NewProjectForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewProjectPage() {
  const router = useRouter();

  useEffect(() => {
    // MOCK MODE: Clear previous project data when starting a new one
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentProject');
    }
  }, []);

  return (
  <div className="flex min-h-screen items-center justify-center">
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Buat Proyek Bisnis</CardTitle>
          <CardDescription>
            Berikan informasi tentang bisnis-mu. Ini akan membantu AI menyesuaikan rekomendasi sesuai kebutuhan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewProjectForm
            onProjectCreated={(projectId) => {
              console.log('Project created with ID:', projectId);
              router.push(`/projects/${projectId}/overview`);
            }}
          />
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
