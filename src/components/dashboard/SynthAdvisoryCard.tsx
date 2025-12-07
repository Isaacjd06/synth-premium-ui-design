"use client";

import { useState, useEffect } from "react";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { RefreshCw, Lightbulb } from "lucide-react";

interface Insight {
  id: string;
  title: string;
  body: string;
  priority: "high" | "medium" | "low";
  category: "efficiency" | "optimization" | "reliability" | "growth";
  createdAt: string;
}

interface AdvisoryData {
  ok: boolean;
  insights: Insight[];
}

const SynthAdvisoryCard = () => {
  const [data, setData] = useState<AdvisoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard/advisory");
      const result = await response.json();
      if (result.ok) {
        setData(result);
      } else {
        throw new Error(result.error || "Failed to fetch advisory insights");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch advisory insights";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "inactive";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "efficiency": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "optimization": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "reliability": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "growth": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <AppCard>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-7 w-36 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        </div>
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard className="border-destructive/50">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </AppCard>
    );
  }

  const insights = data?.insights || [];

  return (
    <AppCard>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-accent text-xl font-semibold text-foreground">Synth Advisory</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered insights and recommendations for your automations
        </p>
      </div>

      {/* Insights List */}
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                <StatusBadge variant={getPriorityVariant(insight.priority)}>
                  {insight.priority}
                </StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {insight.body}
              </p>
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={`text-xs capitalize ${getCategoryColor(insight.category)}`}
                >
                  {insight.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(insight.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-foreground mb-1">No advisory insights available at this time.</p>
          <p className="text-xs text-muted-foreground">
            Insights will appear as Synth analyzes your workflows and usage patterns.
          </p>
        </div>
      )}
    </AppCard>
  );
};

export default SynthAdvisoryCard;
