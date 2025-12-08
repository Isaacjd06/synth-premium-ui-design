import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  AlertTriangle,
  Save,
  X,
  Webhook,
  Clock,
  Hand,
  Zap,
  Mail,
  MessageSquare,
  Database,
  Plus,
  Trash2,
  Settings
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Mock workflow data (same as in WorkflowDetail)
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

type TriggerType = "webhook" | "schedule" | "manual" | "event";
type ActionType = "send_email" | "slack_message" | "database_insert" | "database_update" | "http_request";

interface Action {
  id: string;
  type: ActionType;
  config: Record<string, unknown>;
}

interface Trigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

const triggerTypeOptions = [
  { value: "webhook", label: "Webhook", description: "Runs when a webhook URL is called", icon: Webhook },
  { value: "schedule", label: "Schedule", description: "Runs on a set schedule", icon: Clock },
  { value: "manual", label: "Manual", description: "Runs when triggered manually", icon: Hand },
  { value: "event", label: "When something happens", description: "Runs when a specific event occurs", icon: Zap },
];

const actionTypeOptions = [
  { value: "send_email", label: "Send Email", icon: Mail },
  { value: "slack_message", label: "Send Slack Message", icon: MessageSquare },
  { value: "database_insert", label: "Insert Database Record", icon: Database },
  { value: "database_update", label: "Update Database Record", icon: Database },
  { value: "http_request", label: "HTTP Request", icon: Settings },
];

const getActionIcon = (type: string) => {
  const option = actionTypeOptions.find(o => o.value === type);
  if (option) {
    const Icon = option.icon;
    return <Icon className="w-4 h-4 text-primary" />;
  }
  return <Settings className="w-4 h-4 text-primary" />;
};

