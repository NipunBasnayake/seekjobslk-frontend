import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getPageViews, incrementPageViews } from '@/data/mockData';

const PageViewsCounter: React.FC = () => {
  const [views, setViews] = useState(0);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    // Check if we've already counted this session
    const sessionCounted = sessionStorage.getItem('seekjobslk-view-counted');
    
    if (!sessionCounted && !hasIncremented) {
      const newViews = incrementPageViews();
      setViews(newViews);
      sessionStorage.setItem('seekjobslk-view-counted', 'true');
      setHasIncremented(true);
    } else {
      setViews(getPageViews());
    }
  }, [hasIncremented]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center justify-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Eye className="w-5 h-5 text-accent" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-heading">{formatNumber(views)}</p>
          <p className="text-xs text-muted-foreground">Total Visitors</p>
        </div>
      </div>
    </div>
  );
};

export default PageViewsCounter;
