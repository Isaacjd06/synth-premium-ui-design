import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Play, Zap, Trash2, Loader2, Copy, Check } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/utils";

// Mock data
const mockWorkflow = {
  id: "1",
  name: "Send Welcome Email",
  description: "Automatically sends a welcome email when a new user signs up to the platform.",
  status: "inactive",
  n8n_workflow_id: "pd_wf_abc123xyz",
  created_at: "2025-01-10T10:00:00Z",
  updated_at: "2025-01-15T14:30:00Z",
  trigger: { type: "webhook", config: { path: "/new-user", method: "POST" } },
  actions: [
    { id: "action_1", type: "send_email", config: { to: "{{user.email}}", subject: "Welcome!" } },
  ],
};

const mockExecutions = [
  {
    id: "1",
    status: "success",
    created_at: "2025-01-15T15:45:00Z",
    finished_at: "2025-01-15T15:45:02Z",
    input_data: { user: { email: "test@example.com", name: "Test User" } },
    output_data: { success: true, messageId: "msg_123" },
  },
  {
    id: "2",
    status: "error",
    created_at: "2025-01-14T14:30:00Z",
    finished_at: "2025-01-14T14:30:01Z",
    input_data: { user: { email: "invalid", name: "Bad User" } },
    output_data: { error: "Invalid email address" },
    errorMessage: "Failed to send email: Invalid email address format",
  },
  {
    id: "3",
    status: "success",
    created_at: "2025-01-13T10:15:00Z",
    finished_at: "2025-01-13T10:15:03Z",
    input_data: { user: { email: "another@example.com", name: "Another User" } },
    output_data: { success: true, messageId: "msg_456" },
  },
];

const WorkflowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(mockWorkflow);
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  
  // Loading states
  const [isRunning, setIsRunning] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Dialogs
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Run form
  const [inputData, setInputData] = useState("");
  const [inputDataError, setInputDataError] = useState<string | null>(null);
  
  // Execution result
  const [lastExecution, setLastExecution] = useState<{
    id: string;
    data: unknown;
    finished_at: string;
    status: string;
  } | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (workflow.n8n_workflow_id) {
      navigator.clipboard.writeText(workflow.n8n_workflow_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleActivate = async () => {
    setIsActivating(true);
    await new Promise(r => setTimeout(r, 1500));
    
    setWorkflow({ ...workflow, status: "active", n8n_workflow_id: "pd_wf_" + crypto.randomUUID().slice(0, 8) });
    setIsActivating(false);
    toast.success("Workflow activated successfully", {
      description: `Pipedream Workflow ID: ${workflow.n8n_workflow_id}`
    });
  };

  const handleOpenRunDialog = () => {
    setInputData("");
    setInputDataError(null);
    setLastExecution(null);
    setIsRunDialogOpen(true);
  };

  const handleRun = async () => {
    // Validate inputData if provided
    let parsedInputData = {};
    if (inputData.trim()) {
      try {
        parsedInputData = JSON.parse(inputData);
      } catch {
        setInputDataError("Invalid JSON");
        return;
      }
    }
    setInputDataError(null);

    setIsRunning(true);
    await new Promise(r => setTimeout(r, 2000));

    // Simulate execution result
    const result = {
      id: "exec_" + crypto.randomUUID().slice(0, 8),
      data: { success: true, processed: parsedInputData },
      finished_at: new Date().toISOString(),
      status: "success",
    };

    setLastExecution(result);
    setIsRunning(false);
    toast.success("Workflow executed successfully");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    toast.success("Workflow deleted successfully", {
      description: `Deleted ID: ${workflow.id}`
    });
    setIsDeleting(false);
    navigate("/app/workflows");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "success": return "success";
      case "error": return "error";
      case "running": return "active";
      default: return "inactive";
    }
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground break-words">
                {workflow.name}
              </h1>
              <StatusBadge variant={workflow.status === "active" ? "active" : "inactive"}>
                {workflow.status === "active" ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
            {workflow.description && (
              <p className="text-muted-foreground break-words">{workflow.description}</p>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              Created: {formatDate(workflow.created_at)} · Updated: {formatDate(workflow.updated_at)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {workflow.status !== "active" && (
              <Button 
                variant="outline" 
                onClick={handleActivate} 
                disabled={isActivating}
              >
                {isActivating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Activating...</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" />Activate</>
                )}
              </Button>
            )}
            <Button onClick={handleOpenRunDialog} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Pipedream ID */}
        {workflow.n8n_workflow_id && (
          <AppCard className="mb-6 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipedream Workflow ID</p>
                <p className="font-mono text-sm text-foreground">{workflow.n8n_workflow_id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopyId}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </AppCard>
        )}

        {/* Metadata */}
        <AppCard className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Workflow Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Trigger</h3>
              {workflow.trigger ? (
                <pre className="bg-background/40 p-4 rounded-lg text-xs sm:text-sm font-mono text-foreground overflow-x-auto">
                  {JSON.stringify(workflow.trigger, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm">No trigger configured</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Actions</h3>
              {workflow.actions && workflow.actions.length > 0 ? (
                <pre className="bg-background/40 p-4 rounded-lg text-xs sm:text-sm font-mono text-foreground overflow-x-auto">
                  {JSON.stringify(workflow.actions, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm">No actions configured</p>
              )}
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
                      <StatusBadge variant={getStatusBadgeVariant(execution.status)}>
                        {execution.status === "success" ? "Success" : execution.status === "error" ? "Error" : execution.status}
                      </StatusBadge>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        <span>Started: {formatDateTime(execution.created_at)}</span>
                        {execution.finished_at && (
                          <span className="hidden sm:inline"> · Finished: {formatDateTime(execution.finished_at)}</span>
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
                          {execution.input_data ? JSON.stringify(execution.input_data, null, 2) : "null"}
                        </pre>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Output Data</h4>
                        <pre className="bg-background/40 p-3 rounded-lg text-xs font-mono text-foreground overflow-x-auto">
                          {execution.output_data ? JSON.stringify(execution.output_data, null, 2) : "null"}
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

        {/* Run Dialog */}
        <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Run Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Input Data (optional JSON)</Label>
                <Textarea
                  placeholder='{"key": "value"}'
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  className={`font-mono text-sm min-h-[120px] ${inputDataError ? "border-red-500" : ""}`}
                />
                {inputDataError && <p className="text-xs text-red-400">{inputDataError}</p>}
                <p className="text-xs text-muted-foreground">
                  Leave empty to run with no input data.
                </p>
              </div>

              {lastExecution && (
                <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10">
                  <h4 className="text-sm font-medium text-green-400 mb-2">Execution Result</h4>
                  <div className="space-y-1 text-xs text-foreground">
                    <p>ID: <span className="font-mono">{lastExecution.id}</span></p>
                    <p>Status: <span className="text-green-400">{lastExecution.status}</span></p>
                    <p>Finished: {formatDateTime(lastExecution.finished_at)}</p>
                  </div>
                  <pre className="mt-2 bg-background/40 p-2 rounded text-xs font-mono overflow-x-auto">
                    {JSON.stringify(lastExecution.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>
                {lastExecution ? "Close" : "Cancel"}
              </Button>
              {!lastExecution && (
                <Button onClick={handleRun} disabled={isRunning}>
                  {isRunning ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</>
                  ) : (
                    <><Play className="w-4 h-4 mr-2" />Run</>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{workflow.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
};

export default WorkflowDetail;