const getActionLabel = (type: string) => {
  const option = actionTypeOptions.find(o => o.value === type);
  return option?.label || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const WorkflowEdit = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [name, setName] = useState(mockWorkflow.name);
  const [description, setDescription] = useState(mockWorkflow.description || "");
  const [intent, setIntent] = useState(mockWorkflow.intent || "");
  const [isActive, setIsActive] = useState(mockWorkflow.active);
  
  // Trigger state
  const [triggerType, setTriggerType] = useState<TriggerType>(mockWorkflow.trigger.type as TriggerType);
  const [webhookPath, setWebhookPath] = useState((mockWorkflow.trigger.config?.path as string) || "");
  const [scheduleFrequency, setScheduleFrequency] = useState("daily");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  
  // Actions state
  const [actions, setActions] = useState<Action[]>(mockWorkflow.actions as Action[]);
  
  // Advanced JSON editing
  const [triggerJson, setTriggerJson] = useState(JSON.stringify(mockWorkflow.trigger, null, 2));
  const [actionsJson, setActionsJson] = useState(JSON.stringify(mockWorkflow.actions, null, 2));
  
  const isReadOnly = mockWorkflow.readOnly;

  const handleSave = () => {
    toast.success("Changes saved successfully", {
      description: "Your workflow has been updated."
    });
  };

  const updateActionConfig = (actionId: string, field: string, value: string) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return {
          ...action,
          config: { ...action.config, [field]: value }
        };
      }
      return action;
    }));
  };

  const removeAction = (actionId: string) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  };

  const addAction = () => {
    const newAction: Action = {
      id: `action_${Date.now()}`,
      type: "send_email",
      config: { to: "", subject: "", body: "" }
    };
    setActions(prev => [...prev, newAction]);
  };

  const changeActionType = (actionId: string, newType: ActionType) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        let defaultConfig: Record<string, unknown> = {};
        switch (newType) {
          case "send_email":
            defaultConfig = { to: "", subject: "", body: "" };
            break;
          case "slack_message":
            defaultConfig = { channel: "", message: "" };
            break;
          case "database_insert":
          case "database_update":
            defaultConfig = { table: "", data: {} };
            break;
          case "http_request":
            defaultConfig = { url: "", method: "POST", body: "" };
            break;
        }
        return { ...action, type: newType, config: defaultConfig };
      }
      return action;
    }));
  };

  const renderActionFields = (action: Action) => {
    const config = action.config;
    
    switch (action.type) {
      case "send_email":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                value={(config.to as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "to", e.target.value)}
                placeholder="{{user.email}}"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Input
                value={(config.subject as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "subject", e.target.value)}
                placeholder="Enter email subject"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Message Body</Label>
              <Textarea
                value={(config.body as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "body", e.target.value)}
                placeholder="Enter email body"
                disabled={isReadOnly}
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
        );
      
      case "slack_message":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Channel</Label>
              <Input
                value={(config.channel as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "channel", e.target.value)}
                placeholder="#general"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Message</Label>
              <Textarea
                value={(config.message as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "message", e.target.value)}
                placeholder="Enter message"
                disabled={isReadOnly}
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
        );
      
      case "database_insert":
      case "database_update":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Table Name</Label>
              <Input
                value={(config.table as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "table", e.target.value)}
                placeholder="users"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
          </div>
        );
      
      case "http_request":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">URL</Label>
              <Input
                value={(config.url as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "url", e.target.value)}
                placeholder="https://api.example.com/endpoint"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Method</Label>
              <Select
                value={(config.method as string) || "POST"}
                onValueChange={(value) => updateActionConfig(action.id, "method", value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Configure this action in Advanced Editing mode.
          </p>
        );
    }
  };

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
          <Link to={`/app/workflows/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workflow Details
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
            Edit Workflow
          </h1>
          <p className="text-sm text-muted-foreground">
            Modify your workflow's configuration, triggers, and actions.
          </p>
        </div>

        {/* Read-Only Warning */}
        {isReadOnly && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-500">
              Your current plan does not allow editing workflows. This workflow is read-only.
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="basic">Basic Editing</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Editing</TabsTrigger>
          </TabsList>

          {/* Basic Editing Tab */}
          <TabsContent value="basic" className="space-y-4">
            {/* Basic Info Section */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Basic Info</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter workflow name"
                    disabled={isReadOnly}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this workflow does"
                    disabled={isReadOnly}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="intent">Intent / Purpose</Label>
                  <Textarea
                    id="intent"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="What is the goal of this workflow?"
                    disabled={isReadOnly}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="active">Active Status</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isActive ? "Workflow is currently active" : "Workflow is currently inactive"}
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </AppCard>

            {/* Trigger Section */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Trigger</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Define when this workflow should run.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label>Trigger Type</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {triggerTypeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => !isReadOnly && setTriggerType(option.value as TriggerType)}
                          disabled={isReadOnly}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            triggerType === option.value
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-border bg-muted/20"
                          } ${isReadOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${triggerType === option.value ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-medium ${triggerType === option.value ? "text-primary" : "text-foreground"}`}>
                              {option.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Webhook Config */}
                {triggerType === "webhook" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <Label>Webhook Path</Label>
                    <Input
                      value={webhookPath}
                      onChange={(e) => setWebhookPath(e.target.value)}
                      placeholder="/your-endpoint"
                      disabled={isReadOnly}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The URL path that will trigger this workflow.
                    </p>
                  </motion.div>
                )}

                {/* Schedule Config */}
                {triggerType === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2 space-y-3"
                  >
                    <div>
                      <Label>Frequency</Label>
                      <Select
                        value={scheduleFrequency}
                        onValueChange={setScheduleFrequency}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Every Day</SelectItem>
                          <SelectItem value="weekly">Every Week</SelectItem>
                          <SelectItem value="monthly">Every Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        disabled={isReadOnly}
                        className="mt-1"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Manual Config */}
                {triggerType === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-sm text-muted-foreground">
                        No configuration needed. This workflow will only run when you trigger it manually.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </AppCard>

            {/* Actions Section */}
            <AppCard>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-foreground">Actions</h2>
                  <p className="text-sm text-muted-foreground">
                    Define what happens when this workflow runs.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                  disabled={isReadOnly}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Action
                </Button>
              </div>

              {actions.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    No actions configured. Add an action to define what happens when this workflow runs.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actions.map((action, idx) => (
                    <div
                      key={action.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-medium text-primary">
                            {idx + 1}
                          </div>
                          <Select
                            value={action.type}
                            onValueChange={(value) => changeActionType(action.id, value as ActionType)}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger className="w-[200px] h-8">
                              <div className="flex items-center gap-2">
                                {getActionIcon(action.type)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypeOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="w-4 h-4" />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAction(action.id)}
                          disabled={isReadOnly}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {renderActionFields(action)}
                    </div>
                  ))}
                </div>
              )}
            </AppCard>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" asChild>
                <Link to={`/app/workflows/${id}`}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Link>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button onClick={handleSave} disabled={isReadOnly}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {isReadOnly && (
                    <TooltipContent>
                      <p>Your current plan does not allow editing workflows.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>

          {/* Advanced Editing Tab */}
          <TabsContent value="advanced" className="space-y-4">
            {/* Warning Banner */}
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-200">
                <strong>Advanced Mode:</strong> Only use this if you understand workflow configuration. 
                Incorrect changes may break your automation.
              </AlertDescription>
            </Alert>

            {/* Trigger JSON */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Trigger Configuration (JSON)</h2>
              <div className="relative">
                <Textarea
                  value={triggerJson}
                  onChange={(e) => setTriggerJson(e.target.value)}
                  disabled={isReadOnly}
                  className="font-mono text-sm min-h-[200px] bg-background/50 border-border/50"
                  placeholder='{"type": "webhook", "config": {}}'
                />
              </div>
            </AppCard>

            {/* Actions JSON */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Actions Configuration (JSON)</h2>
              <div className="relative">
                <Textarea
                  value={actionsJson}
                  onChange={(e) => setActionsJson(e.target.value)}
                  disabled={isReadOnly}
                  className="font-mono text-sm min-h-[300px] bg-background/50 border-border/50"
                  placeholder='[{"type": "send_email", "config": {}}]'
                />
              </div>
            </AppCard>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" asChild>
                <Link to={`/app/workflows/${id}`}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Link>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button onClick={handleSave} disabled={isReadOnly}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {isReadOnly && (
                    <TooltipContent>
                      <p>Your current plan does not allow editing workflows.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default WorkflowEdit;
