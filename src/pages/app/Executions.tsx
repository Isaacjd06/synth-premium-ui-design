import { useState } from "react";
import { motion } from "framer-motion";
import AppShell from "@/components/app/AppShell";
import ExecutionFilters from "@/components/executions/ExecutionFilters";
import ExecutionItemCard from "@/components/executions/ExecutionItemCard";
import ExecutionDetailsDrawer from "@/components/executions/ExecutionDetailsDrawer";
import ExecutionEmptyState from "@/components/executions/ExecutionEmptyState";
import { ExecutionStatus } from "@/components/executions/ExecutionStatusBadge";
import { TriggerType } from "@/components/workflows/WorkflowTriggerIcon";

// Placeholder data
const mockExecutions = [
  {
    id: "1",
    executionId: "exec_a8f2d9c1",
    workflowName: "Lead Intake → CRM",
    status: "success" as ExecutionStatus,
    trigger: "webhook" as TriggerType,
    startTime: "Today, 2:45 PM",
    endTime: "Today, 2:45 PM",
    duration: "1.2s",
    summary: "Processed 1 new lead and added to HubSpot CRM",
    triggerSource: "Form submission",
    steps: [
      { id: "s1", name: "Receive Webhook", status: "success" as const, output: "Received payload with lead data" },
      { id: "s2", name: "Enrich Lead Data", status: "success" as const, output: "Added company info from Clearbit" },
      { id: "s3", name: "Add to CRM", status: "success" as const, output: "Created contact in HubSpot" },
    ],
    inputData: { email: "john@example.com", name: "John Doe", company: "Acme Inc" },
    outputData: { success: true, hubspotId: "hs_12345", enriched: true },
  },
  {
    id: "2",
    executionId: "exec_b7e3c4d2",
    workflowName: "Stripe Payment Notifier",
    status: "success" as ExecutionStatus,
    trigger: "stripe" as TriggerType,
    startTime: "Today, 1:30 PM",
    endTime: "Today, 1:30 PM",
    duration: "0.5s",
    summary: "Sent payment notification to #payments channel",
    triggerSource: "payment_intent.succeeded",
    steps: [
      { id: "s1", name: "Parse Stripe Event", status: "success" as const, output: "Extracted payment details" },
      { id: "s2", name: "Format Message", status: "success" as const, output: "Built Slack block message" },
      { id: "s3", name: "Send to Slack", status: "success" as const, output: "Posted to #payments" },
    ],
    inputData: { amount: 9900, customer: "cus_abc123", status: "succeeded" },
    outputData: { slackTs: "1234567890.123456", channelId: "C01234" },
  },
  {
    id: "3",
    executionId: "exec_c6f4e5a3",
    workflowName: "Slack Support Router",
    status: "error" as ExecutionStatus,
    trigger: "slack" as TriggerType,
    startTime: "Today, 11:20 AM",
    endTime: "Today, 11:20 AM",
    duration: "0.3s",
    summary: "Failed to classify support request",
    triggerSource: "message.channels",
    steps: [
      { id: "s1", name: "Parse Slack Message", status: "success" as const, output: "Extracted message content" },
      { id: "s2", name: "Classify Intent", status: "error" as const, output: "AI classification failed" },
      { id: "s3", name: "Route to Team", status: "skipped" as const, output: "Skipped due to previous error" },
    ],
    inputData: { text: "Need help with billing", userId: "U12345" },
    outputData: {},
    errorMessage: "AI service temporarily unavailable. Rate limit exceeded.",
    errorStack: "Error: Rate limit exceeded (429)\n  at classifyIntent (workflows/support-router.ts:45)\n  at processMessage (workflows/support-router.ts:23)",
  },
  {
    id: "4",
    executionId: "exec_d5g6h7i4",
    workflowName: "Daily Report Generator",
    status: "running" as ExecutionStatus,
    trigger: "schedule" as TriggerType,
    startTime: "Today, 9:00 AM",
    endTime: "—",
    duration: "Running...",
    summary: "Generating analytics report",
    triggerSource: "Daily at 9:00 AM",
    steps: [
      { id: "s1", name: "Fetch Analytics", status: "success" as const, output: "Retrieved 7-day metrics" },
      { id: "s2", name: "Generate Report", status: "success" as const, output: "Building PDF report" },
      { id: "s3", name: "Send Email", status: "skipped" as const, output: "Pending..." },
    ],
    inputData: { reportType: "weekly", recipients: ["team@example.com"] },
    outputData: {},
  },
  {
    id: "5",
    executionId: "exec_e4f5g6h5",
    workflowName: "Lead Intake → CRM",
    status: "success" as ExecutionStatus,
    trigger: "webhook" as TriggerType,
    startTime: "Yesterday, 4:15 PM",
    endTime: "Yesterday, 4:15 PM",
    duration: "0.9s",
    summary: "Processed 1 new lead and added to HubSpot CRM",
    triggerSource: "Form submission",
    steps: [
      { id: "s1", name: "Receive Webhook", status: "success" as const, output: "Received payload" },
      { id: "s2", name: "Enrich Lead Data", status: "success" as const, output: "Added company info" },
      { id: "s3", name: "Add to CRM", status: "success" as const, output: "Created contact" },
    ],
    inputData: { email: "jane@techcorp.com", name: "Jane Smith" },
    outputData: { success: true, hubspotId: "hs_67890" },
  },
  {
    id: "6",
    executionId: "exec_f3g4h5i6",
    workflowName: "Contact Form Handler",
    status: "success" as ExecutionStatus,
    trigger: "form" as TriggerType,
    startTime: "Yesterday, 2:00 PM",
    endTime: "Yesterday, 2:00 PM",
    duration: "1.5s",
    summary: "Created task in Asana from form submission",
    triggerSource: "Contact form",
    steps: [
      { id: "s1", name: "Parse Form Data", status: "success" as const, output: "Extracted form fields" },
      { id: "s2", name: "Create Asana Task", status: "success" as const, output: "Task created in inbox project" },
    ],
    inputData: { name: "Alex Johnson", message: "Interested in demo" },
    outputData: { taskId: "asana_task_123" },
  },
  {
    id: "7",
    executionId: "exec_g2h3i4j7",
    workflowName: "New Lead Autoresponder",
    status: "success" as ExecutionStatus,
    trigger: "email" as TriggerType,
    startTime: "2 days ago, 10:30 AM",
    endTime: "2 days ago, 10:30 AM",
    duration: "2.1s",
    summary: "Sent automated response email",
    triggerSource: "New email received",
    steps: [
      { id: "s1", name: "Parse Email", status: "success" as const, output: "Extracted sender info" },
      { id: "s2", name: "Generate Response", status: "success" as const, output: "Created personalized reply" },
      { id: "s3", name: "Send Email", status: "success" as const, output: "Email sent successfully" },
    ],
    inputData: { from: "prospect@company.com", subject: "Inquiry" },
    outputData: { messageId: "msg_abc123" },
  },
];

