import { useState, useEffect, useCallback } from "react";
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
  Settings,
  Bell,
  Server,
  Link2,
  Cpu,
  Timer,
  GitBranch,
  FileText,
  Phone
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

// Action category definitions
const actionCategories = [
  { value: "notifications", label: "Notifications", icon: Bell, description: "Send emails, messages, SMS" },
  { value: "data", label: "Data Operations", icon: Database, description: "Insert, update, query data" },
  { value: "integrations", label: "Integrations", icon: Link2, description: "Connect to external services" },
  { value: "logic", label: "Logic / Utilities", icon: Cpu, description: "Delays, branching, transforms" },
];

// Action types per category
const actionTypesByCategory: Record<string, Array<{ value: string; label: string; icon: React.ElementType }>> = {
  notifications: [
    { value: "send_email", label: "Send Email", icon: Mail },
    { value: "slack_message", label: "Send Slack Message", icon: MessageSquare },
    { value: "send_sms", label: "Send SMS", icon: Phone },
  ],
  data: [
    { value: "database_insert", label: "Insert Database Record", icon: Database },
    { value: "database_update", label: "Update Database Record", icon: Database },
    { value: "append_sheet", label: "Append to Google Sheet", icon: FileText },
  ],
  integrations: [
    { value: "http_request", label: "HTTP Request", icon: Server },
    { value: "crm_create", label: "Create CRM Contact", icon: Link2 },
    { value: "notion_add", label: "Add to Notion", icon: FileText },
  ],
  logic: [
    { value: "delay", label: "Delay", icon: Timer },
    { value: "branch", label: "Conditional Branch", icon: GitBranch },
    { value: "transform", label: "Transform Data", icon: Settings },
  ],
};

// Get category from action type
const getCategoryFromType = (type: string): string => {
  for (const [category, types] of Object.entries(actionTypesByCategory)) {
    if (types.some(t => t.value === type)) {
      return category;
    }
  }
  return "notifications";
};

// Trigger type options
const triggerTypeOptions = [
  { value: "webhook", label: "Webhook", description: "Runs when a webhook URL is called", icon: Webhook },
  { value: "schedule", label: "Schedule", description: "Runs on a set schedule", icon: Clock },
  { value: "manual", label: "Manual", description: "Runs when triggered manually", icon: Hand },
  { value: "event", label: "When something happens", description: "Runs when a specific event occurs", icon: Zap },
];

// Types
type TriggerType = "webhook" | "schedule" | "manual" | "event";

interface Action {
  id: string;
  type: string;
  category: string;
  config: Record<string, unknown>;
}

interface Trigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

interface WorkflowState {
  name: string;
  description: string;
  intent: string;
  active: boolean;
  trigger: Trigger;
  actions: Action[];
}

// Mock workflow data
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
  trigger: { type: "webhook" as TriggerType, config: { path: "/new-user", method: "POST" } },
  actions: [
    { id: "action_1", type: "send_email", category: "notifications", config: { to: "{{user.email}}", subject: "Welcome to Synth!", body: "Hi {{user.name}}, welcome aboard!" } },
    { id: "action_2", type: "slack_message", category: "notifications", config: { channel: "#new-users", message: "New user signed up: {{user.name}}" } },
    { id: "action_3", type: "database_insert", category: "data", config: { table: "user_events", data: { event: "signup", user_id: "{{user.id}}" } } },
  ],
};

// Get default config for action type
const getDefaultConfig = (type: string): Record<string, unknown> => {
  switch (type) {
    case "send_email":
      return { to: "", subject: "", body: "" };
    case "slack_message":
      return { channel: "", message: "" };
    case "send_sms":
      return { phoneNumber: "", message: "" };
    case "database_insert":
    case "database_update":
      return { table: "", fields: [{ key: "", value: "" }] };
    case "append_sheet":
      return { sheetId: "", sheetName: "", row: [{ column: "", value: "" }] };
    case "http_request":
      return { url: "", method: "POST", headers: {}, body: "" };
    case "crm_create":
      return { crm: "hubspot", firstName: "", lastName: "", email: "", company: "" };
    case "notion_add":
      return { databaseId: "", properties: [{ name: "", value: "" }] };
    case "delay":
      return { duration: 5, unit: "seconds" };
    case "branch":
      return { condition: "", trueBranch: "", falseBranch: "" };
    case "transform":
      return { input: "", operation: "uppercase", output: "" };
    default:
      return {};
  }
};

