import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Trash2,
  GripVertical,
  LayoutTemplate,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Save,
  Link2,
  Wand2,
  Code2,
  Settings2,
  ArrowRight,
  RotateCcw
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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ActionTemplateModal, actionTemplates, type ActionTemplate } from "@/components/workflows/ActionTemplateModal";
import { ActionFieldsRenderer } from "@/components/workflows/ActionFieldsRenderer";
import { WorkflowSummaryCard } from "@/components/workflows/WorkflowSummaryCard";

// Types
type TriggerType = "webhook" | "cron" | "manual";

interface Action {
  id: string;
  type: string;
  config: Record<string, unknown>;
  onSuccessNext?: string[];
  onFailureNext?: string[];
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

// Trigger options
const triggerOptions = [
  { value: "webhook" as const, label: "Webhook", description: "Runs when data is sent to a URL", icon: Webhook },
  { value: "cron" as const, label: "Scheduled", description: "Runs on a schedule (cron)", icon: Clock },
  { value: "manual" as const, label: "Manual", description: "Runs when triggered manually", icon: Hand },
];

// Get action label from type
const getActionLabel = (type: string): string => {
  const template = actionTemplates.find(t => t.type === type);
  return template?.label || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Determine required connections based on action types
const getRequiredConnections = (actions: Action[]): string[] => {
  const connections: Set<string> = new Set();
  actions.forEach(action => {
    if (action.type === "send_email") connections.add("Email");
    if (action.type === "slack_message") connections.add("Slack");
    if (action.type === "send_sms") connections.add("SMS/Twilio");
    if (action.type === "crm_create") {
      const crm = action.config.crm as string;
      if (crm) connections.add(crm.charAt(0).toUpperCase() + crm.slice(1));
    }
    if (action.type === "notion_create") connections.add("Notion");
    if (action.type === "append_sheet") connections.add("Google Sheets");
  });
  return Array.from(connections);
};

// Comprehensive validation
const validateWorkflow = (state: WorkflowState): string[] => {
  const errors: string[] = [];
  
  // Basic info validation
  if (!state.name.trim()) errors.push("Workflow name is required");
  
  // Trigger validation
  if (!state.trigger.type) {
    errors.push("Trigger type is required");
  } else if (state.trigger.type === "webhook") {
    const path = state.trigger.config?.path as string;
    if (!path?.trim()) errors.push("Webhook path is required");
    else if (!path.startsWith("/")) errors.push("Webhook path must start with /");
  } else if (state.trigger.type === "cron") {
    const mode = state.trigger.config?.mode as string;
    if (mode === "expression") {
      const expr = state.trigger.config?.expression as string;
      if (!expr?.trim()) errors.push("Cron expression is required");
      else {
        const parts = expr.trim().split(/\s+/);
        if (parts.length < 5) errors.push("Invalid cron expression format");
      }
    } else {
      const amount = state.trigger.config?.intervalAmount as number;
      if (!amount || amount < 1) errors.push("Interval amount must be at least 1");
    }
  }
  
  // Actions validation
  if (state.actions.length === 0) {
    errors.push("At least one action is required");
  } else {
    const actionIds = state.actions.map(a => a.id);
    const uniqueIds = new Set(actionIds);
    if (uniqueIds.size !== actionIds.length) {
      errors.push("Action IDs must be unique");
    }
    
    state.actions.forEach((action, idx) => {
      if (!action.type) {
        errors.push(`Action ${idx + 1} has no type selected`);
      } else {
        // Type-specific validation
        if (action.type === "http_request") {
          const url = action.config.url as string;
          if (!url?.trim()) errors.push(`Action ${idx + 1}: URL is required`);
          else if (!url.startsWith("http://") && !url.startsWith("https://")) {
            errors.push(`Action ${idx + 1}: URL must start with http:// or https://`);
          }
        }
        if (action.type === "send_email") {
          const to = action.config.to as string;
          if (!to?.trim()) errors.push(`Action ${idx + 1}: Email recipient is required`);
        }
        if (action.type === "delay") {
          const duration = action.config.duration as number;
          if (!duration || duration < 1) errors.push(`Action ${idx + 1}: Delay duration must be at least 1`);
        }
      }
      
      // Flow validation - check references exist
      if (action.onSuccessNext) {
        action.onSuccessNext.forEach(nextId => {
          if (!actionIds.includes(nextId)) {
            errors.push(`Action ${idx + 1}: References non-existent action "${nextId}"`);
          }
        });
      }
      if (action.onFailureNext) {
        action.onFailureNext.forEach(nextId => {
          if (!actionIds.includes(nextId)) {
            errors.push(`Action ${idx + 1}: Failure path references non-existent action "${nextId}"`);
          }
        });
      }
    });
    
    // Check for starting actions
    const targetedIds = new Set<string>();
    state.actions.forEach(a => {
      a.onSuccessNext?.forEach(id => targetedIds.add(id));
      a.onFailureNext?.forEach(id => targetedIds.add(id));
    });
    const startingActions = state.actions.filter(a => !targetedIds.has(a.id));
    if (startingActions.length === 0 && state.actions.length > 0) {
      errors.push("No starting action found (circular reference detected)");
    }
  }
  
  return errors;
};

// Sortable Action Card Component
interface SortableActionCardProps {
  action: Action;
  index: number;
  allActions: Action[];
  onRemove: (id: string) => void;
  onUpdateType: (id: string, type: string) => void;
  onUpdateConfig: (id: string, field: string, value: unknown) => void;
  onUpdateFlow: (id: string, field: "onSuccessNext" | "onFailureNext", value: string[]) => void;
  onOpenTemplates: (replaceId: string) => void;
}

function SortableActionCard({ 
  action, 
  index, 
  allActions,
  onRemove, 
  onUpdateType,
  onUpdateConfig,
  onUpdateFlow,
  onOpenTemplates 
}: SortableActionCardProps) {
  const [showFlow, setShowFlow] = useState(false);
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

  const otherActions = allActions.filter(a => a.id !== action.id);
  const isStartingAction = !allActions.some(a => 
    a.onSuccessNext?.includes(action.id) || a.onFailureNext?.includes(action.id)
  );

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
          {isStartingAction && (
            <Badge variant="outline" className="text-[10px] bg-green-400/10 text-green-400 border-green-400/30">
              START
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFlow(!showFlow)}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
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
              <SelectItem value="http_request">HTTP Request</SelectItem>
              <SelectItem value="set_data">Set Data</SelectItem>
              <SelectItem value="send_email">Send Email</SelectItem>
              <SelectItem value="delay">Delay</SelectItem>
              <SelectItem value="slack_message">Slack Message</SelectItem>
              <SelectItem value="send_sms">Send SMS</SelectItem>
              <SelectItem value="database_insert">Insert Record</SelectItem>
              <SelectItem value="database_update">Update Record</SelectItem>
              <SelectItem value="crm_create">Create CRM Contact</SelectItem>
              <SelectItem value="notion_create">Create Notion Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {action.type && (
        <ActionFieldsRenderer
          actionId={action.id}
          actionType={action.type}
          config={action.config}
          isReadOnly={false}
          onUpdateConfig={onUpdateConfig}
        />
      )}

      {/* Flow Configuration */}
      <AnimatePresence>
        {showFlow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-border/30 space-y-3"
          >
            <p className="text-xs font-medium text-muted-foreground">Flow Configuration</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">On Success → Next Action(s)</Label>
                <Select
                  value={action.onSuccessNext?.[0] || "none"}
                  onValueChange={(v) => onUpdateFlow(action.id, "onSuccessNext", v === "none" ? [] : [v])}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select next..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">End (no next action)</SelectItem>
                    {otherActions.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {getActionLabel(a.type) || a.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">On Failure → (Optional)</Label>
                <Select
                  value={action.onFailureNext?.[0] || "none"}
                  onValueChange={(v) => onUpdateFlow(action.id, "onFailureNext", v === "none" ? [] : [v])}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Stop on failure</SelectItem>
                    {otherActions.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {getActionLabel(a.type) || a.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// AI Builder Modal
interface AIBuilderModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (workflow: Partial<WorkflowState>) => void;
}

function AIBuilderModal({ open, onClose, onApply }: AIBuilderModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<Partial<WorkflowState> | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const lowerPrompt = prompt.toLowerCase();
    let generated: Partial<WorkflowState>;

    if (lowerPrompt.includes("welcome") && lowerPrompt.includes("email")) {
      generated = {
        name: "Welcome Email Workflow",
        description: "Sends a welcome email when a new user signs up",
        intent: "Onboard new users with personalized welcome",
        trigger: { type: "webhook", config: { path: "/webhook/signup", method: "POST" } },
        actions: [
          { id: `action_${Date.now()}`, type: "send_email", config: { to: "{{user.email}}", subject: "Welcome!", body: "Hi {{user.name}}!" }, onSuccessNext: [] }
        ]
      };
    } else if (lowerPrompt.includes("daily") || lowerPrompt.includes("schedule")) {
      generated = {
        name: "Daily Report Workflow",
        description: "Sends a daily summary report",
        intent: "Automate daily reporting",
        trigger: { type: "cron", config: { mode: "expression", expression: "0 9 * * *" } },
        actions: [
          { id: `action_${Date.now()}`, type: "slack_message", config: { channel: "#general", message: "📊 Daily Report" }, onSuccessNext: [] }
        ]
      };
    } else if (lowerPrompt.includes("payment") && lowerPrompt.includes("fail")) {
      const emailId = `action_${Date.now()}`;
      const crmId = `action_${Date.now() + 1}`;
      generated = {
        name: "Payment Failure Handler",
        description: "Notifies customer and logs failed payments",
        intent: "Handle payment failures gracefully",
        trigger: { type: "webhook", config: { path: "/webhook/payment-failed", method: "POST" } },
        actions: [
          { id: emailId, type: "send_email", config: { to: "{{customer.email}}", subject: "Payment Issue", body: "..." }, onSuccessNext: [crmId] },
          { id: crmId, type: "crm_create", config: { crm: "hubspot", firstName: "{{customer.firstName}}", lastName: "{{customer.lastName}}", email: "{{customer.email}}" }, onSuccessNext: [] }
        ]
      };
    } else {
      generated = {
        name: "Custom Workflow",
        description: prompt,
        intent: "Automate custom task",
        trigger: { type: "webhook", config: { path: "/webhook/custom", method: "POST" } },
        actions: [
          { id: `action_${Date.now()}`, type: "http_request", config: { method: "POST", url: "https://api.example.com", headers: [], body: "{}" }, onSuccessNext: [] }
        ]
      };
    }

    setSuggestion(generated);
    setIsGenerating(false);
  };

  const handleApply = () => {
    if (suggestion) {
      onApply(suggestion);
      setPrompt("");
      setSuggestion(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Workflow Builder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">
              Describe the workflow you want to create:
            </Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Send a welcome email when a new user signs up, then add them to HubSpot"
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" />Generate Workflow</>
            )}
          </Button>
          {suggestion && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{suggestion.name}</span>
                <Badge variant="outline" className="text-primary border-primary/30">AI Generated</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{suggestion.intent}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Trigger:</span>
                  <p className="text-foreground capitalize">{suggestion.trigger?.type}</p>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Actions:</span>
                  <p className="text-foreground">{suggestion.actions?.length} step(s)</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply} disabled={!suggestion}>Apply Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Component
const CreateWorkflow = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isCreating, setIsCreating] = useState(false);
  const [cronMode, setCronMode] = useState<"expression" | "interval">("interval");

  // Modals
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [aiBuilderOpen, setAiBuilderOpen] = useState(false);
  const [replaceActionId, setReplaceActionId] = useState<string | null>(null);

  // Workflow state
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    name: "",
    description: "",
    intent: "",
    trigger: { type: "webhook", config: { path: "/webhook/new", method: "POST" } },
    actions: [],
  });

  // JSON strings for Advanced mode
  const [workflowJson, setWorkflowJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Validation
  const validationErrors = validateWorkflow(workflowState);
  const requiredConnections = getRequiredConnections(workflowState.actions);
  const isValid = validationErrors.length === 0;

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sync JSON when state changes
  useEffect(() => {
    const json = JSON.stringify(workflowState, null, 2);
    setWorkflowJson(json);
  }, [workflowState]);

  // Parse JSON and update state
  const applyJsonChanges = useCallback(() => {
    try {
      const parsed = JSON.parse(workflowJson);
      setWorkflowState(parsed);
      setJsonError(null);
      return true;
    } catch {
      setJsonError("Invalid JSON format");
      return false;
    }
  }, [workflowJson]);

  // Auto-apply JSON when switching tabs
  useEffect(() => {
    if (activeTab === "basic") {
      applyJsonChanges();
    }
  }, [activeTab, applyJsonChanges]);

  // Update handlers
  const updateBasicField = (field: keyof Pick<WorkflowState, 'name' | 'description' | 'intent'>, value: string) => {
    setWorkflowState(prev => ({ ...prev, [field]: value }));
  };

  const updateTrigger = (updates: Partial<Trigger>) => {
    setWorkflowState(prev => ({
      ...prev,
      trigger: { ...prev.trigger, ...updates }
    }));
  };

  const updateTriggerConfig = (field: string, value: unknown) => {
    setWorkflowState(prev => ({
      ...prev,
      trigger: { ...prev.trigger, config: { ...prev.trigger.config, [field]: value } }
    }));
  };

  // Action handlers
  const addAction = () => {
    const newAction: Action = { id: `action_${Date.now()}`, type: "", config: {}, onSuccessNext: [], onFailureNext: [] };
    setWorkflowState(prev => ({ ...prev, actions: [...prev.actions, newAction] }));
  };

  const removeAction = (id: string) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== id).map(a => ({
        ...a,
        onSuccessNext: a.onSuccessNext?.filter(nextId => nextId !== id),
        onFailureNext: a.onFailureNext?.filter(nextId => nextId !== id)
      }))
    }));
  };

  const updateActionType = (id: string, type: string) => {
    const template = actionTemplates.find(t => t.type === type);
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, type, config: template?.defaultConfig || {} } : a)
    }));
  };

  const updateActionConfig = (id: string, field: string, value: unknown) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, config: { ...a.config, [field]: value } } : a)
    }));
  };

  const updateActionFlow = (id: string, field: "onSuccessNext" | "onFailureNext", value: string[]) => {
    setWorkflowState(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWorkflowState(prev => {
        const oldIndex = prev.actions.findIndex(a => a.id === active.id);
        const newIndex = prev.actions.findIndex(a => a.id === over.id);
        return { ...prev, actions: arrayMove(prev.actions, oldIndex, newIndex) };
      });
    }
  };

  const handleSelectTemplate = (template: ActionTemplate) => {
    if (replaceActionId) {
      setWorkflowState(prev => ({
        ...prev,
        actions: prev.actions.map(a => a.id === replaceActionId ? { ...a, type: template.type, config: { ...template.defaultConfig } } : a)
      }));
      setReplaceActionId(null);
    } else {
      const newAction: Action = { id: `action_${Date.now()}`, type: template.type, config: { ...template.defaultConfig }, onSuccessNext: [], onFailureNext: [] };
      setWorkflowState(prev => ({ ...prev, actions: [...prev.actions, newAction] }));
    }
  };

  const handleAIApply = (workflow: Partial<WorkflowState>) => {
    setWorkflowState(prev => ({ ...prev, ...workflow }));
    toast.success("AI workflow applied!");
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

  const handleSaveDraft = () => {
    toast.info("Workflow saved as draft");
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        {/* Back Navigation */}
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-foreground" asChild>
          <Link to="/app/workflows"><ArrowLeft className="w-4 h-4 mr-2" />Back to Workflows</Link>
        </Button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Workflow</h1>
              <p className="text-muted-foreground mt-1">Build a new automation with the guided builder or JSON editor.</p>
            </div>
            <Button variant="outline" onClick={() => setAiBuilderOpen(true)}>
              <Sparkles className="w-4 h-4 mr-2" />AI Builder
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />Basic Builder
                </TabsTrigger>
                <TabsTrigger value="advanced" disabled={!!jsonError && activeTab === "basic"} className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />Advanced (JSON)
                </TabsTrigger>
              </TabsList>

              {/* BASIC MODE */}
              <TabsContent value="basic" className="space-y-4">
                {/* Workflow Info */}
                <AppCard>
                  <h2 className="text-lg font-medium text-foreground mb-4">Workflow Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" value={workflowState.name} onChange={(e) => updateBasicField("name", e.target.value)} placeholder="My Workflow" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={workflowState.description} onChange={(e) => updateBasicField("description", e.target.value)} placeholder="What does this workflow do?" className="mt-1 min-h-[60px]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="intent">Intent</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><Sparkles className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                            <TooltipContent><p className="text-xs">Helps Synth understand the purpose of this workflow</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input id="intent" value={workflowState.intent} onChange={(e) => updateBasicField("intent", e.target.value)} placeholder="What is the goal of this workflow?" />
                    </div>
                  </div>
                </AppCard>

                {/* Trigger */}
                <AppCard>
                  <h2 className="text-lg font-medium text-foreground mb-4">Trigger Configuration</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {triggerOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = workflowState.trigger.type === option.value;
                        return (
                          <button key={option.value} onClick={() => {
                            const config = option.value === "webhook" ? { path: "/webhook/new", method: "POST" } : option.value === "cron" ? { mode: "interval", intervalAmount: 1, intervalUnit: "hours" } : {};
                            updateTrigger({ type: option.value, config });
                          }} className={`p-4 rounded-lg border text-left transition-all ${isSelected ? "border-primary bg-primary/10" : "border-border/50 hover:border-border bg-muted/20"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                              <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>{option.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Webhook Config */}
                    {workflowState.trigger.type === "webhook" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Path *</Label>
                            <Input value={(workflowState.trigger.config?.path as string) || ""} onChange={(e) => updateTriggerConfig("path", e.target.value)} placeholder="/webhook/my-endpoint" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Method</Label>
                            <Select value={(workflowState.trigger.config?.method as string) || "POST"} onValueChange={(v) => updateTriggerConfig("method", v)}>
                              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/30">
                          <span className="text-xs text-muted-foreground">URL Preview:</span>
                          <code className="text-xs text-primary font-mono">https://synth.app/hooks{(workflowState.trigger.config?.path as string) || "/webhook"}</code>
                        </div>
                      </motion.div>
                    )}

                    {/* Cron Config */}
                    {workflowState.trigger.type === "cron" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-4">
                        <Tabs value={cronMode} onValueChange={(v) => { setCronMode(v as "expression" | "interval"); updateTriggerConfig("mode", v); }}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="interval">Interval</TabsTrigger>
                            <TabsTrigger value="expression">Cron Expression</TabsTrigger>
                          </TabsList>
                          <TabsContent value="interval" className="pt-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">Run every</span>
                              <Input type="number" min={1} value={(workflowState.trigger.config?.intervalAmount as number) || 1} onChange={(e) => updateTriggerConfig("intervalAmount", parseInt(e.target.value) || 1)} className="w-20" />
                              <Select value={(workflowState.trigger.config?.intervalUnit as string) || "hours"} onValueChange={(v) => updateTriggerConfig("intervalUnit", v)}>
                                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="seconds">seconds</SelectItem>
                                  <SelectItem value="minutes">minutes</SelectItem>
                                  <SelectItem value="hours">hours</SelectItem>
                                  <SelectItem value="days">days</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TabsContent>
                          <TabsContent value="expression" className="pt-4 space-y-2">
                            <Label className="text-xs text-muted-foreground">Cron Expression *</Label>
                            <Input value={(workflowState.trigger.config?.expression as string) || ""} onChange={(e) => updateTriggerConfig("expression", e.target.value)} placeholder="0 9 * * *" className="font-mono" />
                            <p className="text-xs text-muted-foreground">Format: minute hour day month weekday (e.g., "0 9 * * *" = 9 AM daily)</p>
                          </TabsContent>
                        </Tabs>
                      </motion.div>
                    )}

                    {/* Manual Config */}
                    {workflowState.trigger.type === "manual" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hand className="w-4 h-4" />
                          <p className="text-sm">This workflow will only run when triggered manually.</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </AppCard>

                {/* Actions */}
                <AppCard>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-foreground">Actions</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setReplaceActionId(null); setTemplateModalOpen(true); }}>
                        <LayoutTemplate className="w-4 h-4 mr-2" />Templates
                      </Button>
                      <Button size="sm" onClick={addAction}>
                        <Plus className="w-4 h-4 mr-2" />Add Action
                      </Button>
                    </div>
                  </div>

                  {workflowState.actions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No actions yet. Add your first action to get started.</p>
                    </div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={workflowState.actions.map(a => a.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {workflowState.actions.map((action, index) => (
                            <SortableActionCard
                              key={action.id}
                              action={action}
                              index={index}
                              allActions={workflowState.actions}
                              onRemove={removeAction}
                              onUpdateType={updateActionType}
                              onUpdateConfig={updateActionConfig}
                              onUpdateFlow={updateActionFlow}
                              onOpenTemplates={(id) => { setReplaceActionId(id); setTemplateModalOpen(true); }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </AppCard>

                {/* Required Connections Warning */}
                {requiredConnections.length > 0 && (
                  <Alert className="bg-amber-500/10 border-amber-500/30">
                    <Link2 className="w-4 h-4 text-amber-500" />
                    <AlertDescription className="text-amber-200">
                      This workflow requires connections to: {requiredConnections.join(", ")}. 
                      <Link to="/app/connections" className="underline ml-1 hover:text-amber-100">Configure connections</Link>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              {/* ADVANCED MODE */}
              <TabsContent value="advanced" className="space-y-4">
                <AppCard>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-foreground">Workflow JSON</h2>
                    <Button variant="outline" size="sm" onClick={applyJsonChanges} disabled={!!jsonError}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />Apply Changes
                    </Button>
                  </div>
                  {jsonError && (
                    <Alert className="mb-4 bg-destructive/10 border-destructive/30">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <AlertDescription className="text-destructive">{jsonError}</AlertDescription>
                    </Alert>
                  )}
                  <Textarea
                    value={workflowJson}
                    onChange={(e) => { setWorkflowJson(e.target.value); setJsonError(null); }}
                    className="min-h-[500px] font-mono text-sm bg-background/50"
                    placeholder="Enter workflow JSON..."
                  />
                </AppCard>
              </TabsContent>
            </Tabs>

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />Save as Draft
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" asChild><Link to="/app/workflows">Cancel</Link></Button>
                <Button onClick={handleCreate} disabled={!isValid || isCreating}>
                  {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : "Create Workflow"}
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <WorkflowSummaryCard
              name={workflowState.name}
              description={workflowState.description}
              intent={workflowState.intent}
              trigger={workflowState.trigger}
              actions={workflowState.actions}
              validationErrors={validationErrors}
              requiredConnections={requiredConnections}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ActionTemplateModal open={templateModalOpen} onClose={() => setTemplateModalOpen(false)} onSelectTemplate={handleSelectTemplate} />
      <AIBuilderModal open={aiBuilderOpen} onClose={() => setAiBuilderOpen(false)} onApply={handleAIApply} />
    </AppShell>
  );
};

export default CreateWorkflow;
