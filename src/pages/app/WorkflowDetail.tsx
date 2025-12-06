import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";

// Mock data
const mockWorkflow = {
  id: "1",
  name: "Send Welcome Email",
  description: "Automatically sends a welcome email when a new user signs up to the platform.",
  status: "active",
  trigger: { type: "webhook", config: { path: "/new-user" } },
  actions: [
    { type: "send_email", config: { to: "{{user.email}}", subject: "Welcome!" } },
  ],
};

const mockExecutions = [
  {
    id: "1",
    status: "success",
    createdAt: "Jan 15, 2025, 3:45 PM",
    finishedAt: "Jan 15, 2025, 3:45 PM",
    inputData: { user: { email: "test@example.com", name: "Test User" } },
    outputData: { success: true, messageId: "msg_123" },
  },
  {
    id: "2",
    status: "error",
    createdAt: "Jan 14, 2025, 2:30 PM",
    finishedAt: "Jan 14, 2025, 2:30 PM",
    inputData: { user: { email: "invalid", name: "Bad User" } },
    outputData: { error: "Invalid email address" },
    errorMessage: "Failed to send email: Invalid email address format",
  },
  {
    id: "3",
    status: "success",
    createdAt: "Jan 13, 2025, 10:15 AM",
    finishedAt: "Jan 13, 2025, 10:15 AM",
    inputData: { user: { email: "another@example.com", name: "Another User" } },
    outputData: { success: true, messageId: "msg_456" },
  },
];

const WorkflowDetail = () => {
  const { id } = useParams();
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunWorkflow = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1500);
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground break-words">
                {mockWorkflow.name}
              </h1>
              <StatusBadge variant={mockWorkflow.status === "active" ? "active" : "inactive"}>
                {mockWorkflow.status === "active" ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
            {mockWorkflow.description && (
              <p className="text-muted-foreground break-words">{mockWorkflow.description}</p>
            )}
          </div>
          <Button onClick={handleRunWorkflow} disabled={isRunning} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run Workflow"}
          </Button>
        </div>

        {/* Metadata */}
        <AppCard className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Workflow Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Trigger</h3>
              <pre className="bg-background/40 p-4 rounded-lg text-xs sm:text-sm font-mono text-foreground overflow-x-auto">
                {JSON.stringify(mockWorkflow.trigger, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Actions</h3>
              <pre className="bg-background/40 p-4 rounded-lg text-xs sm:text-sm font-mono text-foreground overflow-x-auto">
                {JSON.stringify(mockWorkflow.actions, null, 2)}
              </pre>
            </div>
          </div>
        </AppCard>

        {/* Execution History */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">Execution History</h2>
          
          {mockExecutions.length === 0 ? (
            <AppCard>
              <p className="text-muted-foreground text-center">No executions yet.</p>
            </AppCard>
          ) : (
            <div className="space-y-3">
              {mockExecutions.map((execution) => (
                <AppCard key={execution.id} className="p-4">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                    onClick={() => setExpandedExecution(
                      expandedExecution === execution.id ? null : execution.id
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge variant={execution.status === "success" ? "success" : "error"}>
                        {execution.status === "success" ? "Success" : "Error"}
                      </StatusBadge>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        <span>Started: {execution.createdAt}</span>
                        {execution.finishedAt && (
                          <span className="hidden sm:inline"> · Finished: {execution.finishedAt}</span>
                        )}
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-muted transition-colors self-end sm:self-auto">
                      {expandedExecution === execution.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
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
      </div>
    </AppShell>
  );
};

export default WorkflowDetail;
