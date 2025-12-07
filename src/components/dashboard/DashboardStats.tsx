"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Zap, Clock, TrendingUp } from "lucide-react";

interface Stats {
  activeWorkflows: number;
  totalExecutions: number;
  executionsLast24h: number;
  successRate: number;
}

interface StatsData {
  ok: boolean;
  stats: Stats;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/updates");
        const result = await response.json();
        if (result.ok && result.stats) {
          setStats(result.stats);
        }
      } catch {
        // Use empty state on error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      label: "Active Workflows",
      value: stats?.activeWorkflows ?? 0,
      icon: Activity,
      format: (v: number) => v.toString(),
    },
    {
      label: "Total Executions",
      value: stats?.totalExecutions ?? 0,
      icon: Zap,
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: "Last 24 Hours",
      value: stats?.executionsLast24h ?? 0,
      icon: Clock,
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: "Success Rate",
      value: stats?.successRate ?? 0,
      icon: TrendingUp,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border/50 p-6">
            <Skeleton className="h-5 w-5 rounded bg-muted mb-3" />
            <Skeleton className="h-8 w-20 bg-muted mb-2" />
            <Skeleton className="h-4 w-24 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="bg-card border-border/50 p-6 hover:bg-muted/10 transition-colors"
          >
            <Icon className="h-5 w-5 text-[#194c92] mb-3" />
            <p className="text-3xl font-bold text-foreground mb-1">
              {item.format(item.value)}
            </p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
