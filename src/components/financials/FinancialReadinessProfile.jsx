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
            recommendations.push("Complete Marketability analysis for a clearer strategy.");
        }

        // Innovation check
        if (projectData.innovation?.packaging?.isLogisticsReady) {
            score += 15;
        }
        if (projectData.innovation?.variants && projectData.innovation.variants.length > 0) {
            score += 15;
        } else {
            recommendations.push("Add at least one product variant to diversify your offering.");
        }
        
        // Financials check
        if (projectData.financials?.projection) {
            if (projectData.financials.projection.margin > 20) {
                score += 35;
            } else {
                score += 20;
                recommendations.push("Try to improve your profit margin above 20%.");
            }
        } else {
            recommendations.push("Run the Revenue & Cost simulation.");
        }

        const status = score > 70 ? 'ready' : score > 30 ? 'needs_work' : 'incomplete';
        if (status === 'ready' && recommendations.length === 0) {
            recommendations.push("Your business profile looks solid! Consider exploring funding options.");
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
                title: 'Profile Updated',
                description: 'Your Financial Readiness Profile has been calculated.',
            });
        }, 1000);
    }
    
    const getStatusInfo = () => {
        switch(profile?.status) {
            case 'ready':
                return { icon: <Award className="h-10 w-10 text-green-500" />, text: 'Ready for Investment', color: 'bg-green-500' };
            case 'needs_work':
                return { icon: <AlertCircle className="h-10 w-10 text-yellow-500" />, text: 'Needs Improvement', color: 'bg-yellow-500' };
            default:
                return { icon: <AlertCircle className="h-10 w-10 text-destructive" />, text: 'Incomplete', color: 'bg-destructive' };
        }
    }
    
    const statusInfo = getStatusInfo();

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Financial Readiness Profile</CardTitle>
                <CardDescription>An AI-powered score based on your project data.</CardDescription>
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
                            <h4 className="font-semibold mb-2">Recommendations:</h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                {profile.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Click "Calculate Profile" to generate your score.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button onClick={calculateProfile} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Calculate Profile'}
                </Button>
                <Button variant="secondary" disabled={!profile} className="w-full">
                    <FileDown className="mr-2 h-4 w-4" /> Export as PDF
                </Button>
            </CardFooter>
        </Card>
    );
}
