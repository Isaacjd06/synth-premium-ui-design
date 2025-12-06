import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";

// Mock data
const mockWorkflows = [
  {
    id: "1",
    name: "Send Welcome Email",
    description: "Automatically sends a welcome email when a new user signs up to the platform.",
    status: "active",
  },
  {
    id: "2",
    name: "Notify Slack on New Lead",
    description: "Posts a notification to Slack when a new lead is captured in the CRM.",
    status: "active",
  },
  {
    id: "3",
    name: "Sync CRM to Google Sheets",
    description: "Syncs CRM data to a Google Sheet on a daily basis for reporting purposes.",
    status: "inactive",
  },
  {
    id: "4",
    name: "Forward Contact Form Submissions",
    description: "Forwards all contact form submissions to the support team via email.",
    status: "active",
  },
  {
    id: "5",
    name: "New Lead → Email Autoresponder",
    description: "Sends an automated response to new leads with information about services.",
    status: "active",
  },
  {
    id: "6",
    name: "Inbound Lead → Save to Sheet",
    description: "Saves all inbound leads to a Google Sheet for easy tracking.",
    status: "inactive",
  },
];

const Workflows = () => {
  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Workflows</h1>
            <p className="text-sm text-muted-foreground">Manage your automation workflows.</p>
          </div>
          <Button asChild>
            <Link to="/app/workflows/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Workflow</span>
            </Link>
          </Button>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {mockWorkflows.map((workflow) => (
            <Link
              key={workflow.id}
              to={`/app/workflows/${workflow.id}`}
              className="block"
            >
              <AppCard className="h-full hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">{workflow.name}</h3>
                  <StatusBadge variant={workflow.status === "active" ? "active" : "inactive"}>
                    {workflow.status === "active" ? "Active" : "Inactive"}
                  </StatusBadge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {workflow.description}
                </p>
              </AppCard>
            </Link>
          ))}
        </div>

        {/* Empty state (shown when no workflows) */}
        {mockWorkflows.length === 0 && (
          <AppCard>
            <p className="text-muted-foreground text-center py-8">
              No workflows yet. Create your first workflow to get started.
            </p>
          </AppCard>
        )}
      </div>
    </AppShell>
  );
};

export default Workflows;
