import { useState } from "react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const templates = [
  { id: "1", name: "Send Welcome Email" },
  { id: "2", name: "Notify Slack on New Lead" },
  { id: "3", name: "Forward Contact Form Submission" },
  { id: "4", name: "New Lead → Slack Notification" },
  { id: "5", name: "New Lead → Email Autoresponder" },
  { id: "6", name: "Inbound Lead → Save to Google Sheet" },
];

const exampleJson = `{
  "name": "My Workflow",
  "trigger": {
    "type": "webhook",
    "config": {}
  },
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to": "user@example.com",
        "subject": "Hello"
      }
    }
  ]
}`;

const CreateWorkflow = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [jsonValue, setJsonValue] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setJsonValue(JSON.stringify({
        name: template.name,
        trigger: { type: "webhook", config: {} },
        actions: [{ type: "placeholder", config: {} }],
      }, null, 2));
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonValue(value);
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
          setJsonError("Must be a JSON object");
        } else if (!parsed.name) {
          setJsonError("Missing required field: name");
        } else {
          setJsonError(null);
        }
      } else {
        setJsonError(null);
      }
    } catch {
      setJsonError("Invalid JSON syntax");
    }
  };

  const handleGenerateDraft = () => {
    setIsGenerating(true);
    // Simulate AI generation (UI only)
    setTimeout(() => {
      setJsonValue(JSON.stringify({
        name: "AI Generated Workflow",
        trigger: { type: "webhook", config: {} },
        actions: [{ type: "ai_generated", config: { prompt: aiPrompt } }],
      }, null, 2));
      setAiPrompt("");
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // UI only - simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-4xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Create Workflow</h1>

        {/* Template Selector */}
        <AppCard className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Start from a Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={cn(
                  "px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all",
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border hover:border-primary hover:bg-muted/50 text-muted-foreground"
                )}
              >
                {template.name}
              </button>
            ))}
          </div>
        </AppCard>

        {/* AI Draft Generator */}
        <AppCard className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">AI Draft Generator (Autopilot Mode)</h2>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe your workflow in plain English, e.g., 'When a new lead comes in from the website, send a Slack notification and add them to my CRM'"
            className="w-full h-24 px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <Button
            variant="secondary"
            onClick={handleGenerateDraft}
            disabled={!aiPrompt.trim() || isGenerating}
            className="mt-3"
          >
            {isGenerating ? "Generating..." : "Generate Workflow Draft"}
          </Button>
        </AppCard>

        {/* JSON Editor */}
        <AppCard className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Workflow JSON</h2>
          <textarea
            value={jsonValue}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder={exampleJson}
            className={cn(
              "w-full h-96 px-4 py-3 rounded-lg bg-background/40 border text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none overflow-x-auto",
              jsonError ? "border-red-500" : "border-border"
            )}
          />
          {jsonError && (
            <p className="text-red-400 text-sm mt-2">{jsonError}</p>
          )}
        </AppCard>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!jsonValue.trim() || !!jsonError || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Creating..." : "Create Workflow"}
        </Button>
      </div>
    </AppShell>
  );
};

export default CreateWorkflow;
