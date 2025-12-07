import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Sparkles,
  Mail,
  MessageSquare,
  Calendar,
  Database,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SuggestedConnection {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  reason: string;
  connectionType: "OAuth" | "APIKey";
}

const suggestedConnections: SuggestedConnection[] = [
  { 
    id: "google-calendar", 
    name: "Google Calendar", 
    description: "Calendar events and scheduling", 
    icon: Calendar, 
    iconColor: "text-blue-400", 
    reason: "Pairs well with your Gmail connection",
    connectionType: "OAuth"
  },
  { 
    id: "notion", 
    name: "Notion", 
    description: "Documents, wikis, and databases", 
    icon: MessageSquare, 
    iconColor: "text-foreground", 
    reason: "Great for documenting your workflows",
    connectionType: "OAuth"
  },
  { 
    id: "airtable", 
    name: "Airtable", 
    description: "Spreadsheets and databases", 
    icon: Database, 
    iconColor: "text-yellow-400", 
    reason: "Store and manage workflow data",
    connectionType: "APIKey"
  },
  { 
    id: "google-analytics", 
    name: "Google Analytics", 
    description: "Website and app analytics", 
    icon: BarChart3, 
    iconColor: "text-orange-400", 
    reason: "Track workflow performance metrics",
    connectionType: "OAuth"
  },
];

interface SuggestedConnectionsProps {
  onConnect?: (connectionId: string) => void;
}

const SuggestedConnections = ({ onConnect }: SuggestedConnectionsProps) => {
  const [suggestions, setSuggestions] = useState<SuggestedConnection[]>(suggestedConnections);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = async (connectionId: string) => {
    const connection = suggestions.find(c => c.id === connectionId);
    if (!connection) return;

    setConnectingId(connectionId);
    toast.info(`Connecting to ${connection.name}...`);
    
    await new Promise(r => setTimeout(r, 2000));
    
    setSuggestions(prev => prev.filter(c => c.id !== connectionId));
    setConnectingId(null);
    toast.success(`Successfully connected to ${connection.name}!`);
    onConnect?.(connectionId);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Suggested for You
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Based on your workflows and usage patterns
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-lg border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-muted ${connection.iconColor}`}>
                <connection.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm">{connection.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                  {connection.description}
                </p>
                <p className="text-xs text-primary/80 italic">
                  {connection.reason}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={() => handleConnect(connection.id)}
                disabled={connectingId === connection.id}
              >
                {connectingId === connection.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedConnections;
