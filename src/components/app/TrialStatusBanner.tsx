import { Link } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrialStatusBannerProps {
  daysRemaining?: number;
  isTrialing?: boolean;
  isPaid?: boolean;
}

const TrialStatusBanner = ({ 
  daysRemaining = 3, 
  isTrialing = true, 
  isPaid = false 
}: TrialStatusBannerProps) => {
  // Don't show if user is paid
  if (isPaid) return null;

  // Show trial banner
  if (isTrialing && daysRemaining > 0) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Free Trial Active
            </p>
            <p className="text-xs text-muted-foreground">
              {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link to="/pricing">Upgrade Now</Link>
        </Button>
      </div>
    );
  }

  // Show expired/inactive banner
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-destructive/20">
          <Clock className="w-4 h-4 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Subscription Inactive
          </p>
          <p className="text-xs text-muted-foreground">
            Activate to unlock all features
          </p>
        </div>
      </div>
      <Button asChild size="sm">
        <Link to="/pricing">Activate Subscription</Link>
      </Button>
    </div>
  );
};

// Small badge version for header
export const TrialBadge = ({ daysRemaining = 3, isTrialing = true }: { daysRemaining?: number; isTrialing?: boolean }) => {
  if (!isTrialing) return null;
  
  return (
    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs">
      <Clock className="w-3 h-3 mr-1" />
      {daysRemaining}d trial
    </Badge>
  );
};

export default TrialStatusBanner;
