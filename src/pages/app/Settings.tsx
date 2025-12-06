import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CreditCard, Link2, Shield, LogOut, Loader2, Camera } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard, href: "/app/billing" },
  { id: "connections", label: "Connections", icon: Link2, href: "/app/connections" },
  { id: "account", label: "Account", icon: Shield },
];

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: null,
  createdAt: "Jan 1, 2025",
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(mockUser.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Profile updated successfully");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={mockUser.avatar || undefined} />
                  <AvatarFallback className="text-xl bg-primary/20 text-primary">
                    {mockUser.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-foreground">{mockUser.name}</h3>
                <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={mockUser.email}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Account Created</Label>
                <p className="text-sm text-muted-foreground">{mockUser.createdAt}</p>
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </motion.div>
        );

      case "account":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Logout Section */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Session</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign out of your account on this device.
              </p>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Logging out...</>
                ) : (
                  <><LogOut className="w-4 h-4 mr-2" />Log Out</>
                )}
              </Button>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div>
              <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="outline" className="text-destructive hover:text-destructive border-destructive/50 hover:border-destructive">
                Delete Account
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="md:w-48 shrink-0">
            <nav className="flex md:flex-col gap-1">
              {settingsTabs.map((tab) => (
                tab.href ? (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </Link>
                ) : (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <AppCard>
              {renderTabContent()}
            </AppCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;
