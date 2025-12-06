import AppShell from "@/components/app/AppShell";
import SynthUpdatesCard from "@/components/dashboard/SynthUpdatesCard";
import SynthAdvisoryCard from "@/components/dashboard/SynthAdvisoryCard";
import TrialStatusBanner from "@/components/shared/TrialStatusBanner";

// Mock subscription state
const mockSubscription = {
  isTrialing: true,
  daysRemaining: 2,
  isActive: true,
};

const Dashboard = () => {
  const isUnpaid = !mockSubscription.isActive && !mockSubscription.isTrialing;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        {/* Trial Banner */}
        {mockSubscription.isTrialing && (
          <div className="mb-6">
            <TrialStatusBanner 
              daysRemaining={mockSubscription.daysRemaining} 
              isTrialing={mockSubscription.isTrialing} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Synth Updates Panel */}
          <div className="lg:col-span-2">
            <SynthUpdatesCard isUnpaid={isUnpaid} />
          </div>

          {/* Synth Advisory Panel */}
          <div className="lg:col-span-2">
            <SynthAdvisoryCard isUnpaid={isUnpaid} />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
