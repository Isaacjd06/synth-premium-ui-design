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
    <section ref={ref} className="py-32 md:py-40 bg-synth-surface relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,hsl(var(--primary)/0.03)_25%,transparent_25%,transparent_75%,hsl(var(--primary)/0.03)_75%)] bg-[size:60px_60px]" />
      
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
            className="text-4xl md:text-5xl lg:text-6xl font-display"
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
                className="group h-full p-8 rounded-3xl bg-card-gradient glass-strong hover:shadow-glow transition-all duration-500"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
