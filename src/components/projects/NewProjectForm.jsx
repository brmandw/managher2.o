'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { saveProjectData, loadProjectData } from '@/lib/project-storage';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const steps = [
    { id: 1, field: 'businessName', label: "Pertama, apa nama bisnismu?", placeholder: "contoh: Artisan Bakes" },
    { id: 2, field: 'businessType', label: "Bagus! Jenis bisnis apa?", type: 'select', options: ['F&B', 'Fashion', 'Services', 'Tech', 'Other'] },
    { id: 3, field: 'productsSold', label: "Produk atau layanan apa yang kamu jual?", placeholder: "contoh: 'Roti sourdough artisan dan kue kustom'", type: 'textarea' },
    { id: 4, field: 'description', label: "Terakhir, berikan deskripsi singkat yang menarik. (Opsional)", placeholder: "contoh: 'Roti sourdough terbaik di kota, dibuat dengan penuh cinta.'", type: 'textarea' },
];

const getStepLabel = (step) => {
    switch (step) {
        case 1: return "Pertama, apa nama bisnismu?";
        case 2: return "Bagus! Jenis bisnis apa?";
        case 3: return "Dan produk atau layanan apa yang kamu jual?";
        case 4: return "Terakhir, berikan deskripsi singkat yang menarik (Opsional).";
        default: return "";
    }
}

const StepInput = ({ step, formData, handleInputChange, handleSelectChange }) => {
    const currentStepInfo = steps[step - 1];

    if (currentStepInfo.type === 'select') {
        return (
            <Select onValueChange={(value) => handleSelectChange(currentStepInfo.field, value)} value={formData[currentStepInfo.field] || ''}>
                <SelectTrigger className="text-lg h-12">
                    <SelectValue placeholder="Pilih kategori bisnis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F&B">F&amp;B (Makanan &amp; Minuman)</SelectItem>
                  <SelectItem value="Fashion">Pakaian</SelectItem>
                  <SelectItem value="Services">Jasa</SelectItem>
                  <SelectItem value="Tech">Teknologi</SelectItem>
                  <SelectItem value="Other">Lainnya</SelectItem>
                </SelectContent>
            </Select>
        );
    }

    if (currentStepInfo.type === 'textarea') {
        return (
            <Textarea
                name={currentStepInfo.field}
                value={formData[currentStepInfo.field] || ''}
                onChange={handleInputChange}
                placeholder={currentStepInfo.placeholder}
                className="text-lg min-h-[100px]"
                autoFocus
            />
        );
    }
    
    return (
        <Input
            name={currentStepInfo.field}
            value={formData[currentStepInfo.field] || ''}
            onChange={handleInputChange}
            placeholder={currentStepInfo.placeholder}
            className="text-lg h-12"
            autoFocus
        />
    );
};

export function NewProjectForm({ onProjectCreated }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Clear previous project data when starting a new one
        if (typeof window !== 'undefined') {
            localStorage.removeItem('currentProject');
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        const projectId = `proj_${Date.now()}`;
        
        const newProject = {
            id: projectId,
            business: {
                name: formData.businessName,
                type: formData.businessType,
                products: formData.productsSold,
                description: formData.description,
            },
            marketability: {},
            innovation: {
                packaging: { notes: '', isAdaptive: false, isTested: false, isLogisticsReady: false },
                variants: [],
                feedback: { iterations: [], currentFeedbacks: [] }
            },
            financials: {},
        };
        saveProjectData(newProject);
        onProjectCreated(projectId);
    };

    const isNextDisabled = () => {
        const currentField = steps[currentStep - 1].field;
        // The last step is optional
        if (currentStep === 4) return false;
        return !formData[currentField];
    };

    return (
        <div className="flex flex-col p-4 space-y-8 min-h-[350px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex-grow"
                >
                    <label className="text-lg font-medium text-foreground mb-4 block">{getStepLabel(currentStep)}</label>
                    <StepInput 
                        step={currentStep} 
                        formData={formData} 
                        handleInputChange={handleInputChange} 
                        handleSelectChange={handleSelectChange}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center pt-4">
                <div>
                    {currentStep > 1 && (
                        <Button variant="ghost" onClick={handleBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    )}
                </div>
                <Button onClick={handleNext} disabled={isNextDisabled()} size="lg">
                    {currentStep === steps.length ? 'Buat Proyek' : 'Lanjutkan'}
                </Button>
            </div>
        </div>
    );
}
