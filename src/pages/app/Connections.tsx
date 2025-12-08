import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Users,
  Database,
  Webhook,
  Calendar,
  Github,
  Trello,
  Cloud,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import IntegrationCard, { Integration } from "@/components/connections/IntegrationCard";
import ConnectionFilters from "@/components/connections/ConnectionFilters";
import ConnectionDrawer from "@/components/connections/ConnectionDrawer";
import ConnectionsEmptyState from "@/components/connections/ConnectionsEmptyState";
import HelpCard from "@/components/connections/HelpCard";
import { toast } from "sonner";

const mockIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send messages and notifications to your team channels",
    icon: MessageSquare,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/20",
    status: "connected",
    lastConnected: "Jan 10, 2025",
    lastUsed: "2 hours ago",
    category: "communication",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and receive emails automatically",
    icon: Mail,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    status: "connected",
    lastConnected: "Jan 8, 2025",
    lastUsed: "5 minutes ago",
    category: "communication",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Read and write data to spreadsheets",
    icon: FileSpreadsheet,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
    status: "connected",
    lastConnected: "Jan 5, 2025",
    lastUsed: "1 day ago",
    category: "storage",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Manage pages, databases, and documentation",
    icon: FileText,
    iconColor: "text-foreground",
    iconBg: "bg-muted",
    status: "expired",
    lastConnected: "Dec 15, 2024",
    lastUsed: "2 weeks ago",
    category: "storage",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    icon: CreditCard,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/20",
    status: "connected",
    lastConnected: "Jan 2, 2025",
    lastUsed: "3 hours ago",
    category: "payments",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Manage contacts, deals, and marketing",
    icon: Users,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/20",
    status: "disconnected",
    category: "crm",
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Connect to flexible databases and tables",
    icon: Database,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/20",
    status: "disconnected",
    category: "storage",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Receive events from external services",
    icon: Webhook,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    status: "connected",
    lastConnected: "Jan 12, 2025",
    lastUsed: "10 minutes ago",
    category: "other",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Schedule events and manage calendars",
    icon: Calendar,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/20",
    status: "disconnected",
    category: "communication",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Track issues, PRs, and repository events",
    icon: Github,
    iconColor: "text-foreground",
    iconBg: "bg-muted",
    status: "disconnected",
    category: "other",
  },
  {
    id: "trello",
    name: "Trello",
    description: "Manage boards, lists, and cards",
    icon: Trello,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/20",
    status: "expired",
    lastConnected: "Dec 20, 2024",
    lastUsed: "3 weeks ago",
    category: "storage",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Store and sync files in the cloud",
    icon: Cloud,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    status: "disconnected",
    category: "storage",
  },
];

const Connections = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesSearch = integration.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || integration.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || integration.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [integrations, searchQuery, statusFilter, categoryFilter]);

  const handleConnect = async (id: string) => {
    setConnectingId(id);
    const integration = integrations.find((i) => i.id === id);
    
    toast.info(`Connecting to ${integration?.name}...`);
    await new Promise((r) => setTimeout(r, 2000));

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "connected" as const,
              lastConnected: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              lastUsed: "Just now",
            }
          : i
      )
    );

    setConnectingId(null);
    toast.success(`Successfully connected to ${integration?.name}!`);
  };

  const handleManage = (integration: Integration) => {
    setSelectedIntegration(integration);
    setDrawerOpen(true);
  };

  const handleReconnect = async (id: string) => {
    setDrawerOpen(false);
    await handleConnect(id);
  };

  const handleDisconnect = async (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "disconnected" as const,
              lastConnected: undefined,
              lastUsed: undefined,
            }
          : i
      )
    );

    setDrawerOpen(false);
    toast.success(`Disconnected from ${integration?.name}`);
  };

  const connectedCount = integrations.filter(
    (i) => i.status === "connected"
  ).length;
  const needsReconnectCount = integrations.filter(
    (i) => i.status === "expired"
  ).length;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Connections
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Connect apps to Synth so your workflows can automate across your tools.
          </p>
          {connectedCount > 0 && (
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-green-400">
                {connectedCount} connected
              </span>
              {needsReconnectCount > 0 && (
                <span className="text-red-400">
                  {needsReconnectCount} needs reconnect
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <ConnectionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
        />

        {/* Integration Grid */}
        {filteredIntegrations.length === 0 ? (
          <ConnectionsEmptyState onConnect={() => setStatusFilter("all")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredIntegrations.map((integration, index) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                index={index}
                onConnect={handleConnect}
                onManage={handleManage}
                isConnecting={connectingId === integration.id}
              />
            ))}
          </div>
        )}

        {/* Help Card */}
        <HelpCard />

        {/* Connection Drawer */}
        <ConnectionDrawer
          integration={selectedIntegration}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReconnect={handleReconnect}
          onDisconnect={handleDisconnect}
        />
      </div>
    </AppShell>
  );
};

export default Connections;
