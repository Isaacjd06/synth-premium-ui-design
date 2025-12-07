import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Sparkles,
  Mail,
  MessageSquare,
  Calendar,
  Cloud,
  BarChart3,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SuggestedApp {
  id: string;
  name: string;
  description: string;
  reason: string;
  icon: React.ElementType;
  iconColor: string;
}

const suggestedConnections: SuggestedApp[] = [
  { 
    id: "gmail", 
    name: "Gmail", 
    description: "Email automation", 
    reason: "Popular for workflow automation",
    icon: Mail, 
    iconColor: "text-red-400" 
  },
  { 
    id: "slack", 
    name: "Slack", 
    description: "Team notifications", 
    reason: "Great for alerts and updates",
    icon: MessageSquare, 
    iconColor: "text-purple-400" 
  },
  { 
    id: "google-calendar", 
    name: "Google Calendar", 
    description: "Schedule automation", 
    reason: "Automate scheduling tasks",
    icon: Calendar, 
    iconColor: "text-blue-400" 
  },
  { 
    id: "google-drive", 
    name: "Google Drive", 
    description: "File management", 
    reason: "Store and organize files",
    icon: Cloud, 
    iconColor: "text-yellow-500" 
  },
  { 
    id: "notion", 
    name: "Notion", 
    description: "Documentation", 
    reason: "Centralize your knowledge",
    icon: FileText, 
    iconColor: "text-foreground" 
  },
  { 
    id: "google-analytics", 
    name: "Google Analytics", 
    description: "Track metrics", 
    reason: "Monitor your analytics",
    icon: BarChart3, 
    iconColor: "text-yellow-400" 
  },
];

interface SuggestedConnectionsProps {
  onConnect?: (id: string) => void;
}

const SuggestedConnections = ({ onConnect }: SuggestedConnectionsProps) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const handleConnect = async (app: SuggestedApp) => {
    setConnectingId(app.id);
    toast.info(`Connecting to ${app.name}...`, { duration: 1500 });
    
    await new Promise(r => setTimeout(r, 2000));
    
    setConnectedIds(prev => new Set([...prev, app.id]));
    setConnectingId(null);
    toast.success(`Successfully connected to ${app.name}!`);
    onConnect?.(app.id);
  };

  const availableSuggestions = suggestedConnections.filter(s => !connectedIds.has(s.id));

  if (availableSuggestions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        Suggested for You
      </h3>
      <p className="text-xs text-muted-foreground">Based on popular workflows and usage patterns</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {availableSuggestions.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-3 border-border bg-card hover:border-primary/50 transition-colors text-center">
              <div className={`p-2 rounded-lg bg-muted mx-auto w-fit mb-2 ${app.iconColor}`}>
                <app.icon className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-foreground text-sm truncate">{app.name}</h4>
              <p className="text-xs text-muted-foreground mb-2 truncate">{app.description}</p>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full text-xs h-7"
                onClick={() => handleConnect(app)}
                disabled={connectingId === app.id}
              >
                {connectingId === app.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Connect"
                )}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedConnections;
