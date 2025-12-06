import { Link } from "react-router-dom";
import { Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppCard from "@/components/app/AppCard";

interface AccessRestrictionMessageProps {
  title?: string;
  description?: string;
  showUpgradeButton?: boolean;
  variant?: "full" | "inline" | "banner";
}

const AccessRestrictionMessage = ({
  title = "Subscription Required",
  description = "Activate your subscription to access this feature.",
  showUpgradeButton = true,
  variant = "full",
}: AccessRestrictionMessageProps) => {
  if (variant === "banner") {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {showUpgradeButton && (
          <Button asChild className="shrink-0">
            <Link to="/app/billing">Activate Subscription</Link>
          </Button>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>{description}</span>
        {showUpgradeButton && (
          <Link to="/app/billing" className="text-primary hover:underline">
            Upgrade
          </Link>
        )}
      </div>
    );
  }

  return (
    <AppCard>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
        {showUpgradeButton && (
          <Button asChild size="lg">
            <Link to="/app/billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Activate Subscription
            </Link>
          </Button>
        )}
      </div>
    </AppCard>
  );
};

export default AccessRestrictionMessage;
