import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import IntentInput from "@/components/workflows/IntentInput";
import TriggerSelector, { TriggerOption } from "@/components/workflows/TriggerSelector";
import OutcomeInput from "@/components/workflows/OutcomeInput";
import ContextInput from "@/components/workflows/ContextInput";
import WorkflowSummaryCard from "@/components/workflows/WorkflowSummaryCard";
import { toast } from "sonner";

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [intent, setIntent] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerOption>("event");
  const [eventDescription, setEventDescription] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleFrequency, setScheduleFrequency] = useState("daily");
  const [outcome, setOutcome] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [workflowName, setWorkflowName] = useState("");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!intent.trim()) {
      newErrors.intent = "Please describe what you want Synth to automate.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTriggerDetails = (): string => {
    switch (selectedTrigger) {
      case "schedule":
        return `${scheduleTime}, ${scheduleFrequency}`;
      case "event":
      case "condition":
        return eventDescription || "";
      default:
        return "";
    }
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2000));

    toast.success("Workflow generated successfully!");
    setIsGenerating(false);
    navigate("/app/workflows");
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-6 max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          to="/app/workflows"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workflows
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Create Workflow</h1>
          <p className="text-muted-foreground mt-1">
            Describe what you want Synth to automate. Use natural language.
          </p>
        </motion.div>

        {/* Form sections */}
        <div className="space-y-6">
          {/* Intent Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <IntentInput
              value={intent}
              onChange={setIntent}
              error={errors.intent}
            />
          </motion.div>

          {/* Trigger Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <TriggerSelector
              selectedTrigger={selectedTrigger}
              onTriggerChange={setSelectedTrigger}
              eventDescription={eventDescription}
              onEventDescriptionChange={setEventDescription}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={setScheduleTime}
              scheduleFrequency={scheduleFrequency}
              onScheduleFrequencyChange={setScheduleFrequency}
            />
          </motion.div>

          {/* Outcome Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <OutcomeInput
              value={outcome}
              onChange={setOutcome}
            />
          </motion.div>

          {/* Context Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <ContextInput
              value={additionalContext}
              onChange={setAdditionalContext}
            />
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WorkflowSummaryCard
              workflowName={workflowName}
              onNameChange={setWorkflowName}
              intent={intent}
              trigger={selectedTrigger}
              triggerDetails={getTriggerDetails()}
              outcome={outcome}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-end gap-3 pt-4"
          >
            <Button
              variant="outline"
              onClick={() => navigate("/app/workflows")}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="min-w-[160px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Workflow
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
};

export default CreateWorkflow;
