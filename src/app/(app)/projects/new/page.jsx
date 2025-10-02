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
    <div className="container max-w-3xl py-10 mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Business Project</CardTitle>
          <CardDescription>
            Tell us about your business. This information will help our AI tailor its suggestions for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewProjectForm
            onProjectCreated={(projectId) => {
              console.log('Project created with ID:', projectId);
              // Misal: redirect ke halaman berikutnya
              router.push(`/projects/${projectId}/overview`);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
