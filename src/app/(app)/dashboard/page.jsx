import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container py-10 mt-16 mx-16">
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
            <Link href="/projects/new">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Business Project
              </Button>
            </Link>
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
              <Link href="/projects/new" className="mt-4 w-full">
                <Button variant="outline" className="w-full">Create</Button>
              </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
