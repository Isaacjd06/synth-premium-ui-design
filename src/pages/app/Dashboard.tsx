import AppShell from "@/components/app/AppShell";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import SynthUpdatesSection from "@/components/dashboard/SynthUpdatesSection";
import SynthAdvisorySection from "@/components/dashboard/SynthAdvisorySection";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your automations and get intelligent recommendations
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <DashboardStatsGrid />
        </div>

        {/* Synth Updates - Full Width Major Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <SynthUpdatesSection />
        </div>

        {/* Synth Advisory - Full Width Below Updates */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <SynthAdvisorySection />
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
