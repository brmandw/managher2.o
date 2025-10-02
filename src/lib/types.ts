
// Represents the entire data structure for a single project stored in localStorage
export type ProjectData = {
  id: string;
  business: {
    name: string;
    type: 'F&B' | 'Fashion' | 'Services' | 'Tech' | 'Other';
    products: string;
    description?: string;
  };
  marketability?: {
    marketSegments?: string[];
    recommendedSegments?: { segment: string; reason: string }[];
    nicheSuggestion?: string;
    positioningStatement?: string;
  };
  innovation?: {
    packaging?: {
      notes: string;
      isAdaptive: boolean;
      isTested: boolean;
    },
    variants?: {
        id: string;
        name: string;
        type: 'flavor' | 'size' | 'personalization';
        isActive: boolean;
    }[],
    feedback?: {
        iterations: {
            id: string;
            date: Date;
            feedbacks: {
                id: string;
                source: 'Marketplace' | 'Social Media' | 'Internal Form';
                comment: string;
                rating: number;
                date: Date;
            }[];
        }[],
        currentFeedbacks: {
            id: string;
            source: 'Marketplace' | 'Social Media' | 'Internal Form';
            comment: string;
            rating: number;
            date: Date;
        }[];
    }
  };
  financials?: {
    projection?: {
      revenue: number;
      breakEvenPoint: number;
      margin: number;
    },
    readinessProfile?: {
      score: number;
      status: 'ready' | 'needs_work' | 'incomplete';
      recommendations: string[];
    }
  };
};
