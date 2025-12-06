import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ReadOnlyBadgeProps {
  message?: string;
}

const ReadOnlyBadge = ({ 
  message = "This feature is read-only. Activate your subscription to make changes." 
}: ReadOnlyBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-medium">
          <Eye className="w-3 h-3" />
          Read-only
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-xs">{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ReadOnlyBadge;
