import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Loader2, 
  Check, 
  ExternalLink,
  Filter,
  ShieldCheck,
  Mail,
  MessageSquare,
  FileText,
  Database,
  Calendar,
  Trello,
  Github,
  Slack,
  Cloud,
  Zap,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Phone,
  Video,
  Music,
  Image,
  Globe,
  Key
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ConnectionApp {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
  verified: boolean;
  connectionType: "OAuth" | "APIKey";
  connected: boolean;
  connectedSince?: string;
  lastVerified?: string;
}

// Mock database of available connections
const allConnections: ConnectionApp[] = [
  { id: "gmail", name: "Gmail", description: "Send and receive emails, manage labels and drafts", category: "Communication", icon: Mail, iconColor: "text-red-400", verified: true, connectionType: "OAuth", connected: false },
  { id: "slack", name: "Slack", description: "Team messaging, channels, and notifications", category: "Communication", icon: Slack, iconColor: "text-purple-400", verified: true, connectionType: "OAuth", connected: true, connectedSince: "2025-01-08", lastVerified: "2025-01-15" },
  { id: "notion", name: "Notion", description: "Documents, databases, and wikis", category: "Productivity", icon: FileText, iconColor: "text-foreground", verified: true, connectionType: "OAuth", connected: false },
  { id: "google-calendar", name: "Google Calendar", description: "Calendar events and scheduling", category: "Productivity", icon: Calendar, iconColor: "text-blue-400", verified: true, connectionType: "OAuth", connected: true, connectedSince: "2025-01-10", lastVerified: "2025-01-14" },
  { id: "trello", name: "Trello", description: "Project boards, lists, and cards", category: "Productivity", icon: Trello, iconColor: "text-sky-400", verified: true, connectionType: "OAuth", connected: false },
  { id: "github", name: "GitHub", description: "Code repositories, issues, and pull requests", category: "Development", icon: Github, iconColor: "text-foreground", verified: true, connectionType: "OAuth", connected: false },
  { id: "airtable", name: "Airtable", description: "Spreadsheets and relational databases", category: "Storage", icon: Database, iconColor: "text-yellow-400", verified: true, connectionType: "APIKey", connected: false },
  { id: "hubspot", name: "HubSpot", description: "CRM, marketing, and sales automation", category: "Marketing", icon: MessageSquare, iconColor: "text-orange-400", verified: true, connectionType: "APIKey", connected: false },
  { id: "google-drive", name: "Google Drive", description: "Cloud storage and file management", category: "Storage", icon: Cloud, iconColor: "text-yellow-500", verified: true, connectionType: "OAuth", connected: false },
  { id: "zapier", name: "Zapier", description: "Connect to thousands of other apps", category: "Automation", icon: Zap, iconColor: "text-orange-500", verified: true, connectionType: "APIKey", connected: false },
  { id: "google-analytics", name: "Google Analytics", description: "Website analytics and reporting", category: "Analytics", icon: BarChart3, iconColor: "text-yellow-400", verified: true, connectionType: "OAuth", connected: false },
  { id: "shopify", name: "Shopify", description: "E-commerce platform and store management", category: "E-commerce", icon: ShoppingCart, iconColor: "text-green-400", verified: true, connectionType: "OAuth", connected: false },
  { id: "stripe", name: "Stripe", description: "Payment processing and billing", category: "Finance", icon: CreditCard, iconColor: "text-purple-500", verified: true, connectionType: "APIKey", connected: false },
  { id: "twilio", name: "Twilio", description: "SMS, voice, and video communications", category: "Communication", icon: Phone, iconColor: "text-red-500", verified: true, connectionType: "APIKey", connected: false },
  { id: "zoom", name: "Zoom", description: "Video meetings and webinars", category: "Communication", icon: Video, iconColor: "text-blue-500", verified: true, connectionType: "OAuth", connected: false },
  { id: "spotify", name: "Spotify", description: "Music streaming and playlists", category: "Media", icon: Music, iconColor: "text-green-500", verified: false, connectionType: "OAuth", connected: false },
  { id: "unsplash", name: "Unsplash", description: "High-quality stock photos", category: "Media", icon: Image, iconColor: "text-foreground", verified: false, connectionType: "APIKey", connected: false },
];

const categories = ["All", "Communication", "Productivity", "Storage", "Development", "Marketing", "Analytics", "E-commerce", "Finance", "Automation", "Media"];

interface ConnectionSearchProps {
  onConnectionChange?: () => void;
}

