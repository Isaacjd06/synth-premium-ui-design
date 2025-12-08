import AppShell from "@/components/app/AppShell";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import SynthUpdatesSection from "@/components/dashboard/SynthUpdatesSection";
import SynthAdvisorySection from "@/components/dashboard/SynthAdvisorySection";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your automations and get intelligent recommendations
          </p>
        </div>

        {/* Statistics Grid */}
        <DashboardStatsGrid />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SynthUpdatesSection />
          <SynthAdvisorySection />
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
