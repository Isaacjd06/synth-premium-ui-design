import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";

// Mock data
const mockExecutions = [
  {
    id: "1",
    workflowId: "1",
    workflowName: "Send Welcome Email",
    status: "success",
    createdAt: "Jan 15, 2025, 3:45 PM",
    finishedAt: "Jan 15, 2025, 3:45 PM",
    inputData: { user: { email: "test@example.com", name: "Test User" } },
    outputData: { success: true, messageId: "msg_123" },
  },
  {
    id: "2",
    workflowId: "2",
    workflowName: "Notify Slack on New Lead",
    status: "success",
    createdAt: "Jan 15, 2025, 2:30 PM",
    finishedAt: "Jan 15, 2025, 2:30 PM",
    inputData: { lead: { name: "John Doe", company: "Acme Inc" } },
    outputData: { success: true, slackTs: "1234567890.123456" },
  },
  {
    id: "3",
    workflowId: "1",
    workflowName: "Send Welcome Email",
    status: "error",
    createdAt: "Jan 14, 2025, 5:20 PM",
    finishedAt: "Jan 14, 2025, 5:20 PM",
    inputData: { user: { email: "invalid", name: "Bad User" } },
    outputData: { error: "Invalid email address" },
    errorMessage: "Failed to send email: Invalid email address format",
  },
  {
    id: "4",
    workflowId: "3",
    workflowName: "Sync CRM to Google Sheets",
    status: "success",
    createdAt: "Jan 14, 2025, 12:00 PM",
    finishedAt: "Jan 14, 2025, 12:02 PM",
    inputData: { syncType: "full", recordCount: 150 },
    outputData: { success: true, rowsUpdated: 150 },
  },
  {
    id: "5",
    workflowId: "2",
    workflowName: "Notify Slack on New Lead",
    status: "success",
    createdAt: "Jan 13, 2025, 9:15 AM",
    finishedAt: "Jan 13, 2025, 9:15 AM",
    inputData: { lead: { name: "Jane Smith", company: "Tech Corp" } },
    outputData: { success: true, slackTs: "1234567890.654321" },
  },
];

const Executions = () => {
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Executions</h1>
          <p className="text-sm text-muted-foreground">
            Recent workflow runs across Synth. <span className="text-foreground">{mockExecutions.length} total</span>
          </p>
        </div>

        {/* Executions List */}
        {mockExecutions.length === 0 ? (
          <AppCard>
            <p className="text-muted-foreground text-center py-8">No executions yet.</p>
          </AppCard>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {mockExecutions.map((execution) => (
              <AppCard key={execution.id} className="p-4">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedExecution(
                    expandedExecution === execution.id ? null : execution.id
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <StatusBadge variant={execution.status === "success" ? "success" : "error"}>
                      {execution.status === "success" ? "Success" : "Error"}
                    </StatusBadge>
                    <div>
                      <Link
                        to={`/app/workflows/${execution.workflowId}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {execution.workflowName.length > 50
                          ? execution.workflowName.slice(0, 50) + "..."
                          : execution.workflowName}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span>Started: {execution.createdAt}</span>
                        {execution.finishedAt && (
                          <span className="hidden sm:inline"> · Finished: {execution.finishedAt}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      to={`/app/workflows/${execution.workflowId}`}
                      className="text-xs sm:text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Workflow
                    </Link>
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      {expandedExecution === execution.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedExecution === execution.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Input Data</h4>
                      <pre className="bg-background/40 p-3 rounded-lg text-xs font-mono text-foreground overflow-x-auto">
                        {JSON.stringify(execution.inputData, null, 2)}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Output Data</h4>
                      <pre className="bg-background/40 p-3 rounded-lg text-xs font-mono text-foreground overflow-x-auto">
                        {JSON.stringify(execution.outputData, null, 2)}
                      </pre>
                    </div>

                    {execution.errorMessage && (
                      <div className="p-3 rounded-lg bg-red-900/20 border border-red-700">
                        <h4 className="text-sm font-medium text-red-400 mb-1">Error Message</h4>
                        <p className="text-sm text-red-400">{execution.errorMessage}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AppCard>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Executions;
