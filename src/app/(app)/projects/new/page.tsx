import { NewProjectForm } from '@/components/projects/NewProjectForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProjectPage() {
  return (
    <div className="container max-w-3xl min-h-screen py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Projek Bisnis</CardTitle>
          <CardDescription>
            Masukkan informasi mengenai bisnismu, untuk mendapat saran dari AI!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}
