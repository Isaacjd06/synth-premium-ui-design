import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";

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

const Dashboard = () => {
  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Synth Updates Card */}
          <AppCard className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-accent text-xl font-semibold text-foreground">Synth Updates</h2>
              <StatusBadge variant="active">Operational</StatusBadge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Workflows</p>
                <p className="text-2xl font-display font-bold text-foreground">3</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Executions</p>
                <p className="text-2xl font-display font-bold text-foreground">127</p>
              </div>
            </div>

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
      </div>
    </AppShell>
  );
};

export default Dashboard;
