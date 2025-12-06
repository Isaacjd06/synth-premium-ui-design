import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { User, Link2, CreditCard, Settings as SettingsIcon, LogOut, Loader2 } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
  createdAt: "January 10, 2025"
};

const Settings = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  
  const [name, setName] = useState(mockUser.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Profile updated successfully");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Logged out successfully");
    // In real app: redirect to landing page
    window.location.href = '/';
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Connections</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Avatar & Basic Info */}
              <AppCard>
                <h2 className="text-lg font-medium text-foreground mb-6">Profile Information</h2>
                
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                      {mockUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">{mockUser.name}</p>
                    <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                    <p className="text-xs text-muted-foreground">Member since {mockUser.createdAt}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={mockUser.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </AppCard>

              {/* Account Actions */}
              <AppCard>
                <h2 className="text-lg font-medium text-foreground mb-4">Account</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Log out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><LogOut className="w-4 h-4 mr-2" />Log out</>
                      )}
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-destructive font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-destructive hover:text-destructive">
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              account and remove all your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </AppCard>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <AppCard className="text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Manage Billing</h2>
              <p className="text-muted-foreground mb-6">
                View your subscription, update payment methods, and manage invoices.
              </p>
              <Button asChild>
                <Link to="/pricing">Go to Billing</Link>
              </Button>
            </AppCard>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections">
            <AppCard className="text-center py-12">
              <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Manage Connections</h2>
              <p className="text-muted-foreground mb-6">
                Connect your apps and manage integrations.
              </p>
              <Button asChild>
                <Link to="/app/connections">Go to Connections</Link>
              </Button>
            </AppCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default Settings;
