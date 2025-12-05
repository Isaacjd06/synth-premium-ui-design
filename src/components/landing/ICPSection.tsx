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
    <section ref={ref} className="py-36 md:py-48 relative overflow-hidden">
      {/* Seamless background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-transparent" />
      
      {/* Vertical data flow lines */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-[28%] w-px h-full bg-gradient-to-b from-transparent via-primary/15 to-transparent"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 right-[35%] w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-20 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-accent text-primary uppercase tracking-widest mb-5"
          >
            Who It's For
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight max-w-2xl mx-auto"
          >
            Designed for <span className="text-gradient">ambitious</span> teams
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="group relative h-full"
              >
                {/* Glow effect on hover */}
                <motion.div 
                  className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary/15 via-synth-blue-light/10 to-primary/15 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                />
                
                <div className="relative h-full p-8 lg:p-10 rounded-3xl card-premium">
                  {/* Icon with bounce/glow */}
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-7 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 icon-glow"
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    animate={isInView ? { 
                      y: [0, -3, 0],
                    } : {}}
                    transition={{ 
                      y: { duration: 3, repeat: Infinity, delay: index * 0.5 },
                    }}
                  >
                    <persona.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-display font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                    {persona.title}
                  </h3>
                  
                  <p className="text-foreground/70 leading-relaxed">
                    {persona.description}
                  </p>
                  
                  {/* Bottom accent line */}
                  <motion.div 
                    className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
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