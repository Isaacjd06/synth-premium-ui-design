import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Zap, 
  ZapOff,
  Trash2, 
  Loader2, 
  ArrowLeft,
  Target,
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Clock,
  FileText,
  Settings,
  Pencil,
  CheckCircle,
  XCircle,
  Info,
  Server
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/utils";

// Mock data with extended fields
const mockWorkflow = {
  id: "wf_abc123",
  name: "Send Welcome Email",
  description: "Automatically sends a welcome email when a new user signs up to the platform.",
  intent: "Greet new users and provide them with onboarding information to help them get started.",
  status: "inactive",
  active: false,
  readOnly: false,
  created_at: "2025-01-10T10:00:00Z",
  updated_at: "2025-01-15T14:30:00Z",
  last_deployed_at: "2025-01-12T09:00:00Z",
  pipedream_deployment_state: "deployed",
  n8n_workflow_id: "n8n_wf_789xyz",
  trigger: { type: "webhook", config: { path: "/new-user", method: "POST" } },
  actions: [
    { id: "action_1", type: "send_email", config: { to: "{{user.email}}", subject: "Welcome to Synth!", body: "Hi {{user.name}}, welcome aboard!" } },
    { id: "action_2", type: "slack_message", config: { channel: "#new-users", message: "New user signed up: {{user.name}}" } },
    { id: "action_3", type: "database_insert", config: { table: "user_events", data: { event: "signup", user_id: "{{user.id}}" } } },
  ],
};

const mockExecutions = [
  {
    id: "exec_1",
    status: "success",
    created_at: "2025-01-15T15:45:00Z",
    finished_at: "2025-01-15T15:45:02Z",
    duration: "2s",
    summary: "Successfully sent welcome email to test@example.com",
  },
  {
    id: "exec_2",
    status: "error",
    created_at: "2025-01-14T14:30:00Z",
    finished_at: "2025-01-14T14:30:01Z",
    duration: "1s",
    summary: "Failed to send email: Invalid email address format",
    errorMessage: "The email address provided was not in a valid format.",
  },
  {
    id: "exec_3",
    status: "success",
    created_at: "2025-01-13T10:15:00Z",
    finished_at: "2025-01-13T10:15:03Z",
    duration: "3s",
    summary: "Successfully processed signup for another@example.com",
  },
];

// Helper function to get human-readable trigger description
const getTriggerDescription = (trigger: { type: string; config?: Record<string, unknown> }) => {
  const descriptions: { type: string; text: string; details?: string[] }[] = [];
  
  switch (trigger.type) {
    case "webhook":
      descriptions.push({
        type: "Webhook",
        text: "This workflow runs when a webhook is called.",
        details: trigger.config?.path ? [`Webhook Path: ${trigger.config.path}`] : undefined
      });
      break;
    case "schedule":
      descriptions.push({
        type: "Schedule",
        text: "This workflow runs on a schedule.",
        details: trigger.config?.cron ? [`Schedule: ${trigger.config.cron}`] : undefined
      });
      break;
    case "email":
      descriptions.push({
        type: "Email",
        text: "This workflow runs when an email is received."
      });
      break;
    case "manual":
      descriptions.push({
        type: "Manual",
        text: "This workflow runs when triggered manually."
      });
      break;
    default:
      descriptions.push({
        type: trigger.type || "Unknown",
        text: `This workflow runs when triggered by: ${trigger.type || "Unknown trigger"}`
      });
  }
  
  return descriptions[0];
};

// Helper function to get action icon
const getActionIcon = (type: string) => {
  switch (type) {
    case "send_email":
      return <Mail className="w-4 h-4 text-primary" />;
    case "slack_message":
      return <MessageSquare className="w-4 h-4 text-primary" />;
    case "database_insert":
    case "database_update":
      return <Database className="w-4 h-4 text-primary" />;
    default:
      return <Settings className="w-4 h-4 text-primary" />;
  }
};

