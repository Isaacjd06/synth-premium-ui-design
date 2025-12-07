import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, Loader2, RefreshCw, MoreVertical, 
  ExternalLink, Unlink, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

export interface ServiceConnection {
  id: string;
  service_name: string;
  service_key: string;
  icon: React.ReactNode;
  status: "connected" | "not_connected" | "error" | "expired";
  connection_type: "OAuth" | "APIKey" | null;
  connected_at: string | null;
  last_verified: string | null;
  error_message?: string;
}

interface ServiceCardProps {
  service: ServiceConnection;
  onConnect: (serviceKey: string) => void;
  onDisconnect: (serviceId: string) => void;
  onReauthenticate: (serviceId: string) => void;
  isConnecting?: boolean;
}

const ServiceCard = ({ 
  service, 
  onConnect, 
  onDisconnect, 
  onReauthenticate,
  isConnecting 
}: ServiceCardProps) => {
  const isConnected = service.status === "connected";
  const isExpired = service.status === "expired";
  const hasError = service.status === "error";
  
  const getStatusBadge = () => {
    switch (service.status) {
      case "connected":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            <Check className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-muted-foreground">
            Not Connected
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-lg border transition-colors
        ${isConnected 
          ? "border-green-500/30 bg-green-500/5" 
          : isExpired || hasError
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border bg-card hover:border-primary/30"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
            {service.icon}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{service.service_name}</h3>
            {isConnected && service.connected_at && (
              <p className="text-xs text-muted-foreground">
                Connected since {formatDate(service.connected_at)}
              </p>
            )}
            {(isExpired || hasError) && service.error_message && (
              <p className="text-xs text-amber-400 mt-1">
                {service.error_message}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onReauthenticate(service.id)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-authenticate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDisconnect(service.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isExpired ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onReauthenticate(service.id)}
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Re-authenticate
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={() => onConnect(service.service_key)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          )}
        </div>
      </div>
      
      {isConnected && service.last_verified && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last verified: {formatDate(service.last_verified)}</span>
          {service.connection_type && (
            <Badge variant="outline" className="text-xs">
              {service.connection_type}
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ServiceCard;
