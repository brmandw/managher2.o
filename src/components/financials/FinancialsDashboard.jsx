'use client';
import { RevenueCostSimulator } from './RevenueCostSimulator';
import { FinancialReadinessProfile } from './FinancialReadinessProfile';

export function FinancialsDashboard({ projectData }) {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <RevenueCostSimulator initialData={projectData.financials?.projection} />
            </div>
            <div className="lg:col-span-1">
                <FinancialReadinessProfile 
                    projectData={projectData} 
                />
            </div>
        </div>
    )
}