// Helper function to get human-readable action description
const getActionDescription = (action: { id: string; type: string; config?: Record<string, unknown> }) => {
  const config = action.config || {};
  
  switch (action.type) {
    case "send_email":
      return {
        title: "Send Email",
        details: [
          config.to && `To: ${config.to}`,
          config.subject && `Subject: ${config.subject}`,
        ].filter(Boolean) as string[]
      };
    case "slack_message":
      return {
        title: "Send Slack Message",
        details: [
          config.channel && `Channel: ${config.channel}`,
          config.message && `Message: ${String(config.message).substring(0, 50)}${String(config.message).length > 50 ? '...' : ''}`,
        ].filter(Boolean) as string[]
      };
    case "database_insert":
      return {
        title: "Insert Database Record",
        details: [
          config.table && `Table: ${config.table}`,
        ].filter(Boolean) as string[]
      };
    case "database_update":
      return {
        title: "Update Database Record",
        details: [
          config.table && `Table: ${config.table}`,
        ].filter(Boolean) as string[]
      };
    default:
      return {
        title: action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        details: []
      };
  }
};

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

  const handleToggleActive = async () => {
    setIsActivating(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const newStatus = workflow.active ? "inactive" : "active";
    setWorkflow({ ...workflow, status: newStatus, active: !workflow.active });
    setIsActivating(false);
    toast.success(workflow.active ? "Workflow deactivated" : "Workflow activated successfully");
  };

  const handleOpenRunDialog = () => {
    setInputData("");
    setInputDataError(null);
    setLastExecution(null);
    setIsRunDialogOpen(true);
  };

  const handleRun = async () => {
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
      description: `Deleted: ${workflow.name}`
    });
    setIsDeleting(false);
    navigate("/app/workflows");
  };

  const triggerInfo = getTriggerDescription(workflow.trigger);
  const hasDeploymentInfo = workflow.pipedream_deployment_state || workflow.last_deployed_at;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-4xl">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/app/workflows">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workflows
          </Link>
        </Button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground break-words">
                {workflow.name}
              </h1>
              <StatusBadge variant={workflow.active ? "active" : "inactive"}>
                {workflow.active ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
            {workflow.intent && (
              <p className="text-muted-foreground text-sm">{workflow.intent}</p>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              Created: {formatDate(workflow.created_at)} · Last Updated: {formatDate(workflow.updated_at)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleOpenRunDialog} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
            <Button 
              variant="outline" 
              onClick={handleToggleActive} 
              disabled={isActivating}
            >
              {isActivating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
              ) : workflow.active ? (
                <><ZapOff className="w-4 h-4 mr-2" />Deactivate</>
              ) : (
                <><Zap className="w-4 h-4 mr-2" />Activate</>
              )}
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

        {/* Purpose Card */}
        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Purpose</h2>
          </div>
          {workflow.intent || workflow.description ? (
            <div className="space-y-2">
              {workflow.intent && (
                <p className="text-sm text-foreground/80">{workflow.intent}</p>
              )}
              {workflow.description && workflow.description !== workflow.intent && (
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided.</p>
          )}
        </AppCard>

        {/* Trigger Card */}
        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Webhook className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Trigger</h2>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                {triggerInfo.type}
              </span>
            </div>
            <p className="text-sm text-foreground/80">{triggerInfo.text}</p>
            {triggerInfo.details && triggerInfo.details.length > 0 && (
              <ul className="mt-2 space-y-1">
                {triggerInfo.details.map((detail, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AppCard>

        {/* Actions Card */}
        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Actions</h2>
          </div>
          {workflow.actions && workflow.actions.length > 0 ? (
            <div className="space-y-3">
              {workflow.actions.map((action, idx) => {
                const actionInfo = getActionDescription(action);
                return (
                  <div 
                    key={action.id} 
                    className="p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-medium text-primary">
                        {idx + 1}
                      </div>
                      {getActionIcon(action.type)}
                      <span className="text-sm font-medium text-foreground">{actionInfo.title}</span>
                    </div>
                    {actionInfo.details.length > 0 && (
                      <ul className="ml-9 space-y-1">
                        {actionInfo.details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="text-xs text-muted-foreground">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No actions configured.</p>
          )}
        </AppCard>

        {/* Deployment Info Card - Only show if data exists */}
        {hasDeploymentInfo && (
          <AppCard className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">Deployment Info</h2>
            </div>
            <div className="space-y-2 text-sm">
              {workflow.pipedream_deployment_state && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded capitalize">
                    {workflow.pipedream_deployment_state}
                  </span>
                </div>
              )}
              {workflow.last_deployed_at && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Last Deployed:</span>
                  <span className="text-foreground/80">{formatDateTime(workflow.last_deployed_at)}</span>
                </div>
              )}
            </div>
          </AppCard>
        )}

        {/* Metadata Card */}
        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Workflow ID:</span>
              <p className="text-foreground/80 font-mono text-xs mt-0.5">{workflow.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="text-foreground/80 mt-0.5">{formatDateTime(workflow.created_at)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <p className="text-foreground/80 mt-0.5">{formatDateTime(workflow.updated_at)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Read-Only:</span>
              <p className="text-foreground/80 mt-0.5">{workflow.readOnly ? "Yes" : "No"}</p>
            </div>
            {workflow.n8n_workflow_id && (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Backend Reference:</span>
                <p className="text-foreground/80 font-mono text-xs mt-0.5">{workflow.n8n_workflow_id}</p>
              </div>
            )}
          </div>
        </AppCard>

        {/* Edit Workflow Card */}
        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pencil className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Edit Workflow</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Make changes to this workflow's configuration, triggers, and actions.
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button 
                    variant="outline"
                    disabled={workflow.readOnly}
                    onClick={() => toast.info("Workflow editor coming soon")}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Workflow
                  </Button>
                </span>
              </TooltipTrigger>
              {workflow.readOnly && (
                <TooltipContent>
                  <p>This workflow is read-only and cannot be edited.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </AppCard>

        {/* Execution History */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Execution History</h2>
          </div>
          
          {mockExecutions.length === 0 ? (
            <AppCard>
              <p className="text-muted-foreground text-center py-4">No executions yet.</p>
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
                      {execution.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <StatusBadge variant={execution.status === "success" ? "success" : "error"}>
                          {execution.status === "success" ? "Success" : "Error"}
                        </StatusBadge>
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        <span>{formatDateTime(execution.created_at)}</span>
                        <span className="mx-2">·</span>
                        <span>Duration: {execution.duration}</span>
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
                      className="mt-4 space-y-3"
                    >
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-medium text-foreground">Summary</h4>
                        </div>
                        <p className="text-sm text-foreground/80">{execution.summary}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Started</span>
                          <p className="text-foreground/80">{formatDateTime(execution.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Finished</span>
                          <p className="text-foreground/80">{formatDateTime(execution.finished_at)}</p>
                        </div>
                      </div>

                      {execution.errorMessage && (
                        <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/50">
                          <h4 className="text-sm font-medium text-red-400 mb-1">Error Details</h4>
                          <p className="text-sm text-red-400/80">{execution.errorMessage}</p>
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
                <Label>Input Data (optional)</Label>
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
                  <h4 className="text-sm font-medium text-green-400 mb-2">Execution Complete</h4>
                  <div className="space-y-1 text-xs text-foreground">
                    <p>Status: <span className="text-green-400">{lastExecution.status}</span></p>
                    <p>Finished: {formatDateTime(lastExecution.finished_at)}</p>
                  </div>
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
