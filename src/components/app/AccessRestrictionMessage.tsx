import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppCard from "./AppCard";

interface AccessRestrictionMessageProps {
  title?: string;
  description?: string;
  showCTA?: boolean;
}

const AccessRestrictionMessage = ({
  title = "Feature Restricted",
  description = "Activate your subscription to access this feature.",
  showCTA = true
}: AccessRestrictionMessageProps) => {
  return (
    <AppCard className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      
      {showCTA && (
        <Button asChild>
          <Link to="/pricing" className="inline-flex items-center gap-2">
            Activate Subscription
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </AppCard>
  );
};

export default AccessRestrictionMessage;
