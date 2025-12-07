import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Loader2, 
  Check, 
  Shield,
  Mail,
  MessageSquare,
  FileText,
  Database,
  Calendar,
  Github,
  Cloud,
  BarChart3,
  CreditCard,
  Phone,
  Video,
  ShoppingCart,
  Megaphone,
  Users,
  Folder,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Connection {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  category: string;
  verified: boolean;
  connectionType: "OAuth" | "APIKey";
}

const allConnections: Connection[] = [
  { id: "gmail", name: "Gmail", description: "Send and receive emails, manage labels and filters", icon: Mail, iconColor: "text-red-400", category: "Communication", verified: true, connectionType: "OAuth" },
  { id: "slack", name: "Slack", description: "Team messaging, channels, and notifications", icon: MessageSquare, iconColor: "text-purple-400", category: "Communication", verified: true, connectionType: "OAuth" },
  { id: "google-drive", name: "Google Drive", description: "Cloud storage and file management", icon: Folder, iconColor: "text-yellow-400", category: "Storage", verified: true, connectionType: "OAuth" },
  { id: "dropbox", name: "Dropbox", description: "File synchronization and sharing", icon: Cloud, iconColor: "text-blue-400", category: "Storage", verified: true, connectionType: "OAuth" },
  { id: "notion", name: "Notion", description: "Documents, wikis, and databases", icon: FileText, iconColor: "text-foreground", category: "Productivity", verified: true, connectionType: "OAuth" },
  { id: "google-calendar", name: "Google Calendar", description: "Calendar events and scheduling", icon: Calendar, iconColor: "text-blue-400", category: "Productivity", verified: true, connectionType: "OAuth" },
  { id: "github", name: "GitHub", description: "Code repositories, issues, and pull requests", icon: Github, iconColor: "text-foreground", category: "Development", verified: true, connectionType: "OAuth" },
  { id: "airtable", name: "Airtable", description: "Spreadsheets and relational databases", icon: Database, iconColor: "text-yellow-400", category: "Productivity", verified: true, connectionType: "APIKey" },
  { id: "hubspot", name: "HubSpot", description: "CRM, marketing, and sales automation", icon: Megaphone, iconColor: "text-orange-400", category: "Marketing", verified: true, connectionType: "APIKey" },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM and sales platform", icon: Cloud, iconColor: "text-blue-500", category: "CRM", verified: true, connectionType: "OAuth" },
  { id: "stripe", name: "Stripe", description: "Payment processing and billing", icon: CreditCard, iconColor: "text-purple-500", category: "Payments", verified: true, connectionType: "APIKey" },
  { id: "twilio", name: "Twilio", description: "SMS, voice, and communication APIs", icon: Phone, iconColor: "text-red-500", category: "Communication", verified: true, connectionType: "APIKey" },
  { id: "zoom", name: "Zoom", description: "Video meetings and webinars", icon: Video, iconColor: "text-blue-400", category: "Communication", verified: true, connectionType: "OAuth" },
  { id: "shopify", name: "Shopify", description: "E-commerce platform and store management", icon: ShoppingCart, iconColor: "text-green-400", category: "E-commerce", verified: true, connectionType: "OAuth" },
  { id: "mailchimp", name: "Mailchimp", description: "Email marketing and automation", icon: Mail, iconColor: "text-yellow-500", category: "Marketing", verified: true, connectionType: "APIKey" },
  { id: "intercom", name: "Intercom", description: "Customer messaging and support", icon: MessageSquare, iconColor: "text-blue-500", category: "Support", verified: true, connectionType: "APIKey" },
  { id: "zendesk", name: "Zendesk", description: "Customer service and ticketing", icon: Users, iconColor: "text-green-500", category: "Support", verified: true, connectionType: "OAuth" },
  { id: "google-analytics", name: "Google Analytics", description: "Website and app analytics", icon: BarChart3, iconColor: "text-orange-400", category: "Analytics", verified: true, connectionType: "OAuth" },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics and user tracking", icon: BarChart3, iconColor: "text-purple-400", category: "Analytics", verified: false, connectionType: "APIKey" },
  { id: "zapier", name: "Zapier", description: "Workflow automation platform", icon: Zap, iconColor: "text-orange-500", category: "Automation", verified: true, connectionType: "APIKey" },
];

const categories = ["All", "Communication", "Storage", "Productivity", "Development", "Marketing", "CRM", "Payments", "E-commerce", "Support", "Analytics", "Automation"];

interface ConnectionSearchProps {
  onConnect?: (connectionId: string) => void;
}

const ConnectionSearch = ({ onConnect }: ConnectionSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Connection[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  const performSearch = useCallback((query: string, category: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = allConnections;
      
      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.category.toLowerCase().includes(lowerQuery)
        );
      }
      
      if (category !== "All") {
        filtered = filtered.filter(c => c.category === category);
      }
      
      setResults(filtered);
      setIsSearching(false);
      setHasSearched(true);
    }, 300);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, performSearch]);

  const handleConnect = async (connectionId: string) => {
    const connection = allConnections.find(c => c.id === connectionId);
    if (!connection) return;

    setConnectingId(connectionId);
    toast.info(`Connecting to ${connection.name}...`);
    
    // Simulate OAuth flow
    await new Promise(r => setTimeout(r, 2000));
    
    setConnectingId(null);
    toast.success(`Successfully connected to ${connection.name}!`);
    onConnect?.(connectionId);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for an app to connect (e.g., Gmail, Slack, Google Drive...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 h-12 text-base bg-card border-border"
        />
        {(searchQuery || selectedCategory !== "All") && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 && hasSearched ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No connections found. Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {results.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg bg-muted ${connection.iconColor}`}>
                      <connection.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{connection.name}</h4>
                        {connection.verified && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-400 border-green-500/20">
                            <Shield className="w-2.5 h-2.5 mr-0.5" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {connection.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {connection.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {connection.connectionType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      size="sm"
                      className="w-full"
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
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionSearch;
