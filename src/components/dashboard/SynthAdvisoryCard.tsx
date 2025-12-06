import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, Lightbulb, TrendingUp, Shield, Zap,
  ArrowRight, RefreshCw, ChevronRight
} from "lucide-react";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Insight {
  id: string;
  category: "efficiency" | "optimization" | "growth" | "reliability";
  title: string;
  description: string;
  action?: {
    label: string;
    link: string;
  };
  priority: "high" | "medium" | "low";
}

const mockInsights: Insight[] = [
  {
    id: "1",
    category: "efficiency",
    title: "Consolidate similar workflows",
    description: "You have 3 workflows that send Slack notifications. Consider combining them into a single parameterized workflow to reduce maintenance.",
    action: { label: "Review workflows", link: "/app/workflows" },
    priority: "medium",
  },
  {
    id: "2",
    category: "optimization",
    title: "Add error handling",
    description: "\"Send Welcome Email\" has a 4% failure rate. Adding retry logic could improve reliability significantly.",
    action: { label: "Edit workflow", link: "/app/workflows/1" },
    priority: "high",
  },
  {
    id: "3",
    category: "growth",
    title: "Expand your knowledge base",
    description: "Your workflows could benefit from more context. Consider adding business rules for lead qualification.",
    action: { label: "Add knowledge", link: "/app/knowledge" },
    priority: "low",
  },
  {
    id: "4",
    category: "reliability",
    title: "Connect backup notification channel",
    description: "If Slack is down, your notifications won't be delivered. Consider adding an email fallback.",
    action: { label: "Add connection", link: "/app/connections" },
    priority: "medium",
  },
];

const categoryConfig = {
  efficiency: { icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
  optimization: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  growth: { icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
  reliability: { icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const priorityConfig = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-muted text-muted-foreground border-border",
};

interface SynthAdvisoryCardProps {
  isUnpaid?: boolean;
}

const SynthAdvisoryCard = ({ isUnpaid = false }: SynthAdvisoryCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setDismissedIds([]);
  };

  const handleDismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
  };

  const visibleInsights = mockInsights.filter(i => !dismissedIds.includes(i.id));

  if (isUnpaid) {
    return (
      <AppCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-accent text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Synth Advisory
          </h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">AI Insights Locked</h3>
          <p className="text-muted-foreground mb-4">
            Get personalized AI-driven recommendations to optimize your workflows.
          </p>
          <Button asChild>
            <Link to="/app/billing">Unlock Insights</Link>
          </Button>
        </div>
      </AppCard>
    );
  }

  return (
    <AppCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent text-xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Synth Advisory
        </h2>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        AI-powered recommendations to improve your automation workflows.
      </p>

      {visibleInsights.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            All caught up! No new recommendations at this time.
          </p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={handleRefresh}>
            Check again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleInsights.map((insight, index) => {
            const config = categoryConfig[insight.category];
            const Icon = config.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{insight.title}</span>
                      <Badge className={priorityConfig[insight.priority]} variant="outline">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      {insight.action && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={insight.action.link} className="flex items-center gap-1">
                            {insight.action.label}
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => handleDismiss(insight.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </AppCard>
  );
};

export default SynthAdvisoryCard;