const WorkflowEdit = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const isReadOnly = mockWorkflow.readOnly;

  // Unified workflow state
  const [workflowState, setWorkflowState] = useState<WorkflowState>(() => ({
    name: mockWorkflow.name,
    description: mockWorkflow.description || "",
    intent: mockWorkflow.intent || "",
    active: mockWorkflow.active,
    trigger: mockWorkflow.trigger,
    actions: mockWorkflow.actions.map(a => ({
      ...a,
      category: a.category || getCategoryFromType(a.type)
    })),
  }));

  // JSON strings for Advanced editing (derived from workflowState)
  const [triggerJson, setTriggerJson] = useState("");
  const [actionsJson, setActionsJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Sync JSON strings when workflowState changes (Basic -> Advanced)
  useEffect(() => {
    setTriggerJson(JSON.stringify(workflowState.trigger, null, 2));
    // Remove category from JSON display (internal field)
    const actionsForJson = workflowState.actions.map(({ category, ...rest }) => rest);
    setActionsJson(JSON.stringify(actionsForJson, null, 2));
  }, [workflowState]);

  // Parse JSON and update workflowState (Advanced -> Basic)
  const applyJsonChanges = useCallback(() => {
    try {
      const parsedTrigger = JSON.parse(triggerJson);
      const parsedActions = JSON.parse(actionsJson);
      
      // Add category back to actions
      const actionsWithCategory = parsedActions.map((a: Omit<Action, 'category'>) => ({
        ...a,
        category: getCategoryFromType(a.type)
      }));

      setWorkflowState(prev => ({
        ...prev,
        trigger: parsedTrigger,
        actions: actionsWithCategory,
      }));
      setJsonError(null);
    } catch (e) {
      setJsonError("Invalid JSON format. Please check your syntax.");
    }
  }, [triggerJson, actionsJson]);

  // Auto-apply JSON changes when switching tabs from Advanced to Basic
  useEffect(() => {
    if (activeTab === "basic") {
      applyJsonChanges();
    }
  }, [activeTab, applyJsonChanges]);

  // Update basic info fields
  const updateBasicField = (field: keyof Pick<WorkflowState, 'name' | 'description' | 'intent' | 'active'>, value: string | boolean) => {
    setWorkflowState(prev => ({ ...prev, [field]: value }));
  };

  // Update trigger
  const updateTrigger = (updates: Partial<Trigger>) => {
    setWorkflowState(prev => ({
      ...prev,
      trigger: { ...prev.trigger, ...updates }
    }));
  };

  const updateTriggerConfig = (field: string, value: unknown) => {
    setWorkflowState(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        config: { ...prev.trigger.config, [field]: value }
      }
    }));
  };

  // Action management
  const addAction = () => {
    const newAction: Action = {
      id: `action_${Date.now()}`,
      type: "",
      category: "",
      config: {}
    };
    setWorkflowState(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeAction = (actionId: string) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== actionId)
    }));
  };

  const updateActionCategory = (actionId: string, category: string) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => {
        if (a.id === actionId) {
          return { ...a, category, type: "", config: {} };
        }
        return a;
      })
    }));
  };

  const updateActionType = (actionId: string, type: string) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => {
        if (a.id === actionId) {
          return { ...a, type, config: getDefaultConfig(type) };
        }
        return a;
      })
    }));
  };

  const updateActionConfig = (actionId: string, field: string, value: unknown) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => {
        if (a.id === actionId) {
          return { ...a, config: { ...a.config, [field]: value } };
        }
        return a;
      })
    }));
  };

  const handleSave = () => {
    const saveData = {
      name: workflowState.name,
      description: workflowState.description,
      intent: workflowState.intent,
      active: workflowState.active,
      trigger: workflowState.trigger,
      actions: workflowState.actions.map(({ category, ...rest }) => rest),
    };
    console.log("Saving workflow:", saveData);
    toast.success("Changes saved successfully", {
      description: "Your workflow has been updated."
    });
  };

  // Render action fields based on type
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

      case "send_sms":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Phone Number</Label>
              <Input
                value={(config.phoneNumber as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "phoneNumber", e.target.value)}
                placeholder="+1234567890"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Message</Label>
              <Textarea
                value={(config.message as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "message", e.target.value)}
                placeholder="Enter SMS message"
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
            <div>
              <Label className="text-xs text-muted-foreground">Fields (key=value, one per line)</Label>
              <Textarea
                value={(config.fieldsText as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "fieldsText", e.target.value)}
                placeholder="name={{user.name}}&#10;email={{user.email}}"
                disabled={isReadOnly}
                className="mt-1 min-h-[80px] font-mono text-sm"
              />
            </div>
          </div>
        );

      case "append_sheet":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Sheet ID</Label>
              <Input
                value={(config.sheetId as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "sheetId", e.target.value)}
                placeholder="1BxiM..."
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Sheet Name</Label>
              <Input
                value={(config.sheetName as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "sheetName", e.target.value)}
                placeholder="Sheet1"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Row Data (column=value, one per line)</Label>
              <Textarea
                value={(config.rowText as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "rowText", e.target.value)}
                placeholder="Name={{user.name}}&#10;Email={{user.email}}"
                disabled={isReadOnly}
                className="mt-1 min-h-[80px] font-mono text-sm"
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
            <div>
              <Label className="text-xs text-muted-foreground">Request Body</Label>
              <Textarea
                value={(config.body as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "body", e.target.value)}
                placeholder='{"key": "value"}'
                disabled={isReadOnly}
                className="mt-1 min-h-[80px] font-mono text-sm"
              />
            </div>
          </div>
        );

      case "crm_create":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">CRM Platform</Label>
              <Select
                value={(config.crm as string) || "hubspot"}
                onValueChange={(value) => updateActionConfig(action.id, "crm", value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hubspot">HubSpot</SelectItem>
                  <SelectItem value="salesforce">Salesforce</SelectItem>
                  <SelectItem value="pipedrive">Pipedrive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">First Name</Label>
                <Input
                  value={(config.firstName as string) || ""}
                  onChange={(e) => updateActionConfig(action.id, "firstName", e.target.value)}
                  placeholder="{{user.firstName}}"
                  disabled={isReadOnly}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Name</Label>
                <Input
                  value={(config.lastName as string) || ""}
                  onChange={(e) => updateActionConfig(action.id, "lastName", e.target.value)}
                  placeholder="{{user.lastName}}"
                  disabled={isReadOnly}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                value={(config.email as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "email", e.target.value)}
                placeholder="{{user.email}}"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input
                value={(config.company as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "company", e.target.value)}
                placeholder="{{user.company}}"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
          </div>
        );

      case "notion_add":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Database ID</Label>
              <Input
                value={(config.databaseId as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "databaseId", e.target.value)}
                placeholder="abc123..."
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Properties (name=value, one per line)</Label>
              <Textarea
                value={(config.propertiesText as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "propertiesText", e.target.value)}
                placeholder="Title={{title}}&#10;Status=New"
                disabled={isReadOnly}
                className="mt-1 min-h-[80px] font-mono text-sm"
              />
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Duration</Label>
                <Input
                  type="number"
                  value={(config.duration as number) || 5}
                  onChange={(e) => updateActionConfig(action.id, "duration", parseInt(e.target.value) || 0)}
                  placeholder="5"
                  disabled={isReadOnly}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Unit</Label>
                <Select
                  value={(config.unit as string) || "seconds"}
                  onValueChange={(value) => updateActionConfig(action.id, "unit", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "branch":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Condition</Label>
              <Input
                value={(config.condition as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "condition", e.target.value)}
                placeholder="{{user.plan}} == 'premium'"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">If True (action ID or label)</Label>
              <Input
                value={(config.trueBranch as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "trueBranch", e.target.value)}
                placeholder="send_premium_email"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">If False (action ID or label)</Label>
              <Input
                value={(config.falseBranch as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "falseBranch", e.target.value)}
                placeholder="send_standard_email"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
          </div>
        );

      case "transform":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Input Value</Label>
              <Input
                value={(config.input as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "input", e.target.value)}
                placeholder="{{user.name}}"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Operation</Label>
              <Select
                value={(config.operation as string) || "uppercase"}
                onValueChange={(value) => updateActionConfig(action.id, "operation", value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uppercase">Uppercase</SelectItem>
                  <SelectItem value="lowercase">Lowercase</SelectItem>
                  <SelectItem value="trim">Trim Whitespace</SelectItem>
                  <SelectItem value="split">Split by Delimiter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Output Variable</Label>
              <Input
                value={(config.output as string) || ""}
                onChange={(e) => updateActionConfig(action.id, "output", e.target.value)}
                placeholder="transformedName"
                disabled={isReadOnly}
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        if (!action.type) {
          return (
            <p className="text-sm text-muted-foreground italic">
              Select an action type above to configure this action.
            </p>
          );
        }
        return (
          <p className="text-sm text-muted-foreground">
            Configure this action in Advanced Editing mode.
          </p>
        );
    }
  };

  const getActionIcon = (type: string) => {
    for (const types of Object.values(actionTypesByCategory)) {
      const found = types.find(t => t.value === type);
      if (found) {
        const Icon = found.icon;
        return <Icon className="w-4 h-4 text-primary" />;
      }
    }
    return <Settings className="w-4 h-4 text-primary" />;
  };

  const getCategoryIcon = (category: string) => {
    const cat = actionCategories.find(c => c.value === category);
    if (cat) {
      const Icon = cat.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Settings className="w-4 h-4" />;
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
                    value={workflowState.name}
                    onChange={(e) => updateBasicField("name", e.target.value)}
                    placeholder="Enter workflow name"
                    disabled={isReadOnly}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={workflowState.description}
                    onChange={(e) => updateBasicField("description", e.target.value)}
                    placeholder="Describe what this workflow does"
                    disabled={isReadOnly}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="intent">Intent / Purpose</Label>
                  <Textarea
                    id="intent"
                    value={workflowState.intent}
                    onChange={(e) => updateBasicField("intent", e.target.value)}
                    placeholder="What is the goal of this workflow?"
                    disabled={isReadOnly}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="active">Active Status</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {workflowState.active ? "Workflow is currently active" : "Workflow is currently inactive"}
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={workflowState.active}
                    onCheckedChange={(checked) => updateBasicField("active", checked)}
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
                          onClick={() => !isReadOnly && updateTrigger({ type: option.value as TriggerType, config: {} })}
                          disabled={isReadOnly}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            workflowState.trigger.type === option.value
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-border bg-muted/20"
                          } ${isReadOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${workflowState.trigger.type === option.value ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-medium ${workflowState.trigger.type === option.value ? "text-primary" : "text-foreground"}`}>
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
                {workflowState.trigger.type === "webhook" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <Label>Webhook Path</Label>
                    <Input
                      value={(workflowState.trigger.config?.path as string) || ""}
                      onChange={(e) => updateTriggerConfig("path", e.target.value)}
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
                {workflowState.trigger.type === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2 space-y-3"
                  >
                    <div>
                      <Label>Frequency</Label>
                      <Select
                        value={(workflowState.trigger.config?.frequency as string) || "daily"}
                        onValueChange={(value) => updateTriggerConfig("frequency", value)}
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
                        value={(workflowState.trigger.config?.time as string) || "09:00"}
                        onChange={(e) => updateTriggerConfig("time", e.target.value)}
                        disabled={isReadOnly}
                        className="mt-1"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Manual Config */}
                {workflowState.trigger.type === "manual" && (
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

              {workflowState.actions.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    No actions configured. Add an action to define what happens when this workflow runs.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflowState.actions.map((action, idx) => (
                    <div
                      key={action.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-medium text-primary">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-medium text-foreground">Action Step</span>
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

                      {/* Category Selection */}
                      <div className="mb-4">
                        <Label className="text-xs text-muted-foreground mb-2 block">Action Category</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {actionCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.value}
                                onClick={() => !isReadOnly && updateActionCategory(action.id, cat.value)}
                                disabled={isReadOnly}
                                className={`p-2 rounded-lg border text-left transition-all ${
                                  action.category === cat.value
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 hover:border-border bg-background/50"
                                } ${isReadOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className={`w-4 h-4 ${action.category === cat.value ? "text-primary" : "text-muted-foreground"}`} />
                                  <span className={`text-xs font-medium ${action.category === cat.value ? "text-primary" : "text-foreground"}`}>
                                    {cat.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Type Selection (based on category) */}
                      {action.category && (
                        <div className="mb-4">
                          <Label className="text-xs text-muted-foreground mb-2 block">Action Type</Label>
                          <Select
                            value={action.type || ""}
                            onValueChange={(value) => updateActionType(action.id, value)}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select action type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypesByCategory[action.category]?.map((opt) => (
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
                      )}

                      {/* Action Config Fields */}
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

            {/* JSON Error */}
            {jsonError && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {jsonError}
                </AlertDescription>
              </Alert>
            )}

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

            {/* Apply JSON Button */}
            <div className="flex justify-start">
              <Button variant="outline" onClick={applyJsonChanges} disabled={isReadOnly}>
                Apply JSON Changes
              </Button>
            </div>

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
