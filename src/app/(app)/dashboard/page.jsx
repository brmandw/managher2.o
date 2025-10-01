'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { NewProjectForm } from '@/components/projects/NewProjectForm';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const router = useRouter();

  const handleProjectCreated = (projectId) => {
    setIsNewProjectDialogOpen(false);
    router.push(`/projects/${projectId}/overview`);
  };

  return (
    <>
      <div className="container py-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, User!</h1>
          <p className="text-muted-foreground">Ready to shape your next big idea? Let&apos;s get started.</p>
        </div>

        <div className="my-10 text-center">
          <Card className="max-w-3xl mx-auto bg-card/50">
            <CardHeader>
              <CardTitle className="text-2xl">Start a New Business Project</CardTitle>
              <CardDescription>Turn your vision into a concrete plan with our AI-powered tools.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Add New Business Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <NewProjectForm onProjectCreated={handleProjectCreated} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* This is a placeholder for existing projects. */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Eco-Friendly Cafe</CardTitle>
                <CardDescription>F&B</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">A sustainable coffee shop focusing on organic, locally-sourced products.</p>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button className="w-full">View Project</Button>
              </div>
            </Card>
             <Card className="border-2 border-dashed flex flex-col items-center justify-center text-center p-6 hover:border-primary transition-colors">
                <PlusCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-semibold">Add New Project</h3>
                <p className="text-sm text-muted-foreground">Start your next venture.</p>
                <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <NewProjectForm onProjectCreated={handleProjectCreated} />
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Let's build your new project</DialogTitle>
            <DialogDescription>
              Answer a few questions to get started. It's like talking to a business consultant.
            </DialogDescription>
          </DialogHeader>
          <NewProjectForm onProjectCreated={handleProjectCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
}
