import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, Zap, AlertTriangle, TrendingUp, Clock, 
  CheckCircle, XCircle, ChevronRight, RefreshCw
} from "lucide-react";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkflowStat {
  id: string;
  name: string;
  status: "active" | "inactive";
  executionCount: number;
  successRate: number;
}

interface Update {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

// Mock data - would come from API
const mockStats = {
  totalWorkflows: 6,
  activeWorkflows: 4,
  totalExecutions: 1247,
  executionsLast24h: 42,
  successRate: 94.5,
};

const mockUpdates: Update[] = [
  {
    id: "1",
    type: "success",
    title: "High success rate",
    description: "Your workflows achieved 98% success rate in the last 24 hours.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "warning",
    title: "Low activity workflow",
    description: "\"Sync CRM to Sheets\" hasn't run in 7 days.",
    timestamp: "1 day ago",
    link: "/app/workflows/3",
  },
  {
    id: "3",
    type: "error",
    title: "Recent failures detected",
    description: "2 executions failed in \"Send Welcome Email\" workflow.",
    timestamp: "3 hours ago",
    link: "/app/workflows/1",
  },
];

const mockWorkflows: WorkflowStat[] = [
  { id: "1", name: "Send Welcome Email", status: "active", executionCount: 523, successRate: 96 },
  { id: "2", name: "Notify Slack on New Lead", status: "active", executionCount: 312, successRate: 99 },
  { id: "3", name: "Sync CRM to Sheets", status: "inactive", executionCount: 0, successRate: 0 },
];

interface SynthUpdatesCardProps {
  isUnpaid?: boolean;
}

const SynthUpdatesCard = ({ isUnpaid = false }: SynthUpdatesCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
  };

  const getUpdateIcon = (type: Update["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "info": return <Activity className="w-4 h-4 text-primary" />;
    }
  };

  if (isUnpaid) {
    return (
      <AppCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-accent text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Synth Updates
          </h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Subscription Required</h3>
          <p className="text-muted-foreground mb-4">
            Activate your subscription to see workflow analytics and updates.
          </p>
          <Button asChild>
            <Link to="/app/billing">Activate Subscription</Link>
          </Button>
        </div>
      </AppCard>
    );
  }

  return (
    <AppCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent text-xl font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Synth Updates
        </h2>
        <div className="flex items-center gap-2">
          <StatusBadge variant="active">Operational</StatusBadge>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Active Workflows</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {mockStats.activeWorkflows}/{mockStats.totalWorkflows}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Executions</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {mockStats.totalExecutions.toLocaleString()}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {mockStats.executionsLast24h}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Success Rate</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {mockStats.successRate}%
          </p>
        </motion.div>
      </div>

      {/* Updates List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Recent Updates</h3>
        </div>
        <div className="space-y-2">
          {mockUpdates.map((update) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {getUpdateIcon(update.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{update.title}</p>
                <p className="text-xs text-muted-foreground">{update.description}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{update.timestamp}</p>
              </div>
              {update.link && (
                <Link to={update.link}>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Workflow Stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Workflow Performance</h3>
          <Link to="/app/workflows" className="text-xs text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {mockWorkflows.map((workflow) => (
            <Link
              key={workflow.id}
              to={`/app/workflows/${workflow.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${workflow.status === "active" ? "bg-green-500" : "bg-muted-foreground"}`} />
                <span className="text-sm font-medium text-foreground">{workflow.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{workflow.executionCount} runs</span>
                {workflow.successRate > 0 && (
                  <span className={workflow.successRate >= 95 ? "text-green-500" : "text-amber-500"}>
                    {workflow.successRate}% success
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppCard>
  );
};

export default SynthUpdatesCard;
