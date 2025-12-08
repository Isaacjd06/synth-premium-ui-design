import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AdvisoryItemProps {
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
}

const AdvisoryItem = ({ title, description, priority = "medium" }: AdvisoryItemProps) => {
  return (
    <Card className="bg-muted/10 border-border/30 p-4 hover:bg-muted/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground">{title}</h4>
            {priority === "high" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 uppercase tracking-wide">
                High
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default AdvisoryItem;
