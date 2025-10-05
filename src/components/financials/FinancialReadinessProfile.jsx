'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, Award, FileDown, Loader2 } from "lucide-react";
import { updateProjectData } from '@/lib/project-storage';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';


export function FinancialReadinessProfile({ projectData }) {
    const [profile, setProfile] = useState(projectData.financials?.readinessProfile || null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const calculateProfile = () => {
        setLoading(true);
        // MOCK MODE: Simulate AI analysis of the whole project data
        let score = 0;
        const recommendations = [];

        // Marketability check
        if (projectData.marketability?.nicheSuggestion && projectData.marketability?.positioningStatement) {
            score += 35;
        } else {
            recommendations.push("Lengkapi analisis Pemasaran untuk strategi yang lebih jelas.");
        }

        // Innovation check
        if (projectData.innovation?.packaging?.isLogisticsReady) {
            score += 15;
        }
        if (projectData.innovation?.variants && projectData.innovation.variants.length > 0) {
            score += 15;
        } else {
            recommendations.push("Tambahkan setidaknya satu varian produk untuk mendiversifikasi penawaranmu.");
        }
        
        // Financials check
        if (projectData.financials?.projection) {
            if (projectData.financials.projection.margin > 20) {
                score += 35;

            } else {
                score += 20;
                recommendations.push("Cobalah meningkatkan margin keuntunganmu di atas 20%.");
            }
        } else {
            recommendations.push("Jalankan simulasi Pendapatan & Biaya.");
        }

        const status = score > 70 ? 'ready' : score > 30 ? 'needs_work' : 'incomplete';
        if (status === 'ready' && recommendations.length === 0) {
            recommendations.push("Profil bisnismu terlihat solid! Pertimbangkan untuk mengeksplorasi opsi pendanaan.");
        }

        const newProfile = { score, status, recommendations };

        setTimeout(() => {
            setProfile(newProfile);
            updateProjectData(currentData => ({
                ...currentData,
                financials: {
                    ...currentData.financials,
                    readinessProfile: newProfile
                }
            }));
            setLoading(false);
            toast({
                title: 'Profil Diperbarui',
                description: 'Profil Kesiapan Finansialmu telah dihitung.',
            });
        }, 1000);
    }
    
    const getStatusInfo = () => {
        switch(profile?.status) {
            case 'ready':
                return { icon: <Award className="h-10 w-10 text-green-500" />, text: 'Siap untuk Investasi', color: 'bg-green-500' };
            case 'needs_work':
                return { icon: <AlertCircle className="h-10 w-10 text-yellow-500" />, text: 'Perlu Perbaikan', color: 'bg-yellow-500' };
            default:
                return { icon: <AlertCircle className="h-10 w-10 text-destructive" />, text: 'Belum Lengkap', color: 'bg-destructive' };
        }
    }
    
    const statusInfo = getStatusInfo();

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Profil Kesiapan Bisnis</CardTitle>
                <CardDescription>Skor berdasarkan data proyekmu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {profile ? (
                    <>
                        <div className="flex justify-center items-center flex-col gap-2">
                            {statusInfo.icon}
                            <p className="text-2xl font-bold">{profile.score}/100</p>
                            <Badge className={`${statusInfo.color} hover:${statusInfo.color} text-white`}>{statusInfo.text}</Badge>
                        </div>
                        <Progress value={profile.score} className="w-full" />
                        <div>
                            <h4 className="font-semibold mb-2">Rekomendasi:</h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                {profile.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Klik "Hitung Profil" untuk menghasilkan skormu.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button onClick={calculateProfile} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Hitung Profil'}
                </Button>
                <Button variant="secondary" disabled={!profile} className="w-full">
                    <FileDown className="mr-2 h-4 w-4" /> Ekspor sebagai PDF
                </Button>
            </CardFooter>
        </Card>
    );
}
