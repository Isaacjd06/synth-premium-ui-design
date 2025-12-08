import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import WorkflowFilters from "@/components/workflows/WorkflowFilters";
import WorkflowDetailDrawer from "@/components/workflows/WorkflowDetailDrawer";
import WorkflowEmptyState from "@/components/workflows/WorkflowEmptyState";
import { WorkflowStatus } from "@/components/workflows/WorkflowStatusBadge";
import { TriggerType } from "@/components/workflows/WorkflowTriggerIcon";

// Placeholder data
const mockWorkflows = [
  {
    id: "1",
    name: "Lead Intake → CRM",
    description: "Automatically captures leads from web forms and syncs them to your CRM with enrichment data.",
    status: "active" as WorkflowStatus,
    trigger: "webhook" as TriggerType,
    lastRunStatus: "success" as const,
    lastRunTime: "2 hours ago",
    executionCount: 1247,
    steps: [
      { id: "s1", name: "Webhook Trigger", type: "trigger" },
      { id: "s2", name: "Enrich Lead Data", type: "ai" },
      { id: "s3", name: "Add to CRM", type: "action" },
    ],
    recentExecutions: [
      { id: "e1", status: "success" as const, timestamp: "2 hours ago", duration: "1.2s" },
      { id: "e2", status: "success" as const, timestamp: "4 hours ago", duration: "0.9s" },
      { id: "e3", status: "success" as const, timestamp: "6 hours ago", duration: "1.1s" },
    ],
  },
  {
    id: "2",
    name: "Stripe Payment Notifier",
    description: "Sends a Slack notification when a successful payment is processed via Stripe.",
    status: "active" as WorkflowStatus,
    trigger: "stripe" as TriggerType,
    lastRunStatus: "success" as const,
    lastRunTime: "30 min ago",
    executionCount: 892,
    steps: [
      { id: "s1", name: "Stripe Webhook", type: "trigger" },
      { id: "s2", name: "Format Message", type: "transform" },
      { id: "s3", name: "Send to Slack", type: "action" },
    ],
    recentExecutions: [
      { id: "e1", status: "success" as const, timestamp: "30 min ago", duration: "0.5s" },
      { id: "e2", status: "success" as const, timestamp: "1 hour ago", duration: "0.6s" },
    ],
  },
  {
    id: "3",
    name: "Daily Report Generator",
    description: "Compiles daily analytics from multiple sources and sends a summary report via email.",
    status: "active" as WorkflowStatus,
    trigger: "schedule" as TriggerType,
    lastRunStatus: "success" as const,
    lastRunTime: "Yesterday 9:00 AM",
    executionCount: 365,
    steps: [
      { id: "s1", name: "Schedule (9 AM)", type: "trigger" },
      { id: "s2", name: "Fetch Analytics", type: "api" },
      { id: "s3", name: "Generate Report", type: "ai" },
      { id: "s4", name: "Send Email", type: "action" },
    ],
    recentExecutions: [
      { id: "e1", status: "success" as const, timestamp: "Yesterday 9:00 AM", duration: "12.3s" },
      { id: "e2", status: "success" as const, timestamp: "2 days ago", duration: "11.8s" },
    ],
  },
  {
    id: "4",
    name: "New Lead Autoresponder",
    description: "Sends an automated response to new leads with personalized information about services.",
    status: "inactive" as WorkflowStatus,
    trigger: "email" as TriggerType,
    lastRunStatus: "success" as const,
    lastRunTime: "1 week ago",
    executionCount: 156,
    steps: [
      { id: "s1", name: "Email Trigger", type: "trigger" },
      { id: "s2", name: "Parse Email", type: "transform" },
      { id: "s3", name: "Send Response", type: "action" },
    ],
    recentExecutions: [
      { id: "e1", status: "success" as const, timestamp: "1 week ago", duration: "2.1s" },
    ],
  },
  {
    id: "5",
    name: "Slack Support Router",
    description: "Routes support requests from Slack to the appropriate team based on message content.",
    status: "error" as WorkflowStatus,
    trigger: "slack" as TriggerType,
    lastRunStatus: "error" as const,
    lastRunTime: "3 hours ago",
    executionCount: 423,
    steps: [
      { id: "s1", name: "Slack Message", type: "trigger" },
      { id: "s2", name: "Classify Intent", type: "ai" },
      { id: "s3", name: "Route to Team", type: "action" },
    ],
    recentExecutions: [
      { id: "e1", status: "error" as const, timestamp: "3 hours ago", duration: "0.3s" },
      { id: "e2", status: "success" as const, timestamp: "5 hours ago", duration: "1.4s" },
    ],
  },
  {
    id: "6",
    name: "Contact Form Handler",
    description: "Processes contact form submissions and creates tasks in the project management system.",
    status: "draft" as WorkflowStatus,
    trigger: "form" as TriggerType,
    lastRunStatus: "never" as const,
    executionCount: 0,
    steps: [
      { id: "s1", name: "Form Submit", type: "trigger" },
      { id: "s2", name: "Create Task", type: "action" },
    ],
    recentExecutions: [],
  },
];

const Workflows = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof mockWorkflows[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewWorkflow = (workflow: typeof mockWorkflows[0]) => {
    setSelectedWorkflow(workflow);
    setDrawerOpen(true);
  };

  const showEmptyState = mockWorkflows.length === 0;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflows</h1>
            <p className="text-muted-foreground mt-1">
              View, monitor, and manage all of your automated workflows.
            </p>
          </div>
          <Button asChild size="default">
            <Link to="/app/workflows/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Workflow
            </Link>
          </Button>
        </motion.div>

        {showEmptyState ? (
          <WorkflowEmptyState />
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <WorkflowFilters viewMode={viewMode} onViewModeChange={setViewMode} />
            </motion.div>

            {/* Workflows Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {mockWorkflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <WorkflowCard
                    {...workflow}
                    onView={() => handleViewWorkflow(workflow)}
                    onEdit={() => {}}
                    onRun={() => {}}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Detail Drawer */}
      <WorkflowDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        workflow={selectedWorkflow}
      />
    </AppShell>
  );
};

export default Workflows;
