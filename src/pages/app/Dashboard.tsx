import AppShell from "@/components/app/AppShell";
import DashboardStats from "@/components/dashboard/DashboardStats";
import SynthUpdatesCard from "@/components/dashboard/SynthUpdatesCard";
import SynthAdvisoryCard from "@/components/dashboard/SynthAdvisoryCard";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your automations and get intelligent recommendations
          </p>
        </div>

        {/* Statistics Grid */}
        <DashboardStats />

        {/* Two-Column Layout for Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SynthUpdatesCard />
          <SynthAdvisoryCard />
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
