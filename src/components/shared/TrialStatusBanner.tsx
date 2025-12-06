import { Link } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrialStatusBannerProps {
  daysRemaining: number;
  isTrialing?: boolean;
}

const TrialStatusBanner = ({ daysRemaining, isTrialing = true }: TrialStatusBannerProps) => {
  if (!isTrialing) return null;

  const isUrgent = daysRemaining <= 1;
  const bgColor = isUrgent 
    ? "bg-amber-500/10 border-amber-500/30" 
    : "bg-primary/10 border-primary/30";
  const iconColor = isUrgent ? "text-amber-500" : "text-primary";
  const textColor = isUrgent ? "text-amber-400" : "text-primary";

  return (
    <div className={`${bgColor} border rounded-lg p-3 flex items-center justify-between gap-3`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${isUrgent ? "bg-amber-500/20" : "bg-primary/20"} flex items-center justify-center shrink-0`}>
          {isUrgent ? (
            <Clock className={`w-4 h-4 ${iconColor}`} />
          ) : (
            <Sparkles className={`w-4 h-4 ${iconColor}`} />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {daysRemaining === 0 
              ? "Trial ends today!" 
              : daysRemaining === 1 
                ? "1 day left in your trial" 
                : `${daysRemaining} days left in your trial`
            }
          </p>
          <p className="text-xs text-muted-foreground">
            {isUrgent 
              ? "Subscribe now to keep your workflows running." 
              : "Explore all features during your trial period."
            }
          </p>
        </div>
      </div>
      <Button asChild size="sm" variant={isUrgent ? "default" : "outline"}>
        <Link to="/app/billing">
          {isUrgent ? "Subscribe Now" : "View Plans"}
        </Link>
      </Button>
    </div>
  );
};

export default TrialStatusBanner;
