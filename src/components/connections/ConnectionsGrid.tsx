import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, MessageSquare, FileText, Database, Calendar,
  Trello, Github, Loader2, Search, AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import ServiceCard, { ServiceConnection } from "./ServiceCard";

// Mock available services
const availableServices: Omit<ServiceConnection, 'id' | 'connected_at' | 'last_verified' | 'error_message'>[] = [
  { 
    service_name: "Gmail", 
    service_key: "gmail", 
    icon: <Mail className="w-5 h-5 text-red-400" />,
    status: "connected",
    connection_type: "OAuth"
  },
  { 
    service_name: "Slack", 
    service_key: "slack", 
    icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
    status: "connected",
    connection_type: "OAuth"
  },
  { 
    service_name: "Google Drive", 
    service_key: "google_drive", 
    icon: <FileText className="w-5 h-5 text-yellow-400" />,
    status: "not_connected",
    connection_type: null
  },
  { 
    service_name: "Notion", 
    service_key: "notion", 
    icon: <FileText className="w-5 h-5 text-foreground" />,
    status: "expired",
    connection_type: "OAuth"
  },
  { 
    service_name: "Airtable", 
    service_key: "airtable", 
    icon: <Database className="w-5 h-5 text-blue-400" />,
    status: "not_connected",
    connection_type: null
  },
  { 
    service_name: "Google Calendar", 
    service_key: "google_calendar", 
    icon: <Calendar className="w-5 h-5 text-blue-500" />,
    status: "not_connected",
    connection_type: null
  },
  { 
    service_name: "Trello", 
    service_key: "trello", 
    icon: <Trello className="w-5 h-5 text-blue-400" />,
    status: "not_connected",
    connection_type: null
  },
  { 
    service_name: "GitHub", 
    service_key: "github", 
    icon: <Github className="w-5 h-5 text-foreground" />,
    status: "connected",
    connection_type: "OAuth"
  },
];

const ConnectionsGrid = () => {
  const [services, setServices] = useState<ServiceConnection[]>(
    availableServices.map((s, i) => ({
      ...s,
      id: `service-${i}`,
      connected_at: s.status === "connected" ? "2025-01-10T10:00:00Z" : null,
      last_verified: s.status === "connected" ? "2025-01-15T10:00:00Z" : null,
      error_message: s.status === "expired" ? "Token expired. Please re-authenticate." : undefined,
    }))
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [connectingService, setConnectingService] = useState<string | null>(null);
  const [disconnectDialog, setDisconnectDialog] = useState<{ open: boolean; serviceId: string | null; serviceName: string }>({
    open: false,
    serviceId: null,
    serviceName: "",
  });
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const filteredServices = services.filter(s =>
    s.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const connectedServices = filteredServices.filter(s => s.status === "connected");
  const availableToConnect = filteredServices.filter(s => s.status !== "connected");
  
  const handleConnect = async (serviceKey: string) => {
    setConnectingService(serviceKey);
    
    try {
      // Simulate OAuth flow
      toast.info(`Connecting to ${serviceKey}...`, {
        description: "You'll be redirected to authenticate",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setServices(prev => prev.map(s => 
        s.service_key === serviceKey 
          ? { 
              ...s, 
              status: "connected" as const, 
              connected_at: new Date().toISOString(),
              last_verified: new Date().toISOString(),
              connection_type: "OAuth" as const,
              error_message: undefined,
            }
          : s
      ));
      
      toast.success("Connection successful!", {
        description: `${serviceKey} has been connected to your account`,
      });
    } catch (error) {
      toast.error("Connection failed", {
        description: "Please try again or contact support",
      });
    } finally {
      setConnectingService(null);
    }
  };
  
  const handleDisconnect = async () => {
    if (!disconnectDialog.serviceId) return;
    
    setIsDisconnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setServices(prev => prev.map(s => 
        s.id === disconnectDialog.serviceId 
          ? { 
              ...s, 
              status: "not_connected" as const, 
              connected_at: null,
              last_verified: null,
              connection_type: null,
            }
          : s
      ));
      
      toast.success("Disconnected successfully");
      setDisconnectDialog({ open: false, serviceId: null, serviceName: "" });
    } catch (error) {
      toast.error("Failed to disconnect");
    } finally {
      setIsDisconnecting(false);
    }
  };
  
  const handleReauthenticate = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setConnectingService(service.service_key);
    
    try {
      toast.info("Re-authenticating...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setServices(prev => prev.map(s => 
        s.id === serviceId 
          ? { 
              ...s, 
              status: "connected" as const,
              last_verified: new Date().toISOString(),
              error_message: undefined,
            }
          : s
      ));
      
      toast.success("Re-authentication successful!");
    } catch (error) {
      toast.error("Re-authentication failed");
    } finally {
      setConnectingService(null);
    }
  };
  
  const openDisconnectDialog = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setDisconnectDialog({ open: true, serviceId, serviceName: service.service_name });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Connected Services */}
      {connectedServices.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Connected Services ({connectedServices.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {connectedServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onConnect={handleConnect}
                  onDisconnect={openDisconnectDialog}
                  onReauthenticate={handleReauthenticate}
                  isConnecting={connectingService === service.service_key}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Available Services */}
      {availableToConnect.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Available Services ({availableToConnect.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {availableToConnect.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onConnect={handleConnect}
                  onDisconnect={openDisconnectDialog}
                  onReauthenticate={handleReauthenticate}
                  isConnecting={connectingService === service.service_key}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No services match your search." : "No services available."}
          </p>
        </div>
      )}
      
      {/* Disconnect Confirmation Dialog */}
      <AlertDialog 
        open={disconnectDialog.open} 
        onOpenChange={(open) => !open && setDisconnectDialog({ open: false, serviceId: null, serviceName: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Disconnect {disconnectDialog.serviceName}?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will disconnect {disconnectDialog.serviceName} from your account. 
                Any workflows using this connection may stop working.
              </p>
              <p className="text-amber-400 text-sm">
                You can reconnect at any time.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={isDisconnecting}
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

export default ConnectionsGrid;
