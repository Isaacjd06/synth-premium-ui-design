import { motion } from "framer-motion";
import AppShell from "@/components/app/AppShell";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import SynthUpdatesSection from "@/components/dashboard/SynthUpdatesSection";
import SynthAdvisorySection from "@/components/dashboard/SynthAdvisorySection";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your automations and get intelligent recommendations
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardStatsGrid />
        </motion.div>

        {/* Synth Updates - Full Width Major Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <SynthUpdatesSection />
        </motion.div>

        {/* Synth Advisory - Full Width Below Updates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SynthAdvisorySection />
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
