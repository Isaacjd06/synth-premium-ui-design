import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Check, 
  ExternalLink,
  Mail,
  MessageSquare,
  FileText,
  Database,
  Calendar,
  Trello,
  Github,
  Slack,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Sparkles,
  ShieldCheck,
  Cloud,
  Zap,
  BarChart3,
  CreditCard,
  ShoppingCart,
  Users,
  Video,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  connected: boolean;
  connectedSince?: string;
  connectionType: "OAuth" | "APIKey";
  category: string;
  verified?: boolean;
}

const allServices: Service[] = [
  { id: "gmail", name: "Gmail", description: "Send and receive emails automatically", icon: Mail, iconColor: "text-red-400", connected: true, connectedSince: "2025-01-10", connectionType: "OAuth", category: "Communication", verified: true },
  { id: "slack", name: "Slack", description: "Team messaging and notifications", icon: Slack, iconColor: "text-purple-400", connected: true, connectedSince: "2025-01-08", connectionType: "OAuth", category: "Communication", verified: true },
  { id: "notion", name: "Notion", description: "Documents and databases", icon: FileText, iconColor: "text-foreground", connected: false, connectionType: "OAuth", category: "Productivity", verified: true },
  { id: "google-calendar", name: "Google Calendar", description: "Calendar events and scheduling", icon: Calendar, iconColor: "text-blue-400", connected: false, connectionType: "OAuth", category: "Productivity", verified: true },
  { id: "trello", name: "Trello", description: "Project boards and tasks", icon: Trello, iconColor: "text-sky-400", connected: false, connectionType: "OAuth", category: "Productivity", verified: true },
  { id: "github", name: "GitHub", description: "Code repositories and issues", icon: Github, iconColor: "text-foreground", connected: false, connectionType: "OAuth", category: "Development", verified: true },
  { id: "airtable", name: "Airtable", description: "Spreadsheets and databases", icon: Database, iconColor: "text-yellow-400", connected: false, connectionType: "APIKey", category: "Storage", verified: true },
  { id: "hubspot", name: "HubSpot", description: "CRM and marketing automation", icon: MessageSquare, iconColor: "text-orange-400", connected: false, connectionType: "APIKey", category: "Marketing", verified: true },
  { id: "google-drive", name: "Google Drive", description: "Cloud storage and file sharing", icon: Cloud, iconColor: "text-green-400", connected: false, connectionType: "OAuth", category: "Storage", verified: true },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM platform", icon: BarChart3, iconColor: "text-blue-500", connected: false, connectionType: "OAuth", category: "Marketing", verified: true },
  { id: "stripe", name: "Stripe", description: "Payment processing and billing", icon: CreditCard, iconColor: "text-violet-400", connected: false, connectionType: "APIKey", category: "Payments", verified: true },
  { id: "shopify", name: "Shopify", description: "E-commerce platform", icon: ShoppingCart, iconColor: "text-green-500", connected: false, connectionType: "OAuth", category: "E-commerce", verified: true },
  { id: "zoom", name: "Zoom", description: "Video conferencing and meetings", icon: Video, iconColor: "text-blue-400", connected: false, connectionType: "OAuth", category: "Communication", verified: true },
  { id: "intercom", name: "Intercom", description: "Customer messaging platform", icon: Headphones, iconColor: "text-blue-500", connected: false, connectionType: "APIKey", category: "Support" },
  { id: "mailchimp", name: "Mailchimp", description: "Email marketing campaigns", icon: Mail, iconColor: "text-yellow-500", connected: false, connectionType: "APIKey", category: "Marketing" },
  { id: "teams", name: "Microsoft Teams", description: "Team collaboration and chat", icon: Users, iconColor: "text-indigo-400", connected: false, connectionType: "OAuth", category: "Communication" },
];

const categories = ["All", "Communication", "Productivity", "Storage", "Marketing", "Development", "Payments", "E-commerce", "Support"];

interface AvailableServicesProps {
  onConnectionChange?: () => void;
}

