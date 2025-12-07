import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Calendar, Clock, Workflow, PlaySquare, Link2, 
  HardDrive, AlertTriangle, Trash2, Loader2, Key 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { formatDate } from "@/lib/utils";

const SettingsAccount = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Mock account data
  const accountData = {
    email: "john@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    lastLogin: "2025-01-15T14:30:00Z",
    plan: "Growth",
    status: "active",
    trialEndsAt: null,
  };
  
  // Mock usage stats
  const usageStats = {
    activeWorkflows: 8,
    totalExecutions: 1247,
    connectedServices: 5,
    storageUsed: "256 MB",
    storageLimit: "5 GB",
  };
  
  const isOAuthUser = true; // Mock: would come from auth context
  const confirmationRequired = "DELETE";
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== confirmationRequired) return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Account deletion initiated");
      setIsDeleteDialogOpen(false);
      // In production: redirect to goodbye page or logout
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleChangePassword = async () => {
    toast.info("Password change email sent");
    setIsPasswordDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            View your account details and subscription status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-foreground">{accountData.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Created</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(accountData.createdAt)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Login</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {formatDate(accountData.lastLogin)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Subscription</p>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={accountData.status === "active" ? "default" : "secondary"}
                  className={accountData.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                >
                  {accountData.plan}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">
                  ({accountData.status})
                </span>
              </div>
            </div>
          </div>
          
          {accountData.trialEndsAt && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-400">
                Your trial ends on {formatDate(accountData.trialEndsAt)}. Upgrade to continue using Synth.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Usage Statistics */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Usage Statistics</CardTitle>
          <CardDescription>
            Overview of your Synth usage and resource consumption.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Workflow className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Active Workflows</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{usageStats.activeWorkflows}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlaySquare className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Executions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{usageStats.totalExecutions.toLocaleString()}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Connected Services</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{usageStats.connectedServices}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Storage Used</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{usageStats.storageUsed}</p>
              <p className="text-xs text-muted-foreground">of {usageStats.storageLimit}</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Actions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Account Actions</CardTitle>
          <CardDescription>
            Manage your account security and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Change Password - only for non-OAuth users */}
          {!isOAuthUser && (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your account password</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                  Change Password
                </Button>
              </div>
              <Separator />
            </>
          )}
          
          {/* Delete Account */}
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This action is <strong>permanent and irreversible</strong>. All your data will be deleted, including:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>All workflows and automations</li>
                <li>Execution history and logs</li>
                <li>Connected service integrations</li>
                <li>Knowledge base and memory data</li>
                <li>Subscription and billing information</li>
              </ul>
              <div className="pt-4">
                <Label htmlFor="delete-confirm" className="text-foreground">
                  Type <strong>{confirmationRequired}</strong> to confirm:
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={confirmationRequired}
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== confirmationRequired || isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              We'll send you an email with instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsAccount;
