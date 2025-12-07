import AppShell from "@/components/app/AppShell";
import SynthUpdatesCard from "@/components/dashboard/SynthUpdatesCard";
import SynthAdvisoryCard from "@/components/dashboard/SynthAdvisoryCard";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        <div className="space-y-6">
          <SynthUpdatesCard />
          <SynthAdvisoryCard />
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
