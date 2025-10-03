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
  const [projectData, setProjectData] = useState(null);
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

  const { business, marketability, innovation, financials } = projectData;

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
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Project Overview</h2>
        <p className="text-muted-foreground">
          Ringkasan proyek bisnis-mu
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Business Info Card - Takes 2 columns */}
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{business.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary">{business.type}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  Products / Services
                </h4>
                <p className="text-muted-foreground text-sm">
                  {business.products}
                </p>
              </div>
              {business.description && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Description</h4>
                  <p className="text-muted-foreground text-sm">
                    {business.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Investment Readiness Card - Takes 1 column */}
        <div className="md:col-span-3">
          <Card className="h-full bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                Investment Readiness
              </CardTitle>
              <CardDescription className="text-xs">
                Kembangkan kebutuhan investasi dan evaluasi kesehatan keuangan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium">Persentase Kembangkan Kebutuhan Investasi</span>
                  <span className="text-2xl font-bold text-primary">30%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
              {/* 
                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="text-muted-foreground">Business fundamentals defined</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                    <span className="text-muted-foreground">Strategy in progress</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    <span className="text-muted-foreground">Financials pending</span>
                                </div>
                            </div> */}

              <p className="text-xs text-muted-foreground pt-2 border-t leading-relaxed">
                Kembangkan kebutuhan investasi dan evaluasi kesehatan keuangan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Progress-mu</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModuleStatus
            title="Marketability"
            status={getStatus(marketability)}
            href={`/projects/${params.id}/marketability`}
            icon={<Telescope className="h-5 w-5 text-primary" />}
          />
          <ModuleStatus
            title="Innovation"
            status={getStatus(innovation)}
            href={`/projects/${params.id}/innovation`}
            icon={<Package className="h-5 w-5 text-primary" />}
          />
          <ModuleStatus
            title="Financials"
            status={getStatus(financials)}
            href={`/projects/${params.id}/financials`}
            icon={<Wallet className="h-5 w-5 text-primary" />}
          />
        </div>
      </div>
      <div className="p-8 space-y-6 bg-background">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Advanced Strategy */}
          <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-purple-500/5 hover:border-primary/50 transition-all cursor-not-allowed">
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              </div>
              <CardTitle className="text-lg">Advanced Strategy</CardTitle>
              <CardDescription className="text-sm">
                Dapatkan premium fitur untuk analisis kompetitif, strategi pertumbuhan, optimisasi presentasi investor, dan evaluasi risiko.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Analisis kompetitif menggunakan AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Jelajahi rute penetrasi pasar menggunakan AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Strategi pertumbuhan menggunakan AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Optimize investor pitch menggunakan AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Evaluasi risiko dan mitigasi menggunakan AI</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Dapatkan Premium
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-1">
                Jadikan bisnismu next level
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/dashboard">
          <Button variant="outline">Kembali ke Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
