import { motion } from "framer-motion";
import AppShell from "@/components/app/AppShell";
import DashboardKPIBar from "@/components/dashboard/DashboardKPIBar";
import DashboardPerformanceGraphs from "@/components/dashboard/DashboardPerformanceGraphs";
import DashboardAIObservations from "@/components/dashboard/DashboardAIObservations";
import DashboardAIRecommendations from "@/components/dashboard/DashboardAIRecommendations";
import DashboardPredictions from "@/components/dashboard/DashboardPredictions";
import DashboardIntegrationHealth from "@/components/dashboard/DashboardIntegrationHealth";
import DashboardWorkflowRankings from "@/components/dashboard/DashboardWorkflowRankings";
import DashboardBusinessImpact from "@/components/dashboard/DashboardBusinessImpact";
import DashboardActivityFeed from "@/components/dashboard/DashboardActivityFeed";
import DashboardIncidentInsights from "@/components/dashboard/DashboardIncidentInsights";
import DashboardSystemHealth from "@/components/dashboard/DashboardSystemHealth";
import DashboardUserBehavior from "@/components/dashboard/DashboardUserBehavior";
import DashboardAIMemory from "@/components/dashboard/DashboardAIMemory";
import DashboardSuggestedWorkflows from "@/components/dashboard/DashboardSuggestedWorkflows";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your automation command center
          </p>
        </motion.div>

        {/* Section 1: KPI Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <DashboardKPIBar />
        </motion.div>

        {/* Section 2: Performance Graphs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <DashboardPerformanceGraphs />
        </motion.div>

        {/* Section 3: AI Observations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="h-full">
          <DashboardAIObservations />
        </motion.div>

        {/* Section 4 & 5: AI Recommendations and Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="h-full">
            <DashboardAIRecommendations />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="h-full">
            <DashboardPredictions />
          </motion.div>
        </div>

        {/* Section 6: Integration Health */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="h-full">
          <DashboardIntegrationHealth />
        </motion.div>

        {/* Section 7: Workflow Rankings */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <DashboardWorkflowRankings />
        </motion.div>

        {/* Section 8: Business Impact */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="h-full">
          <DashboardBusinessImpact />
        </motion.div>

        {/* Section 9 & 10: Activity Feed and Incident Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="h-full">
            <DashboardActivityFeed />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="h-full">
            <DashboardIncidentInsights />
          </motion.div>
        </div>

        {/* Section 11: System Health */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="h-full">
          <DashboardSystemHealth />
        </motion.div>

        {/* Section 12 & 13: User Behavior and AI Memory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="h-full">
            <DashboardUserBehavior />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="h-full">
            <DashboardAIMemory />
          </motion.div>
        </div>

        {/* Section 14: Suggested Workflows */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="h-full">
          <DashboardSuggestedWorkflows />
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
