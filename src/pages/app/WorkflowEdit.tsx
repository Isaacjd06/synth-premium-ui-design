import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  ArrowLeft,
  AlertTriangle,
  Save,
  X,
  Webhook,
  Clock,
  Hand,
  Zap,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  LayoutTemplate
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
import { ActionTemplateModal, actionTemplates, type ActionTemplate } from "@/components/workflows/ActionTemplateModal";
import { AIAssistPanel, type AISuggestion } from "@/components/workflows/AIAssistPanel";
import { ActionFieldsRenderer } from "@/components/workflows/ActionFieldsRenderer";

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
    { id: "action_1", type: "send_email", config: { to: "{{user.email}}", subject: "Welcome to Synth!", body: "Hi {{user.name}}, welcome aboard!" } },
    { id: "action_2", type: "slack_message", config: { channel: "#new-users", message: "New user signed up: {{user.name}}", includeAttachments: false } },
    { id: "action_3", type: "database_insert", config: { table: "user_events", fields: [{ key: "event", value: "signup" }, { key: "user_id", value: "{{user.id}}" }] } },
  ],
};

// Get action label from type
const getActionLabel = (type: string): string => {
  const template = actionTemplates.find(t => t.type === type);
  return template?.label || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Sortable Action Card Component
interface SortableActionCardProps {
  action: Action;
  index: number;
  isReadOnly: boolean;
  onRemove: (id: string) => void;
  onUpdateType: (id: string, type: string) => void;
  onUpdateConfig: (id: string, field: string, value: unknown) => void;
  onOpenTemplates: (replaceId: string) => void;
}

function SortableActionCard({ 
  action, 
  index, 
  isReadOnly, 
  onRemove, 
  onUpdateType,
  onUpdateConfig,
  onOpenTemplates 
}: SortableActionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 rounded-lg bg-muted/30 border border-border/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            disabled={isReadOnly}
            className={`p-1 rounded hover:bg-muted/50 cursor-grab active:cursor-grabbing ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-medium text-primary">
            {index + 1}
          </div>
          <span className="text-sm font-medium text-foreground">
            {action.type ? getActionLabel(action.type) : "New Action"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenTemplates(action.id)}
            disabled={isReadOnly}
            className="text-muted-foreground hover:text-primary"
          >
            <LayoutTemplate className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(action.id)}
            disabled={isReadOnly}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Type Selection */}
      {!action.type && (
        <div className="mb-4">
          <Label className="text-xs text-muted-foreground mb-2 block">Select Action Type</Label>
          <Select
            value={action.type || ""}
            onValueChange={(value) => onUpdateType(action.id, value)}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an action..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="send_email">Send Email</SelectItem>
              <SelectItem value="slack_message">Send Slack Message</SelectItem>
              <SelectItem value="send_sms">Send SMS</SelectItem>
              <SelectItem value="database_insert">Insert Database Record</SelectItem>
              <SelectItem value="database_update">Update Database Record</SelectItem>
              <SelectItem value="append_sheet">Append to Spreadsheet</SelectItem>
              <SelectItem value="crm_create">Create CRM Contact</SelectItem>
              <SelectItem value="notion_create">Create Notion Page</SelectItem>
              <SelectItem value="http_request">HTTP API Request</SelectItem>
              <SelectItem value="delay">Delay</SelectItem>
              <SelectItem value="branch">Condition / Branch</SelectItem>
              <SelectItem value="transform">Transform Text</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Or use the template icon above to browse all options.
          </p>
        </div>
      )}

      {/* Action Fields */}
      <ActionFieldsRenderer
        actionId={action.id}
        actionType={action.type}
        config={action.config}
        isReadOnly={isReadOnly}
        onUpdateConfig={onUpdateConfig}
      />
    </div>
  );
}

const WorkflowEdit = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const isReadOnly = mockWorkflow.readOnly;

  // Modals state
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [replaceActionId, setReplaceActionId] = useState<string | null>(null);

  // Unified workflow state
  const [workflowState, setWorkflowState] = useState<WorkflowState>(() => ({
    name: mockWorkflow.name,
    description: mockWorkflow.description || "",
    intent: mockWorkflow.intent || "",
    active: mockWorkflow.active,
    trigger: mockWorkflow.trigger,
    actions: mockWorkflow.actions,
  }));

  // JSON strings for Advanced editing
  const [triggerJson, setTriggerJson] = useState("");
  const [actionsJson, setActionsJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync JSON strings when workflowState changes
  useEffect(() => {
    setTriggerJson(JSON.stringify(workflowState.trigger, null, 2));
    setActionsJson(JSON.stringify(workflowState.actions, null, 2));
  }, [workflowState]);

  // Parse JSON and update workflowState
  const applyJsonChanges = useCallback(() => {
    try {
      const parsedTrigger = JSON.parse(triggerJson);
      const parsedActions = JSON.parse(actionsJson);
      
      setWorkflowState(prev => ({
        ...prev,
        trigger: parsedTrigger,
        actions: parsedActions,
      }));
      setJsonError(null);
    } catch (e) {
      setJsonError("Invalid JSON format. Please check your syntax.");
    }
  }, [triggerJson, actionsJson]);

  // Auto-apply JSON changes when switching tabs
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

  const updateActionType = (actionId: string, type: string) => {
    const template = actionTemplates.find(t => t.type === type);
    const defaultConfig = template?.defaultConfig || {};
    
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => {
        if (a.id === actionId) {
          return { ...a, type, config: defaultConfig };
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

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setWorkflowState(prev => {
        const oldIndex = prev.actions.findIndex(a => a.id === active.id);
        const newIndex = prev.actions.findIndex(a => a.id === over.id);
        
        return {
          ...prev,
          actions: arrayMove(prev.actions, oldIndex, newIndex)
        };
      });
    }
  };

  // Template selection handler
  const handleSelectTemplate = (template: ActionTemplate) => {
    if (replaceActionId) {
      // Replace existing action
      setWorkflowState(prev => ({
        ...prev,
        actions: prev.actions.map(a => {
          if (a.id === replaceActionId) {
            return {
              ...a,
              type: template.type,
              config: { ...template.defaultConfig }
            };
          }
          return a;
        })
      }));
      setReplaceActionId(null);
    } else {
      // Add new action
      const newAction: Action = {
        id: `action_${Date.now()}`,
        type: template.type,
        config: { ...template.defaultConfig }
      };
      setWorkflowState(prev => ({
        ...prev,
        actions: [...prev.actions, newAction]
      }));
    }
  };

  const openTemplatesForReplace = (actionId: string) => {
    setReplaceActionId(actionId);
    setTemplateModalOpen(true);
  };

  const openTemplatesForNew = () => {
    setReplaceActionId(null);
    setTemplateModalOpen(true);
  };

  // AI Assist handler
  const handleAISuggestion = (suggestion: AISuggestion) => {
    const newAction: Action = {
      id: `action_${Date.now()}`,
      type: suggestion.actionType,
      config: suggestion.config
    };
    setWorkflowState(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
    toast.success("AI suggestion applied", {
      description: suggestion.reasoning
    });
  };

  const handleSave = () => {
    const saveData = {
      name: workflowState.name,
      description: workflowState.description,
      intent: workflowState.intent,
      active: workflowState.active,
      trigger: workflowState.trigger,
      actions: workflowState.actions,
    };
    console.log("Saving workflow:", saveData);
    toast.success("Changes saved successfully", {
      description: "Your workflow has been updated."
    });
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
                    Define what happens when this workflow runs. Drag to reorder.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiAssistOpen(true)}
                    disabled={isReadOnly}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Assist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openTemplatesForNew}
                    disabled={isReadOnly}
                  >
                    <LayoutTemplate className="w-4 h-4 mr-1" />
                    Templates
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={addAction}
                    disabled={isReadOnly}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {workflowState.actions.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-border/50 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No actions configured. Add an action to define what happens when this workflow runs.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={openTemplatesForNew} disabled={isReadOnly}>
                      <LayoutTemplate className="w-4 h-4 mr-1" />
                      Browse Templates
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAiAssistOpen(true)} disabled={isReadOnly}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Use AI Assist
                    </Button>
                  </div>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={workflowState.actions.map(a => a.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {workflowState.actions.map((action, idx) => (
                        <SortableActionCard
                          key={action.id}
                          action={action}
                          index={idx}
                          isReadOnly={isReadOnly}
                          onRemove={removeAction}
                          onUpdateType={updateActionType}
                          onUpdateConfig={updateActionConfig}
                          onOpenTemplates={openTemplatesForReplace}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
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

      {/* Modals */}
      <ActionTemplateModal
        open={templateModalOpen}
        onClose={() => {
          setTemplateModalOpen(false);
          setReplaceActionId(null);
        }}
        onSelectTemplate={handleSelectTemplate}
      />
      <AIAssistPanel
        open={aiAssistOpen}
        onClose={() => setAiAssistOpen(false)}
        onApply={handleAISuggestion}
      />
    </AppShell>
  );
};

export default WorkflowEdit;