const ConnectionSearch = ({ onConnectionChange }: ConnectionSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [connections, setConnections] = useState<ConnectionApp[]>(allConnections);
  const [filteredConnections, setFilteredConnections] = useState<ConnectionApp[]>(allConnections);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  
  // Detail modal state
  const [selectedConnection, setSelectedConnection] = useState<ConnectionApp | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Disconnect confirmation state
  const [disconnectTarget, setDisconnectTarget] = useState<ConnectionApp | null>(null);
  const [disconnectConfirmText, setDisconnectConfirmText] = useState("");
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, connections]);

  const performSearch = useCallback(() => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      let results = [...connections];
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(c => 
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (selectedCategory !== "All") {
        results = results.filter(c => c.category === selectedCategory);
      }
      
      setFilteredConnections(results);
      setIsSearching(false);
    }, 200);
  }, [searchQuery, selectedCategory, connections]);

  const handleConnect = async (connection: ConnectionApp) => {
    setConnectingId(connection.id);
    
    toast.info(`Connecting to ${connection.name}...`, { duration: 1500 });
    
    // Simulate OAuth flow
    await new Promise(r => setTimeout(r, 2000));
    
    const today = new Date().toISOString().split('T')[0];
    setConnections(prev => prev.map(c => 
      c.id === connection.id 
        ? { ...c, connected: true, connectedSince: today, lastVerified: today }
        : c
    ));
    
    setConnectingId(null);
    toast.success(`Successfully connected to ${connection.name}!`);
    onConnectionChange?.();
  };

  const handleDisconnect = async () => {
    if (!disconnectTarget || disconnectConfirmText.toLowerCase() !== disconnectTarget.name.toLowerCase()) return;
    
    setIsDisconnecting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    setConnections(prev => prev.map(c => 
      c.id === disconnectTarget.id 
        ? { ...c, connected: false, connectedSince: undefined, lastVerified: undefined }
        : c
    ));
    
    setIsDisconnecting(false);
    setDisconnectTarget(null);
    setDisconnectConfirmText("");
    toast.success(`Disconnected from ${disconnectTarget.name}`);
    onConnectionChange?.();
  };

  const openConnectionDetail = (connection: ConnectionApp) => {
    setSelectedConnection(connection);
    setIsDetailOpen(true);
  };

  const connectedApps = filteredConnections.filter(c => c.connected);
  const availableApps = filteredConnections.filter(c => !c.connected);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for an app to connect (e.g., Gmail, Slack, Google Drive...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 bg-background border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {isSearching ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching...
              </span>
            ) : (
              `${filteredConnections.length} service${filteredConnections.length !== 1 ? 's' : ''} found`
            )}
          </span>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-4 border-border bg-card">
              <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Connected Services Section */}
      {!isSearching && connectedApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Your Connected Services ({connectedApps.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {connectedApps.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors cursor-pointer"
                    onClick={() => openConnectionDetail(connection)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg bg-muted ${connection.iconColor}`}>
                        <connection.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground truncate">{connection.name}</h4>
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 shrink-0">
                            Connected
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{connection.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Since {connection.connectedSince}</span>
                          <span className="text-border">•</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {connection.connectionType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Available Services Section */}
      {!isSearching && availableApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Available Services ({availableApps.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {availableApps.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4 border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg bg-muted ${connection.iconColor}`}>
                        <connection.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground truncate">{connection.name}</h4>
                          {connection.verified && (
                            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{connection.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{connection.category}</Badge>
                          <Badge variant="outline" className="text-xs">{connection.connectionType}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => { e.stopPropagation(); handleConnect(connection); }}
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
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-2">No connections found</p>
          <p className="text-sm text-muted-foreground/70">
            Try a different search term or category
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Connection Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedConnection && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-lg bg-muted ${selectedConnection.iconColor}`}>
                    <selectedConnection.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedConnection.name}
                      {selectedConnection.verified && (
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                      )}
                    </DialogTitle>
                    <Badge variant="outline" className="mt-1">{selectedConnection.category}</Badge>
                  </div>
                </div>
                <DialogDescription>{selectedConnection.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg border border-border bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      {selectedConnection.connected ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Connected
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                          Not Connected
                        </>
                      )}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Connection Type</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      {selectedConnection.connectionType === "OAuth" ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      {selectedConnection.connectionType}
                    </p>
                  </div>
                  {selectedConnection.connected && (
                    <>
                      <div className="p-3 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Connected Since</p>
                        <p className="font-medium text-foreground">{selectedConnection.connectedSince}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Last Verified</p>
                        <p className="font-medium text-foreground">{selectedConnection.lastVerified}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                {selectedConnection.connected ? (
                  <>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setIsDetailOpen(false);
                        setDisconnectTarget(selectedConnection);
                      }}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleConnect(selectedConnection);
                    }}
                    disabled={connectingId === selectedConnection.id}
                  >
                    {connectingId === selectedConnection.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={!!disconnectTarget} onOpenChange={(open) => !open && setDisconnectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Disconnect from {disconnectTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>This may affect workflows that use this connection.</p>
              <p className="text-sm">
                Type <span className="font-mono font-bold text-foreground">{disconnectTarget?.name}</span> to confirm:
              </p>
              <Input
                value={disconnectConfirmText}
                onChange={(e) => setDisconnectConfirmText(e.target.value)}
                placeholder={disconnectTarget?.name}
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisconnectConfirmText("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDisconnect}
              disabled={disconnectConfirmText.toLowerCase() !== disconnectTarget?.name.toLowerCase() || isDisconnecting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConnectionSearch;