const AvailableServices = ({ onConnectionChange }: AvailableServicesProps) => {
  const [services, setServices] = useState<Service[]>(allServices);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [disconnectService, setDisconnectService] = useState<Service | null>(null);
  const [disconnectConfirmName, setDisconnectConfirmName] = useState("");

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    let filtered = services;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    return filtered;
  }, [services, searchQuery, selectedCategory]);

  const connectedServices = useMemo(() => filteredServices.filter(s => s.connected), [filteredServices]);
  const availableToConnect = useMemo(() => filteredServices.filter(s => !s.connected), [filteredServices]);

  // Suggested services (not connected, verified, limited to 6)
  const suggestedServices = useMemo(() => 
    services.filter(s => !s.connected && s.verified).slice(0, 6)
  , [services]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 300);
    }
  };

  const handleConnect = async (serviceId: string) => {
    setConnectingId(serviceId);
    
    toast.info(`Connecting to ${services.find(s => s.id === serviceId)?.name}...`);
    await new Promise(r => setTimeout(r, 2000));
    
    setServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { ...s, connected: true, connectedSince: new Date().toISOString().split('T')[0] }
        : s
    ));
    
    setConnectingId(null);
    toast.success(`Successfully connected to ${services.find(s => s.id === serviceId)?.name}!`);
    onConnectionChange?.();
  };

  const handleDisconnect = async () => {
    if (!disconnectService || disconnectConfirmName !== disconnectService.name) return;
    
    setDisconnectingId(disconnectService.id);
    
    await new Promise(r => setTimeout(r, 1000));
    
    setServices(prev => prev.map(s => 
      s.id === disconnectService.id 
        ? { ...s, connected: false, connectedSince: undefined }
        : s
    ));
    
    setDisconnectingId(null);
    setDisconnectService(null);
    setDisconnectConfirmName("");
    toast.success(`Disconnected from ${disconnectService.name}`);
    onConnectionChange?.();
  };

  const handleReauthenticate = async (service: Service) => {
    setConnectingId(service.id);
    toast.info(`Re-authenticating ${service.name}...`);
    await new Promise(r => setTimeout(r, 1500));
    setConnectingId(null);
    toast.success(`Successfully re-authenticated ${service.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for an app to connect (e.g., Gmail, Slack, Google Drive...)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 h-12 text-base bg-card border-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results / Loading */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-lg border border-border bg-card animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchQuery && filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No connections found for "{searchQuery}"</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Suggested Services */}
      {!searchQuery && suggestedServices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Suggested for You
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">Based on your workflows and usage patterns</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${service.iconColor}`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{service.name}</h4>
                      {service.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {service.category}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConnect(service.id)}
                    disabled={connectingId === service.id}
                  >
                    {connectingId === service.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Services */}
      {connectedServices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Your Connected Services ({connectedServices.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border border-green-500/30 bg-green-500/5"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${service.iconColor}`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{service.name}</h4>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Connected since {service.connectedSince}</span>
                      <span>•</span>
                      <span>{service.connectionType}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailService(service)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReauthenticate(service)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-authenticate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDisconnectService(service)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Services */}
      {availableToConnect.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Available Services ({availableToConnect.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableToConnect.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${service.iconColor}`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{service.name}</h4>
                      {service.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {service.connectionType}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConnect(service.id)}
                    disabled={connectingId === service.id}
                  >
                    {connectingId === service.id ? (
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
      )}

      {/* Empty State */}
      {!searchQuery && services.filter(s => !s.connected).length === 0 && (
        <div className="text-center py-12">
          <Check className="w-12 h-12 mx-auto text-green-400 mb-4" />
          <p className="text-muted-foreground">All available services are connected!</p>
        </div>
      )}

      {/* Connection Detail Modal */}
      <Dialog open={!!detailService} onOpenChange={() => setDetailService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {detailService && (
                <>
                  <div className={`p-2 rounded-lg bg-muted ${detailService.iconColor}`}>
                    <detailService.icon className="w-5 h-5" />
                  </div>
                  {detailService.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {detailService?.description}
            </DialogDescription>
          </DialogHeader>
          {detailService && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Connected
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Connection Type</p>
                  <p className="text-sm font-medium text-foreground">{detailService.connectionType}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Connected Since</p>
                  <p className="text-sm font-medium text-foreground">{detailService.connectedSince}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm font-medium text-foreground">{detailService.category}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => detailService && handleReauthenticate(detailService)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setDisconnectService(detailService);
                setDetailService(null);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation */}
      <AlertDialog open={!!disconnectService} onOpenChange={() => {
        setDisconnectService(null);
        setDisconnectConfirmName("");
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Disconnect {disconnectService?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Are you sure you want to disconnect from {disconnectService?.name}?</p>
              <p className="text-amber-400 text-sm">
                ⚠️ This may affect workflows that use this connection.
              </p>
              <div className="pt-2">
                <label className="text-sm text-foreground block mb-2">
                  Type <span className="font-mono font-bold">{disconnectService?.name}</span> to confirm:
                </label>
                <Input
                  value={disconnectConfirmName}
                  onChange={(e) => setDisconnectConfirmName(e.target.value)}
                  placeholder={disconnectService?.name}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisconnectConfirmName("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={disconnectConfirmName !== disconnectService?.name || disconnectingId === disconnectService?.id}
              className="bg-destructive hover:bg-destructive/90"
            >
              {disconnectingId === disconnectService?.id ? (
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

export default AvailableServices;
