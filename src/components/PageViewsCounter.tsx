import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { registerVisitor } from "@/services/firebaseData";

const PageViewsCounter: React.FC = () => {
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerVisitor()
      .then((count) => setViews(count))
      .catch((err) => {
        console.error("Failed to load visitor count:", err);
        setViews(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center justify-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Eye className="w-5 h-5 text-accent" />
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-heading">
            {loading ? "—" : views !== null ? formatNumber(views) : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">Total Visitors</p>
        </div>
      </div>
    </div>
  );
};

export default PageViewsCounter;
