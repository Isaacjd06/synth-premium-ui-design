import AppShell from "@/components/app/AppShell";
import SynthUpdatesCard from "@/components/dashboard/SynthUpdatesCard";
import SynthAdvisoryCard from "@/components/dashboard/SynthAdvisoryCard";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your automations and get intelligent recommendations
          </p>
        </div>

        {/* Dashboard Cards */}
        <SynthUpdatesCard />
        <SynthAdvisoryCard />
      </div>
    </AppShell>
  );
};

export default Dashboard;
