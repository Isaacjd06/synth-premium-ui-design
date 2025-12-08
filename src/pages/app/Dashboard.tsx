import { motion } from "framer-motion";
import AppShell from "@/components/app/AppShell";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import SynthUpdatesSection from "@/components/dashboard/SynthUpdatesSection";
import SynthAdvisorySection from "@/components/dashboard/SynthAdvisorySection";

const Dashboard = () => {
  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-screen-xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your automations and get intelligent recommendations
          </p>
        </div>

        {/* Statistics Grid */}
        <DashboardStatsGrid />

        {/* Synth Updates - Full Width Major Section */}
        <SynthUpdatesSection />

        {/* Synth Advisory - Full Width Below Updates */}
        <SynthAdvisorySection />
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
