import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import SynthAdvisoryCard from "@/components/app/SynthAdvisoryCard";
import TrialStatusBanner from "@/components/app/TrialStatusBanner";
import { Activity, Zap, AlertTriangle, TrendingUp } from "lucide-react";

// Mock data for skeleton
const mockWorkflows = [
  { id: "1", name: "Send Welcome Email", status: "active", createdAt: "Jan 15, 2025" },
  { id: "2", name: "Notify Slack on New Lead", status: "active", createdAt: "Jan 12, 2025" },
  { id: "3", name: "Sync CRM to Sheets", status: "inactive", createdAt: "Jan 10, 2025" },
];

const mockExecutions = [
  { id: "1", workflowId: "1", workflowName: "Send Welcome Email", status: "success", createdAt: "Jan 15, 2025" },
  { id: "2", workflowId: "2", workflowName: "Notify Slack on New Lead", status: "success", createdAt: "Jan 14, 2025" },
  { id: "3", workflowId: "1", workflowName: "Send Welcome Email", status: "error", createdAt: "Jan 13, 2025" },
];

// Mock stats
const mockStats = {
  activeWorkflows: 2,
  totalExecutions: 127,
  last24hExecutions: 23,
  successRate: 94.5,
  recentFailures: 1,
  neverRunWorkflows: 1
};

const Dashboard = () => {
  // Mock: For demo, user is on trial
  const isTrialing = true;
  const daysRemaining = 3;
  const isPaid = false;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        {/* Trial Banner */}
        <TrialStatusBanner 
          isTrialing={isTrialing} 
          daysRemaining={daysRemaining} 
          isPaid={isPaid} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Synth Updates Card - spans 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <AppCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-accent text-xl font-semibold text-foreground">Synth Updates</h2>
                <StatusBadge variant="active">Operational</StatusBadge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Active Workflows</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{mockStats.activeWorkflows}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <p className="text-sm text-muted-foreground">Total Executions</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{mockStats.totalExecutions}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <p className="text-sm text-muted-foreground">Last 24h</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{mockStats.last24hExecutions}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{mockStats.successRate}%</p>
                </div>
              </div>

              {/* Alerts */}
              {(mockStats.recentFailures > 0 || mockStats.neverRunWorkflows > 0) && (
                <div className="mb-6 space-y-2">
                  {mockStats.recentFailures > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-sm text-foreground">
                        {mockStats.recentFailures} workflow{mockStats.recentFailures > 1 ? 's' : ''} failed in the last 24 hours
                      </p>
                      <Link to="/app/executions" className="ml-auto text-xs text-primary hover:underline shrink-0">
                        View
                      </Link>
                    </div>
                  )}
                  {mockStats.neverRunWorkflows > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <p className="text-sm text-foreground">
                        {mockStats.neverRunWorkflows} workflow{mockStats.neverRunWorkflows > 1 ? 's have' : ' has'} never been run
                      </p>
                      <Link to="/app/workflows" className="ml-auto text-xs text-primary hover:underline shrink-0">
                        View
                      </Link>
                    </div>
                  )}
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
                  {mockWorkflows.map((workflow) => (
                    <Link
                      key={workflow.id}
                      to={`/app/workflows/${workflow.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{workflow.name}</p>
                        <p className="text-xs text-muted-foreground">{workflow.createdAt}</p>
                      </div>
                      <StatusBadge variant={workflow.status === "active" ? "active" : "inactive"}>
                        {workflow.status === "active" ? "Active" : "Inactive"}
                      </StatusBadge>
                    </Link>
                  ))}
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
                  {mockExecutions.map((execution) => (
                    <Link
                      key={execution.id}
                      to={`/app/workflows/${execution.workflowId}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{execution.workflowName}</p>
                        <p className="text-xs text-muted-foreground">{execution.createdAt}</p>
                      </div>
                      <StatusBadge variant={execution.status === "success" ? "success" : "error"}>
                        {execution.status === "success" ? "Success" : "Error"}
                      </StatusBadge>
                    </Link>
                  ))}
                </div>
              </div>
            </AppCard>
          </div>

          {/* Synth Advisory - right column */}
          <div className="lg:col-span-1">
            <SynthAdvisoryCard isPaid={!isTrialing || isPaid} />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
