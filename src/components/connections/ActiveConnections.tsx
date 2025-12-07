import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Check, 
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Mail,
  MessageSquare,
  FileText,
  Database,
  Calendar,
  Github,
  Cloud,
  Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { toast } from "sonner";

interface ActiveConnection {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  status: "connected" | "error" | "expired";
  connectionType: "OAuth" | "APIKey";
  connectedSince: string;
  lastVerified: string;
  affectedWorkflows?: string[];
}

const mockActiveConnections: ActiveConnection[] = [
  { 
    id: "gmail", 
    name: "Gmail", 
    description: "Send and receive emails", 
    icon: Mail, 
    iconColor: "text-red-400", 
    status: "connected",
    connectionType: "OAuth",
    connectedSince: "2025-01-10",
    lastVerified: "2025-01-15T10:30:00Z",
    affectedWorkflows: ["Daily Email Summary", "Lead Notifications"]
  },
  { 
    id: "slack", 
    name: "Slack", 
    description: "Team messaging and notifications", 
    icon: MessageSquare, 
    iconColor: "text-purple-400", 
    status: "connected",
    connectionType: "OAuth",
    connectedSince: "2025-01-08",
    lastVerified: "2025-01-15T09:00:00Z",
    affectedWorkflows: ["Team Alerts", "Daily Standup"]
  },
  { 
    id: "notion", 
    name: "Notion", 
    description: "Documents and databases", 
    icon: FileText, 
    iconColor: "text-foreground", 
    status: "expired",
    connectionType: "OAuth",
    connectedSince: "2025-01-05",
    lastVerified: "2025-01-10T14:00:00Z",
    affectedWorkflows: ["Meeting Notes Sync"]
  },
  { 
    id: "google-drive", 
    name: "Google Drive", 
    description: "Cloud storage and file management", 
    icon: Folder, 
    iconColor: "text-yellow-400", 
    status: "connected",
    connectionType: "OAuth",
    connectedSince: "2025-01-12",
    lastVerified: "2025-01-15T08:00:00Z"
  },
];

const ActiveConnections = () => {
  const [connections, setConnections] = useState<ActiveConnection[]>(mockActiveConnections);
  const [selectedConnection, setSelectedConnection] = useState<ActiveConnection | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [disconnectConfirmation, setDisconnectConfirmation] = useState("");
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const handleViewDetails = (connection: ActiveConnection) => {
    setSelectedConnection(connection);
    setIsDetailOpen(true);
  };

  const handleDisconnectClick = (connection: ActiveConnection) => {
    setSelectedConnection(connection);
    setIsDisconnectOpen(true);
  };

  const handleDisconnect = async () => {
    if (!selectedConnection || disconnectConfirmation !== selectedConnection.name) return;
    
    setIsDisconnecting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    setConnections(prev => prev.filter(c => c.id !== selectedConnection.id));
    setIsDisconnecting(false);
    setIsDisconnectOpen(false);
    setDisconnectConfirmation("");
    setSelectedConnection(null);
    toast.success(`Disconnected from ${selectedConnection.name}`);
  };

  const handleReauthenticate = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    setIsReauthenticating(connectionId);
    toast.info(`Re-authenticating ${connection.name}...`);
    
    await new Promise(r => setTimeout(r, 2000));
    
    setConnections(prev => prev.map(c => 
      c.id === connectionId 
        ? { ...c, status: "connected", lastVerified: new Date().toISOString() }
        : c
    ));
    
    setIsReauthenticating(null);
    toast.success(`Successfully re-authenticated ${connection.name}`);
  };

  const handleTestConnection = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    setIsTesting(connectionId);
    await new Promise(r => setTimeout(r, 1500));
    
    setConnections(prev => prev.map(c => 
      c.id === connectionId 
        ? { ...c, lastVerified: new Date().toISOString() }
        : c
    ));
    
    setIsTesting(null);
    toast.success(`Connection to ${connection.name} is working`);
  };

  const getStatusBadge = (status: ActiveConnection["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/20">
            <Check className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case "error":
        return (
          <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-400 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Cloud className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Active Connections</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You haven't connected any services yet. Search above to find and connect your favorite apps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Your Connected Services ({connections.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border bg-card ${
              connection.status === "connected" 
                ? "border-green-500/30" 
                : connection.status === "expired"
                ? "border-yellow-500/30"
                : "border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg bg-muted ${connection.iconColor}`}>
                <connection.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{connection.name}</h4>
                  {getStatusBadge(connection.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{connection.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Since {connection.connectedSince}</span>
                  <span>•</span>
                  <span>{connection.connectionType}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleViewDetails(connection)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleReauthenticate(connection.id)}
                    disabled={isReauthenticating === connection.id}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isReauthenticating === connection.id ? "animate-spin" : ""}`} />
                    Re-authenticate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDisconnectClick(connection)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {connection.status !== "connected" && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleReauthenticate(connection.id)}
                  disabled={isReauthenticating === connection.id}
                >
                  {isReauthenticating === connection.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Re-authenticating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-authenticate
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Connection Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedConnection && (
                <>
                  <div className={`p-2 rounded-lg bg-muted ${selectedConnection.iconColor}`}>
                    <selectedConnection.icon className="w-5 h-5" />
                  </div>
                  {selectedConnection.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedConnection?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedConnection && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedConnection.status)}
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Connection Type</p>
                  <p className="text-sm font-medium text-foreground">{selectedConnection.connectionType}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Connected Since</p>
                  <p className="text-sm font-medium text-foreground">{selectedConnection.connectedSince}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Last Verified</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedConnection.lastVerified).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedConnection.affectedWorkflows && selectedConnection.affectedWorkflows.length > 0 && (
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Used in Workflows</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConnection.affectedWorkflows.map(wf => (
                      <Badge key={wf} variant="secondary" className="text-xs">
                        {wf}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => selectedConnection && handleTestConnection(selectedConnection.id)}
              disabled={isTesting === selectedConnection?.id}
            >
              {isTesting === selectedConnection?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setIsDetailOpen(false);
                if (selectedConnection) handleDisconnectClick(selectedConnection);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={isDisconnectOpen} onOpenChange={setIsDisconnectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Disconnect {selectedConnection?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Are you sure you want to disconnect from {selectedConnection?.name}?</p>
              
              {selectedConnection?.affectedWorkflows && selectedConnection.affectedWorkflows.length > 0 && (
                <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                  <p className="text-sm font-medium text-yellow-400 mb-2">
                    This will affect the following workflows:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {selectedConnection.affectedWorkflows.map(wf => (
                      <li key={wf}>{wf}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <Label htmlFor="disconnectConfirm" className="text-foreground">
                  Type <span className="font-mono font-bold">{selectedConnection?.name}</span> to confirm:
                </Label>
                <Input
                  id="disconnectConfirm"
                  value={disconnectConfirmation}
                  onChange={(e) => setDisconnectConfirmation(e.target.value)}
                  placeholder={selectedConnection?.name}
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisconnectConfirmation("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={disconnectConfirmation !== selectedConnection?.name || isDisconnecting}
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

export default ActiveConnections;
