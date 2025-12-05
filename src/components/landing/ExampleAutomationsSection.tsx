import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Mail, 
  FileText, 
  Calendar, 
  Bell, 
  Database, 
  Share2,
  MessageSquare,
  PieChart
} from "lucide-react";

const automations = [
  {
    icon: Mail,
    title: "Smart Email Routing",
    description: "Automatically categorize and route incoming emails to the right team.",
  },
  {
    icon: FileText,
    title: "Document Processing",
    description: "Extract data from documents and sync to your systems instantly.",
  },
  {
    icon: Calendar,
    title: "Meeting Intelligence",
    description: "Auto-schedule follow-ups and create tasks from meeting notes.",
  },
  {
    icon: Bell,
    title: "Alert Orchestration",
    description: "Smart notifications that reach the right person at the right time.",
  },
  {
    icon: Database,
    title: "Data Synchronization",
    description: "Keep all your tools in perfect sync without manual exports.",
  },
  {
    icon: Share2,
    title: "Cross-Platform Workflows",
    description: "Connect 500+ apps and create seamless cross-platform flows.",
  },
  {
    icon: MessageSquare,
    title: "Customer Response",
    description: "Draft personalized responses using context from your CRM.",
  },
  {
    icon: PieChart,
    title: "Report Generation",
    description: "Automated reports that compile data from multiple sources.",
  },
];

const ExampleAutomationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 md:py-40 bg-synth-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--synth-blue-glow)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-semibold text-synth-blue-light uppercase tracking-wider mb-4"
          >
            Example Automations
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground max-w-3xl mx-auto"
          >
            Endless possibilities, <span className="text-synth-blue-light">zero limits</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {automations.map((automation, index) => (
            <motion.div
              key={automation.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
                  <automation.icon className="w-5 h-5 text-primary" />
                </div>
                
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {automation.title}
                </h3>
                
                <p className="text-sm text-white/50 leading-relaxed">
                  {automation.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleAutomationsSection;
