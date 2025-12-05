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
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden">
      {/* Seamless darker gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-navy/60 to-transparent" />
      
      {/* Neural network pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-primary/40"
          animate={{ scale: [1.5, 1, 1.5], opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-primary/30"
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Example Automations
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground max-w-3xl mx-auto"
          >
            Endless possibilities, <span className="text-primary">zero limits</span>
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
                className="group h-full p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-primary/10 hover:border-primary/40 transition-all duration-300"
                style={{
                  boxShadow: "inset 0 1px 0 0 hsl(var(--primary)/0.1)",
                }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/25 group-hover:border-primary/40 transition-all duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <automation.icon className="w-5 h-5 text-primary" />
                </motion.div>
                
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {automation.title}
                </h3>
                
                <p className="text-sm text-foreground/60 leading-relaxed">
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