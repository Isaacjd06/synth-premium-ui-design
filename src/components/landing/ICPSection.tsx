import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Code2, BarChart3 } from "lucide-react";

const personas = [
  {
    icon: Briefcase,
    title: "Operations Teams",
    description: "Streamline complex processes across departments without writing a single line of code. Perfect for scaling operations efficiently.",
  },
  {
    icon: Code2,
    title: "Product Builders",
    description: "Focus on building great products while Synth handles the repetitive tasks. Integrate with your existing tools in seconds.",
  },
  {
    icon: BarChart3,
    title: "Growth Leaders",
    description: "Automate your growth experiments and scale what works. From lead nurturing to customer success, let data drive your decisions.",
  },
];

const ICPSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden bg-background">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-synth-surface to-transparent" />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Who It's For
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display max-w-2xl mx-auto"
          >
            Designed for <span className="text-gradient">ambitious</span> teams
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="group relative h-full"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary/30 to-synth-blue-light/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-soft mb-6 group-hover:shadow-glow transition-shadow duration-300 border border-border">
                    <persona.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4">
                    {persona.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {persona.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ICPSection;
