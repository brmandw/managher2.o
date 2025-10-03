'use client'
import Link from 'next/link';
import { Loader, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectDataStore } from '../../../lib/useProjectData';
import { useEffect, useState } from 'react';
import { loadProjectData } from '../../../lib/project-storage';

export default function DashboardPage() {
  const { projectData, setProjectData } = useProjectDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Muat data dari localStorage saat halaman dibuka
    const data = loadProjectData();
    if (data) {
      setProjectData(data);
    }
    setLoading(false);
  }, []);
  
  // Jika sedang loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Destructure dengan aman
  const { business = {} } = projectData;
  console.log(business)

  return (
<div className="container py-10">
      {/* Hero Section dengan layout yang lebih menarik */}
      <div className="relative mb-8 mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 blur-3xl -z-10"></div>
        <div className="text-center space-y-6 py-8">
          <div className="inline-block">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Selamat Datang, Rina! 👋
            </h1>
            <div className="h-1 w-32 bg-accent mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Siap mewujudkan ide besarmu berikutnya? Ayo kita mulai!
          </p>
        </div>
      </div>

      {/* CTA Card */}
      <div className={`${projectData?.id ? 'hidden' : 'mb-20'}`}>
        <Card className="max-w-4xl mx-auto border-accent text-accent-foreground shadow-2xl hover:shadow-accent/20 transition-all duration-500 border-0 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="text-center pb-6 pt-8 relative">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-foreground/10 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <PlusCircle className="h-10 w-10 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-1">
              Mulai Proyek Bisnis Baru
            </CardTitle>
            <CardDescription className="text-base text-accent-foreground/80 max-w-2xl mx-auto">
              Ubah visi kamu menjadi rencana nyata dengan bantuan AI. Mari wujudkan impian bisnis kamu hari ini!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8 relative">
            <Link href="/projects/new">
              <Button 
                size="lg" 
                className="bg-accent-foreground text-white hover:bg-accent-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 px-8 py-6 text-lg font-semibold"
              >
                <PlusCircle className="mr-3 h-6 w-6" />
                Tambahkan Proyek Bisnis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className={`${!projectData?.id ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Proyek - proyekmu</h2>
            <p className="text-muted-foreground">Kelola dan pantau semua proyek bisnis kamu di satu tempat</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Existing Project Card dengan desain premium */}
          <Card className="flex flex-col shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 hover:border-accent group overflow-hidden">
            {/* Status Bar */}
            <div className="h-2 bg-gradient-to-r from-accent to-accent/50"></div>
            
            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-2xl font-bold line-clamp-1">
                  {business.name || 'Nama Bisnis'}
                </CardTitle>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  Aktif
                </span>
              </div>
              <CardDescription className="text-base font-medium">
                {business.type || 'F&B'}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow pb-6">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {business.description || 'Deskripsi proyek akan muncul di sini'}
              </p>
              
              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold">5</div>
                  <div className="text-xs text-muted-foreground">Tugas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Tim</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">75%</div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Link href={`/projects/${projectData.id}/overview`} className="w-full">
                <Button className="w-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group-hover:bg-accent group-hover:text-accent-foreground">
                  View Project
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Add New Project Card dengan desain menarik */}
          <Card className="border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center p-10 hover:border-accent hover:bg-accent/5 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer min-h-[400px]">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="relative rounded-full bg-muted p-6 mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 group-hover:scale-110">
                <PlusCircle className="h-16 w-16 group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>
            
            <h3 className="font-bold text-2xl mb-3 group-hover:text-accent transition-colors duration-300">
              Tambah Proyek
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xs">
              Waktunya memulai perjalanan baru dan mewujudkan ide cemerlang kamu.
            </p>
            
            <Link href="/projects/new" className="w-full">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 font-semibold group-hover:scale-110"
              >
                Buat Proyek Baru
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
