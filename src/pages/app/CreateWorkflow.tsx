import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Loader2,
  Sparkles,
  Webhook,
  Clock,
  Hand,
  Zap,
  Plus,
  Trash2,
  GripVertical,
  LayoutTemplate,
  Calendar,
  MessageSquare,
  Mail,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ActionTemplateModal, actionTemplates, type ActionTemplate } from "@/components/workflows/ActionTemplateModal";
import { ActionFieldsRenderer } from "@/components/workflows/ActionFieldsRenderer";

// Trigger type options for Basic mode
const triggerTypeOptions = [
  { value: "webhook", label: "Webhook", description: "Runs when you send data to this webhook URL", icon: Webhook },
  { value: "schedule", label: "Schedule", description: "Runs on a set schedule", icon: Clock },
  { value: "manual", label: "Manual", description: "Runs when triggered manually", icon: Hand },
  { value: "event", label: "App Event", description: "Runs when a specific event occurs", icon: Zap },
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
  trigger: Trigger;
  actions: Action[];
}

// Get action label from type
const getActionLabel = (type: string): string => {
  const template = actionTemplates.find(t => t.type === type);
  return template?.label || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Sortable Action Card Component
interface SortableActionCardProps {
  action: Action;
  index: number;
  onRemove: (id: string) => void;
  onUpdateType: (id: string, type: string) => void;
  onUpdateConfig: (id: string, field: string, value: unknown) => void;
  onOpenTemplates: (replaceId: string) => void;
}

function SortableActionCard({ 
  action, 
  index, 
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
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-muted/50 cursor-grab active:cursor-grabbing"
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
            className="text-muted-foreground hover:text-primary"
          >
            <LayoutTemplate className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(action.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!action.type && (
        <div className="mb-4">
          <Label className="text-xs text-muted-foreground mb-2 block">Select Action Type</Label>
          <Select
            value={action.type || ""}
            onValueChange={(value) => onUpdateType(action.id, value)}
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

      <ActionFieldsRenderer
        actionId={action.id}
        actionType={action.type}
        config={action.config}
        isReadOnly={false}
        onUpdateConfig={onUpdateConfig}
      />
    </div>
  );
}

// AI Creation Modal Component
interface AICreationModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: { name: string; description: string; intent: string; trigger: Trigger; actions: Action[] }) => void;
}

function AICreationModal({ open, onClose, onApply }: AICreationModalProps) {
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    name: string;
    description: string;
    intent: string;
    trigger: Trigger;
    actions: Action[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const lowerDesc = description.toLowerCase();
    
    // Generate workflow based on description
    let generatedWorkflow: {
      name: string;
      description: string;
      intent: string;
      trigger: Trigger;
      actions: Action[];
    } = {
      name: "New Workflow",
      description: description,
      intent: "",
      trigger: { type: "webhook", config: { path: "/webhook" } },
      actions: []
    };

    if (lowerDesc.includes("email") && lowerDesc.includes("signup")) {
      generatedWorkflow = {
        name: "Welcome Email on Signup",
        description: "Sends a welcome email when a new user signs up",
        intent: "Greet new users and provide onboarding information",
        trigger: { type: "webhook" as TriggerType, config: { path: "/new-signup", method: "POST" } },
        actions: [
          { id: `action_${Date.now()}`, type: "send_email", config: { to: "{{user.email}}", subject: "Welcome!", body: "Hi {{user.name}}, welcome to our platform!" } }
        ]
      };
    } else if (lowerDesc.includes("slack") && lowerDesc.includes("payment")) {
      generatedWorkflow = {
        name: "Slack Alert on Payment Failure",
        description: "Notifies the team on Slack when a payment fails",
        intent: "Keep team informed of failed payments for quick resolution",
        trigger: { type: "event" as TriggerType, config: { app: "stripe", event: "payment.failed" } },
        actions: [
          { id: `action_${Date.now()}`, type: "slack_message", config: { channel: "#payments", message: "⚠️ Payment failed for {{customer.email}}", includeAttachments: true } }
        ]
      };
    } else if (lowerDesc.includes("crm") && lowerDesc.includes("upgrade")) {
      generatedWorkflow = {
        name: "Log User Upgrade to CRM",
        description: "Creates a CRM record when a user upgrades their plan",
        intent: "Track customer upgrades for sales follow-up",
        trigger: { type: "event" as TriggerType, config: { app: "billing", event: "plan.upgraded" } },
        actions: [
          { id: `action_${Date.now()}`, type: "crm_create", config: { crm: "hubspot", firstName: "{{user.firstName}}", lastName: "{{user.lastName}}", email: "{{user.email}}", phone: "", customFields: [] } }
        ]
      };
    } else if (lowerDesc.includes("daily") || lowerDesc.includes("schedule")) {
      generatedWorkflow = {
        name: "Daily Report",
        description: "Generates and sends a daily report",
        intent: "Automate daily reporting tasks",
        trigger: { type: "schedule" as TriggerType, config: { frequency: "daily", time: "09:00" } },
        actions: [
          { id: `action_${Date.now()}`, type: "send_email", config: { to: "team@company.com", subject: "Daily Report - {{date}}", body: "Here's your daily report..." } }
        ]
      };
    } else {
      generatedWorkflow = {
        name: "Custom Workflow",
        description: description,
        intent: "Automate tasks based on your description",
        trigger: { type: "webhook" as TriggerType, config: { path: "/custom-hook" } },
        actions: [
          { id: `action_${Date.now()}`, type: "send_email", config: { to: "{{user.email}}", subject: "", body: "" } }
        ]
      };
    }

    setSuggestion(generatedWorkflow);
    setIsProcessing(false);
  };

  const handleApply = () => {
    if (suggestion) {
      onApply(suggestion);
      handleClose();
    }
  };

  const handleClose = () => {
    setDescription("");
    setSuggestion(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-Assisted Workflow Creation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">
              Describe the workflow you want to build:
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Send a welcome email when a new user signs up, then log them in my CRM"
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!description.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Workflow...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Suggestions
              </>
            )}
          </Button>

          {suggestion && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Suggested Name:</span>
                <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Trigger:</span>
                <p className="text-sm text-foreground capitalize">{suggestion.trigger.type}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Actions ({suggestion.actions.length}):</span>
                <ul className="text-sm text-foreground mt-1">
                  {suggestion.actions.map((action, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary/20 text-xs flex items-center justify-center text-primary">{i + 1}</span>
                      {getActionLabel(action.type)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!suggestion}>
            Apply Suggestions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// AI JSON Builder Modal
interface AIJsonBuilderModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (trigger: Trigger, actions: Action[]) => void;
}

function AIJsonBuilderModal({ open, onClose, onApply }: AIJsonBuilderModalProps) {
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedJson, setGeneratedJson] = useState<{ trigger: Trigger; actions: Action[] } | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerDesc = description.toLowerCase();
    
    let trigger: Trigger = { type: "webhook", config: { path: "/webhook" } };
    let actions: Action[] = [];

    if (lowerDesc.includes("email") && lowerDesc.includes("crm")) {
      trigger = { type: "webhook", config: { path: "/new-lead", method: "POST" } };
      actions = [
        { id: `action_${Date.now()}`, type: "send_email", config: { to: "{{user.email}}", subject: "Welcome!", body: "Thanks for signing up!" } },
        { id: `action_${Date.now() + 1}`, type: "crm_create", config: { crm: "hubspot", firstName: "{{user.firstName}}", lastName: "{{user.lastName}}", email: "{{user.email}}", phone: "", customFields: [] } }
      ];
    } else if (lowerDesc.includes("slack")) {
      trigger = { type: "event", config: { app: "system", event: "alert" } };
      actions = [
        { id: `action_${Date.now()}`, type: "slack_message", config: { channel: "#alerts", message: "{{event.message}}", includeAttachments: false } }
      ];
    } else {
      trigger = { type: "webhook", config: { path: "/custom" } };
      actions = [
        { id: `action_${Date.now()}`, type: "send_email", config: { to: "{{user.email}}", subject: "", body: "" } }
      ];
    }

    setGeneratedJson({ trigger, actions });
    setIsProcessing(false);
  };

  const handleApply = () => {
    if (generatedJson) {
      onApply(generatedJson.trigger, generatedJson.actions);
      handleClose();
    }
  };

  const handleClose = () => {
    setDescription("");
    setGeneratedJson(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI JSON Builder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">
              Describe your workflow:
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Send an email then log a CRM record"
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!description.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating JSON...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate JSON
              </>
            )}
          </Button>

          {generatedJson && (
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Trigger JSON:</span>
                <pre className="mt-1 p-2 rounded bg-background/50 text-xs font-mono overflow-x-auto border border-border/30">
                  {JSON.stringify(generatedJson.trigger, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Actions JSON:</span>
                <pre className="mt-1 p-2 rounded bg-background/50 text-xs font-mono overflow-x-auto border border-border/30 max-h-[200px]">
                  {JSON.stringify(generatedJson.actions, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!generatedJson}>
            Apply JSON
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Validation helper
const validateWorkflow = (state: WorkflowState): string[] => {
  const errors: string[] = [];
  if (!state.name.trim()) errors.push("Workflow name is required");
  if (!state.trigger.type) errors.push("Trigger type is required");
  if (state.actions.length === 0) errors.push("At least one action is required");
  state.actions.forEach((action, idx) => {
    if (!action.type) errors.push(`Action ${idx + 1} has no type selected`);
  });
  return errors;
};

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isCreating, setIsCreating] = useState(false);

  // Modals state
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [aiCreationOpen, setAiCreationOpen] = useState(false);
  const [aiJsonBuilderOpen, setAiJsonBuilderOpen] = useState(false);
  const [replaceActionId, setReplaceActionId] = useState<string | null>(null);

  // Unified workflow state
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    name: "",
    description: "",
    intent: "",
    trigger: { type: "webhook", config: {} },
    actions: [],
  });

  // JSON strings for Advanced editing
  const [triggerJson, setTriggerJson] = useState("");
  const [actionsJson, setActionsJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Validation
  const validationErrors = validateWorkflow(workflowState);
  const isValid = validationErrors.length === 0;

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
      return true;
    } catch {
      setJsonError("Invalid JSON format. Please check your syntax.");
      return false;
    }
  }, [triggerJson, actionsJson]);

  // Auto-apply JSON changes when switching to basic tab
  useEffect(() => {
    if (activeTab === "basic") {
      applyJsonChanges();
    }
  }, [activeTab, applyJsonChanges]);

  // Update basic info fields
  const updateBasicField = (field: keyof Pick<WorkflowState, 'name' | 'description' | 'intent'>, value: string) => {
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

  // AI Creation handler
  const handleAICreation = (data: { name: string; description: string; intent: string; trigger: Trigger; actions: Action[] }) => {
    setWorkflowState({
      name: data.name,
      description: data.description,
      intent: data.intent,
      trigger: data.trigger,
      actions: data.actions
    });
    toast.success("AI suggestions applied!");
  };

  // AI JSON Builder handler
  const handleAIJsonBuilder = (trigger: Trigger, actions: Action[]) => {
    setTriggerJson(JSON.stringify(trigger, null, 2));
    setActionsJson(JSON.stringify(actions, null, 2));
    toast.success("AI-generated JSON applied to editors");
  };

  // Insert template JSON
  const insertTemplateJson = () => {
    const sampleTrigger: Trigger = { type: "webhook", config: { path: "/your-endpoint", method: "POST" } };
    const sampleActions: Action[] = [
      { id: "action_1", type: "send_email", config: { to: "{{user.email}}", subject: "Subject", body: "Message body" } }
    ];
    setTriggerJson(JSON.stringify(sampleTrigger, null, 2));
    setActionsJson(JSON.stringify(sampleActions, null, 2));
    toast.info("Template JSON inserted");
  };

  const handleCreate = async () => {
    if (!isValid) {
      toast.error("Please fix validation errors before creating");
      return;
    }

    setIsCreating(true);
    await new Promise(r => setTimeout(r, 1500));

    toast.success("Workflow created successfully!");
    setIsCreating(false);
    navigate("/app/workflows");
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
          <Link to="/app/workflows">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workflows
          </Link>
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Create Workflow</h1>
          <p className="text-muted-foreground mt-1">
            Build a new automation using the guided builder or advanced JSON mode.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="basic">Basic Creation</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!!jsonError && activeTab === "basic"}>
              Advanced Creation
            </TabsTrigger>
          </TabsList>

          {/* ============ BASIC CREATION TAB ============ */}
          <TabsContent value="basic" className="space-y-4">
            {/* AI Assist Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setAiCreationOpen(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>

            {/* Workflow Information */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Workflow Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Workflow Name *</Label>
                  <Input
                    id="name"
                    value={workflowState.name}
                    onChange={(e) => updateBasicField("name", e.target.value)}
                    placeholder="My Automation"
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
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="intent">Intent (optional)</Label>
                  <Input
                    id="intent"
                    value={workflowState.intent}
                    onChange={(e) => updateBasicField("intent", e.target.value)}
                    placeholder="What is the goal of this workflow?"
                    className="mt-1"
                  />
                </div>
              </div>
            </AppCard>

            {/* Trigger Section */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Choose Trigger</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Define when this workflow should run.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {triggerTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => updateTrigger({ type: option.value as TriggerType, config: {} })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          workflowState.trigger.type === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border/50 hover:border-border bg-muted/20"
                        }`}
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

                {/* Webhook Config */}
                {workflowState.trigger.type === "webhook" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <Label>Webhook Path (placeholder)</Label>
                    <Input
                      value={(workflowState.trigger.config?.path as string) || ""}
                      onChange={(e) => updateTriggerConfig("path", e.target.value)}
                      placeholder="/your-endpoint"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      URL: https://synth.app/hooks<span className="text-primary">{(workflowState.trigger.config?.path as string) || "/your-endpoint"}</span>
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

                {/* Event Config */}
                {workflowState.trigger.type === "event" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2 space-y-3"
                  >
                    <div>
                      <Label>App</Label>
                      <Select
                        value={(workflowState.trigger.config?.app as string) || ""}
                        onValueChange={(value) => updateTriggerConfig("app", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select an app" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="hubspot">HubSpot</SelectItem>
                          <SelectItem value="api">Custom API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Event</Label>
                      <Input
                        value={(workflowState.trigger.config?.event as string) || ""}
                        onChange={(e) => updateTriggerConfig("event", e.target.value)}
                        placeholder="e.g., message.received, payment.created"
                        className="mt-1"
                      />
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
                    onClick={openTemplatesForNew}
                  >
                    <LayoutTemplate className="w-4 h-4 mr-1" />
                    Templates
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={addAction}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {workflowState.actions.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-border/50 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No actions configured yet. Add an action to define what happens when this workflow runs.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={openTemplatesForNew}>
                      <LayoutTemplate className="w-4 h-4 mr-1" />
                      Browse Templates
                    </Button>
                    <Button variant="outline" size="sm" onClick={addAction}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Empty Action
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

            {/* Validation Warnings */}
            {validationErrors.length > 0 && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-200">
                  <ul className="list-disc list-inside">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Create/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" asChild>
                <Link to="/app/workflows">Cancel</Link>
              </Button>
              <Button onClick={handleCreate} disabled={!isValid || isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Workflow
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* ============ ADVANCED CREATION TAB ============ */}
          <TabsContent value="advanced" className="space-y-4">
            {/* Instructions */}
            <Alert className="border-muted bg-muted/30">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <AlertDescription className="text-muted-foreground">
                Build or paste your workflow definition using structured JSON for trigger and actions.
              </AlertDescription>
            </Alert>

            {/* AI & Template Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={insertTemplateJson}>
                <LayoutTemplate className="w-4 h-4 mr-1" />
                Insert Template
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAiJsonBuilderOpen(true)}>
                <Sparkles className="w-4 h-4 mr-1" />
                AI JSON Builder
              </Button>
            </div>

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
              <Textarea
                value={triggerJson}
                onChange={(e) => setTriggerJson(e.target.value)}
                className="font-mono text-sm min-h-[150px] bg-background/50 border-border/50"
                placeholder='{"type": "webhook", "config": {}}'
              />
            </AppCard>

            {/* Actions JSON */}
            <AppCard>
              <h2 className="text-lg font-medium text-foreground mb-4">Actions Configuration (JSON)</h2>
              <Textarea
                value={actionsJson}
                onChange={(e) => setActionsJson(e.target.value)}
                className="font-mono text-sm min-h-[250px] bg-background/50 border-border/50"
                placeholder='[{"id": "action_1", "type": "send_email", "config": {}}]'
              />
            </AppCard>

            {/* Apply JSON Button */}
            <div className="flex justify-start">
              <Button variant="outline" onClick={applyJsonChanges}>
                Apply JSON Changes
              </Button>
            </div>

            {/* Create/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" asChild>
                <Link to="/app/workflows">Cancel</Link>
              </Button>
              <Button onClick={handleCreate} disabled={!isValid || isCreating || !!jsonError}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Workflow
                  </>
                )}
              </Button>
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
      <AICreationModal
        open={aiCreationOpen}
        onClose={() => setAiCreationOpen(false)}
        onApply={handleAICreation}
      />
      <AIJsonBuilderModal
        open={aiJsonBuilderOpen}
        onClose={() => setAiJsonBuilderOpen(false)}
        onApply={handleAIJsonBuilder}
      />
    </AppShell>
  );
};

export default CreateWorkflow;
