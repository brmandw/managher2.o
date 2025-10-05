"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadProjectData } from "@/lib/project-storage";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Loader,
  Package,
  Telescope,
  Wallet,
  TrendingUp,
  Crown,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useProjectDataStore } from "@/lib/useProjectData";

const ModuleStatus = ({ title, status, href, icon }) => {
  const isComplete = status === "complete";
  return (
    <Link href={href}>
      <Card className="hover:border-primary transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {isComplete ? "Completed" : "Ready to start"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function ProjectOverviewPage() {
  const { projectData, setProjectData } = useProjectDataStore();
  const params = useParams();

  useEffect(() => {
    const data = loadProjectData();
    if (data && data.id === params.id) {
      setProjectData(data);
    }
  }, [params.id]);

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

const { business = {}, marketability = {}, innovation = {}, financials = {} } = projectData || {};

  const getStatus = (module) => {
    if (!module) return "pending";
    // A simple check if there's any key indicating completion
    if (
      module.nicheSuggestion ||
      (module.variants && module.variants.length > 0) ||
      module.projection
    ) {
      return "complete";
    }
    return "pending";
  };

  return (
  <div className="space-y-3">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 blur-3xl -z-10"></div>
        <div className="pb-3">
          <h2 className="text-2xl font-bold tracking-tight">Project Overview</h2>
          <p className="text-lg text-muted-foreground">
            Ringkasan proyek bisnismu
          </p>
        </div>
      </div>

      {/* Business Info & Investment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Business Info Card - Takes 3 columns */}
        <div className="md:col-span-3">
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 group">
            <div className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-lg"></div>
            <CardHeader>
              <CardTitle className="text-xl font-bold">{business.name}</CardTitle>
              <CardDescription className="mt-2">
                <Badge variant="secondary" className="text-sm px-3">{business.type}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Products / Services
                </h4>
                <p className="text-muted-foreground text-base leading-relaxed pl-3.5">
                  {business.products}
                </p>
              </div>
              {business.description && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Description
                  </h4>
                  <p className="text-muted-foreground text-base leading-relaxed pl-3.5">
                    {business.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Investment Readiness Card - Takes 3 columns */}
        <div className="md:col-span-3">
          <Card className="h-full bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/40 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                Investment Readiness
              </CardTitle>
              <CardDescription className="text-sm mt-2">
                Kembangkan kebutuhan investasi dan evaluasi kesehatan keuangan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Persentase Kembangkan Kebutuhan Investasi</span>
                  <span className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">30%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 shadow-md relative overflow-hidden"
                    style={{ width: "30%" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-4 border-t leading-relaxed">
                Kembangkan kebutuhan investasi dan evaluasi kesehatan keuangan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mt-8">
          <h3 className="text-2xl font-bold">Progressmu</h3>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/30 to-transparent"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ModuleStatus
            title="Marketability"
            status={getStatus(marketability)}
            href={`/projects/${params.id}/marketability`}
            icon={<Telescope className="h-6 w-6 text-primary" />}
          />
          <ModuleStatus
            title="Innovation"
            status={getStatus(innovation)}
            href={`/projects/${params.id}/innovation`}
            icon={<Package className="h-6 w-6 text-primary" />}
          />
          <ModuleStatus
            title="Financials"
            status={getStatus(financials)}
            href={`/projects/${params.id}/financials`}
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
        </div>
      </div>

      {/* Premium Section */}
      <div className="py-8 space-y-6 bg-background">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Advanced Strategy */}
          <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-purple-500/5 hover:border-primary/50 transition-all duration-500 cursor-not-allowed shadow-lg hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-sm px-3 py-1.5 shadow-lg">
                <Crown className="h-4 w-4 mr-1.5" />
                Premium
              </Badge>
            </div>
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <Lock className="h-5 w-5 text-muted-foreground ml-auto" />
              </div>
              <CardTitle className="text-2xl font-bold">Advanced Strategy</CardTitle>
              <CardDescription className="text-base mt-2 leading-relaxed">
                Dapatkan premium fitur untuk analisis kompetitif, strategi pertumbuhan, optimisasi presentasi investor, dan evaluasi risiko.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-base text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Analisis kompetitif menggunakan AI</span>
                </div>
                <div className="flex items-center gap-3 text-base text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Jelajahi rute penetrasi pasar menggunakan AI</span>
                </div>
                <div className="flex items-center gap-3 text-base text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Strategi pertumbuhan menggunakan AI</span>
                </div>
                <div className="flex items-center gap-3 text-base text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Optimize investor pitch menggunakan AI</span>
                </div>
                <div className="flex items-center gap-3 text-base text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Evaluasi risiko dan mitigasi menggunakan AI</span>
                </div>
              </div>

              <div className="pt-3">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base font-semibold py-6"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Dapatkan Premium
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center pt-2">
                Jadikan bisnismu next level
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Back Button */}
      <div className="text-center pt-6">
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="px-8 text-base hover:border-primary hover:text-primary transition-all duration-300 hover:scale-105">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
