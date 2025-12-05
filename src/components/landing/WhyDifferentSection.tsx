import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Brain, Layers, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Truly Intelligent",
    description: "Synth doesn't just execute—it understands context, learns patterns, and adapts to your evolving needs automatically.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Go from idea to working automation in minutes. No coding, no complex configurations, no steep learning curve.",
  },
  {
    icon: Layers,
    title: "Infinitely Composable",
    description: "Build complex workflows by combining simple automations. Each piece works independently but scales together.",
  },
  {
    icon: Shield,
    title: "Enterprise-Ready",
    description: "Bank-grade security, SOC 2 compliance, and granular permissions. Built for teams that move fast but stay secure.",
  },
];

const WhyDifferentSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden">
      {/* Seamless background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-surface/40 to-transparent" />
      
      {/* Hex pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0z' fill='none' stroke='%233b82f6' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }} />
      
      {/* Floating glow */}
      <motion.div 
        className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%)",
        }}
        animate={{ x: [-50, 50, -50], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Why Different
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
          >
            Built for the <span className="text-gradient">modern</span> team
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group h-full p-8 rounded-3xl bg-card/50 backdrop-blur-md border border-primary/10 hover:border-primary/30 transition-all duration-500"
                style={{
                  boxShadow: "0 0 40px hsl(var(--primary)/0.05)",
                }}
              >
                <div className="flex items-start gap-5">
                  <motion.div 
                    className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;