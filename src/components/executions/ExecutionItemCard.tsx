import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Calendar } from "lucide-react";
import ExecutionStatusBadge, { ExecutionStatus } from "./ExecutionStatusBadge";
import WorkflowTriggerIcon, { TriggerType } from "@/components/workflows/WorkflowTriggerIcon";

export interface ExecutionItemCardProps {
  id: string;
  executionId: string;
  workflowName: string;
  status: ExecutionStatus;
  trigger: TriggerType;
  startTime: string;
  endTime: string;
  duration: string;
  summary: string;
  onViewDetails: () => void;
}

const ExecutionItemCard = ({
  executionId,
  workflowName,
  status,
  trigger,
  startTime,
  endTime,
  duration,
  summary,
  onViewDetails,
}: ExecutionItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-card border-border/50 p-4 hover:border-primary/30 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <ExecutionStatusBadge status={status} />
            <div>
              <h3 className="text-sm font-semibold text-foreground">{workflowName}</h3>
              <p className="text-[10px] text-muted-foreground font-mono">ID: {executionId}</p>
            </div>
          </div>
          <WorkflowTriggerIcon trigger={trigger} showLabel />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Started</p>
              <p className="text-xs text-foreground">{startTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Finished</p>
              <p className="text-xs text-foreground">{endTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Duration</p>
              <p className="text-xs text-foreground font-medium">{duration}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{summary}</p>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="h-7 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            View Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ExecutionItemCard;
