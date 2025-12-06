import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppCard from "./AppCard";
import { Badge } from "@/components/ui/badge";

interface Advisory {
  id: string;
  category: 'efficiency' | 'optimization' | 'growth' | 'reliability';
  title: string;
  description: string;
  actionLink?: string;
  actionLabel?: string;
}

const mockAdvisories: Advisory[] = [
  {
    id: "1",
    category: "efficiency",
    title: "Consolidate Email Workflows",
    description: "You have 3 workflows sending emails. Consider combining them into one workflow with conditional logic to reduce complexity.",
    actionLink: "/app/workflows",
    actionLabel: "View Workflows"
  },
  {
    id: "2",
    category: "optimization",
    title: "Add Error Handling",
    description: "Your 'Sync CRM to Sheets' workflow doesn't have error handling. Adding retry logic could improve reliability.",
    actionLink: "/app/workflows/3",
    actionLabel: "Edit Workflow"
  },
  {
    id: "3",
    category: "growth",
    title: "Expand Your Knowledge Base",
    description: "Adding more context about your products and services will help Synth generate better automations.",
    actionLink: "/app/knowledge",
    actionLabel: "Add Knowledge"
  }
];

const categoryConfig = {
  efficiency: {
    icon: Zap,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  optimization: {
    icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30"
  },
  growth: {
    icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  },
  reliability: {
    icon: Shield,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  }
};

interface SynthAdvisoryCardProps {
  isPaid?: boolean;
}

const SynthAdvisoryCard = ({ isPaid = true }: SynthAdvisoryCardProps) => {
  if (!isPaid) {
    return (
      <AppCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-accent text-xl font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Synth Advisory
          </h2>
        </div>
        <div className="text-center py-8">
          <Lightbulb className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">
            Activate your subscription to get personalized AI insights and recommendations.
          </p>
          <Link 
            to="/pricing" 
            className="text-primary hover:underline text-sm font-medium"
          >
            Activate Subscription →
          </Link>
        </div>
      </AppCard>
    );
  }

  return (
    <AppCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent text-xl font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Synth Advisory
        </h2>
        <Badge variant="secondary" className="text-xs">
          {mockAdvisories.length} insights
        </Badge>
      </div>

      <div className="space-y-4">
        {mockAdvisories.map((advisory, index) => {
          const config = categoryConfig[advisory.category];
          const Icon = config.icon;

          return (
            <motion.div
              key={advisory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground text-sm">{advisory.title}</h3>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {advisory.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {advisory.description}
                  </p>
                  {advisory.actionLink && (
                    <Link 
                      to={advisory.actionLink}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {advisory.actionLabel}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppCard>
  );
};

export default SynthAdvisoryCard;
