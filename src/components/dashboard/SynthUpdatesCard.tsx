"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatDate, truncate } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

interface Workflow {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error";
  createdAt: string;
}

interface Stats {
  activeWorkflows: number;
  totalExecutions: number;
  last24Hours: number;
  successRate: number;
}

interface UpdatesData {
  ok: boolean;
  updates: Alert[];
  stats: Stats;
  recentWorkflows: Workflow[];
  recentExecutions: Execution[];
}

const SynthUpdatesCard = () => {
  const [data, setData] = useState<UpdatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard/updates");
      const result = await response.json();
      if (result.ok) {
        setData(result);
      } else {
        throw new Error(result.error || "Failed to fetch updates");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch updates";
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

  if (loading) {
    return (
      <AppCard>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
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

  const stats = data?.stats || { activeWorkflows: 0, totalExecutions: 0, last24Hours: 0, successRate: 0 };
  const updates = data?.updates || [];
  const workflows = data?.recentWorkflows || [];
  const executions = data?.recentExecutions || [];

  return (
    <AppCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-accent text-xl font-semibold text-foreground">Synth Updates</h2>
          <p className="text-sm text-muted-foreground">System Status</p>
        </div>
        <StatusBadge variant="success">Operational</StatusBadge>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-2xl font-display font-bold text-foreground">{stats.activeWorkflows}</p>
          <p className="text-sm text-muted-foreground">Active Workflows</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-2xl font-display font-bold text-foreground">{stats.totalExecutions}</p>
          <p className="text-sm text-muted-foreground">Total Executions</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-2xl font-display font-bold text-foreground">{stats.last24Hours}</p>
          <p className="text-sm text-muted-foreground">Last 24 Hours</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-2xl font-display font-bold text-foreground">{stats.successRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Success Rate</p>
        </div>
      </div>

      {/* Recent Alerts */}
      {updates.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent Alerts</h3>
          <div className="space-y-2">
            {updates.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <StatusBadge variant={getPriorityVariant(alert.priority)}>
                    {alert.priority}
                  </StatusBadge>
                </div>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Workflows */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Recent Workflows</h3>
          <Link to="/app/workflows" className="text-xs text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {workflows.length > 0 ? (
            workflows.slice(0, 3).map((workflow) => (
              <Link
                key={workflow.id}
                to={`/app/workflows/${workflow.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{truncate(workflow.name, 40)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(workflow.createdAt)}</p>
                </div>
                <StatusBadge variant={workflow.status === "active" ? "active" : "inactive"}>
                  {workflow.status === "active" ? "Active" : "Inactive"}
                </StatusBadge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-2">No workflows yet</p>
          )}
        </div>
      </div>

      {/* Recent Executions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Recent Executions</h3>
          <Link to="/app/executions" className="text-xs text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {executions.length > 0 ? (
            executions.slice(0, 3).map((execution) => (
              <Link
                key={execution.id}
                to={`/app/workflows/${execution.workflowId}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{truncate(execution.workflowName, 40)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(execution.createdAt)}</p>
                </div>
                <StatusBadge variant={execution.status === "success" ? "success" : "error"}>
                  {execution.status === "success" ? "Success" : "Error"}
                </StatusBadge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-2">No executions yet</p>
          )}
        </div>
      </div>
    </AppCard>
  );
};

export default SynthUpdatesCard;
