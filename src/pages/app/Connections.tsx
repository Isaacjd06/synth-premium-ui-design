import AppShell from "@/components/app/AppShell";
import ConnectionsGrid from "@/components/connections/ConnectionsGrid";

const Connections = () => {
  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Connected Services
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
            Connect your favorite apps and services to enable powerful workflow automations. 
            Synth uses secure OAuth authentication to access only what's needed.
          </p>
        </div>

        {/* Connections Grid */}
        <ConnectionsGrid />
      </div>
    </AppShell>
  );
};

export default Connections;
