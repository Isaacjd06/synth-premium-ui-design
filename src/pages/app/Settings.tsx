import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { User, Shield, Link2, CreditCard } from "lucide-react";

const settingsTabs = [
  { title: "Profile", href: "/app/settings/profile", icon: User },
  { title: "Account", href: "/app/settings/account", icon: Shield },
  { title: "Connections", href: "/app/connections", icon: Link2 },
  { title: "Billing", href: "/app/billing", icon: CreditCard },
];

const Settings = () => {
  const location = useLocation();

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your profile, account, and preferences.
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {settingsTabs.map((tab) => (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    location.pathname === tab.href || 
                    (tab.href === "/app/settings/profile" && location.pathname === "/app/settings")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;