const mockWorkflows = [
  { id: "1", name: "Lead Intake → CRM" },
  { id: "2", name: "Stripe Payment Notifier" },
  { id: "3", name: "Slack Support Router" },
  { id: "4", name: "Daily Report Generator" },
  { id: "5", name: "Contact Form Handler" },
  { id: "6", name: "New Lead Autoresponder" },
];

const Executions = () => {
  const [selectedExecution, setSelectedExecution] = useState<typeof mockExecutions[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDetails = (execution: typeof mockExecutions[0]) => {
    setSelectedExecution(execution);
    setDrawerOpen(true);
  };

  const showEmptyState = mockExecutions.length === 0;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Executions</h1>
          <p className="text-muted-foreground mt-1">
            View recent workflow runs and diagnose automation activity.
          </p>
        </motion.div>

        {showEmptyState ? (
          <ExecutionEmptyState />
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ExecutionFilters workflows={mockWorkflows} />
            </motion.div>

            {/* Execution count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-muted-foreground"
            >
              Showing <span className="text-foreground font-medium">{mockExecutions.length}</span> executions
            </motion.p>

            {/* Executions Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {mockExecutions.map((execution, index) => (
                <motion.div
                  key={execution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                >
                  <ExecutionItemCard
                    {...execution}
                    onViewDetails={() => handleViewDetails(execution)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Details Drawer */}
      <ExecutionDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        execution={selectedExecution}
      />
    </AppShell>
  );
};

export default Executions;
