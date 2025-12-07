"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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

  const getPriorityVariant = (priority: string): "destructive" | "secondary" | "default" => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "efficiency": return "text-blue-400";
      case "optimization": return "text-purple-400";
      case "reliability": return "text-red-400";
      case "growth": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-7 w-36 mb-2 bg-muted" />
            <Skeleton className="h-4 w-64 bg-muted" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-destructive/50 p-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const insights = data?.insights || [];

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Synth Advisory</h2>
          <p className="text-sm text-muted-foreground">
            AI-powered insights and recommendations for your automations
          </p>
        </div>

        {/* Insights List */}
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                  <Badge variant={getPriorityVariant(insight.priority)} className="text-xs capitalize">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {insight.body}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs capitalize ${getCategoryColor(insight.category)}`}>
                    {insight.category}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(insight.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground mb-1">No advisory insights available at this time.</p>
            <p className="text-xs text-muted-foreground">
              Insights will appear as Synth analyzes your workflows and usage patterns.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SynthAdvisoryCard;
