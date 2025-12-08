import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Target, Sparkles } from "lucide-react";
import { TriggerOption } from "./TriggerSelector";

interface WorkflowSummaryCardProps {
  workflowName: string;
  onNameChange: (name: string) => void;
  intent: string;
  trigger: TriggerOption;
  triggerDetails: string;
  outcome: string;
}

const triggerLabels: Record<TriggerOption, string> = {
  event: "Event-based trigger",
  schedule: "Scheduled run",
  manual: "Manual trigger",
  once: "One-time execution",
  condition: "Conditional trigger",
};

const WorkflowSummaryCard = ({
  workflowName,
  onNameChange,
  intent,
  trigger,
  triggerDetails,
  outcome,
}: WorkflowSummaryCardProps) => {
  // Auto-generate name if empty
  const displayName = workflowName || (intent ? generateNameFromIntent(intent) : "My Workflow");

  return (
    <Card className="bg-card border-border/50 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Workflow Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Editable name */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Workflow Name</Label>
          <Input
            value={workflowName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={displayName}
            className="bg-muted/30 border-border/50 font-medium"
          />
        </div>

        {/* Summary sections */}
        <div className="space-y-3 pt-2">
          {/* Intent summary */}
          {intent && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Intent</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{intent}</p>
              </div>
            </div>
          )}

          {/* Trigger summary */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
            <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Trigger</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                  {triggerLabels[trigger]}
                </Badge>
                {triggerDetails && (
                  <span className="text-xs text-muted-foreground">• {triggerDetails}</span>
                )}
              </div>
            </div>
          </div>

          {/* Outcome summary */}
          {outcome && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
              <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Outcome</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{outcome}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!intent && !outcome && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Fill in the fields above to see your workflow summary
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper to generate a name from intent
function generateNameFromIntent(intent: string): string {
  const words = intent.split(" ").slice(0, 4);
  return words.join(" ").replace(/[.,!?]/g, "") + "...";
}

export default WorkflowSummaryCard;
