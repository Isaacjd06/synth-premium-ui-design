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
    <section ref={ref} className="py-36 md:py-48 relative overflow-hidden">
      {/* Alternating gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-navy/50 to-transparent" />
      
      {/* Neural network nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${20 + i * 20}%`,
              top: `${25 + (i % 2) * 50}%`,
            }}
            animate={{ 
              scale: [1, 1.8, 1], 
              opacity: [0.3, 0.7, 0.3] 
            }}
            transition={{ 
              duration: 4 + i, 
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_50%_50%/0.015)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_50%_50%/0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-20 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-accent text-primary uppercase tracking-widest mb-5"
          >
            Example Automations
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight text-foreground max-w-3xl mx-auto"
          >
            Endless possibilities, <span className="text-gradient-accent">zero limits</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {automations.map((automation, index) => (
            <motion.div
              key={automation.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group h-full p-6 lg:p-7 rounded-2xl card-premium relative overflow-hidden"
              >
                <motion.div 
                  className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/20 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary/25 group-hover:border-primary/50 icon-glow"
                  whileHover={{ rotate: 5 }}
                >
                  <automation.icon className="w-5 h-5 text-primary" />
                </motion.div>
                
                <h3 className="text-base font-display font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors duration-300">
                  {automation.title}
                </h3>
                
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {automation.description}
                </p>
                
                {/* Subtle hover glow edge */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/20 transition-all duration-300 pointer-events-none" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleAutomationsSection;