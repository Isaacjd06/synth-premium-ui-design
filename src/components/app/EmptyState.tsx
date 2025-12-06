import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppCard from "./AppCard";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction
}: EmptyStateProps) => {
  return (
    <AppCard className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      
      {actionLabel && (actionLink || onAction) && (
        actionLink ? (
          <Button asChild>
            <Link to={actionLink}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </AppCard>
  );
};

export default EmptyState;
