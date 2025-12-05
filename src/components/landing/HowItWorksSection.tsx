import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Wand2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Tell Synth what you want",
    description: "Describe your automation in plain English. No technical jargon, no complex setups—just tell us what you need.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "Synth builds your automation",
    description: "Our AI understands your intent and creates a custom workflow. Review, tweak, or let it run as-is.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Your workflows run automatically",
    description: "Sit back while Synth handles the repetitive work. Monitor everything from a simple dashboard.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="how-it-works" className="py-36 md:py-48 relative overflow-hidden">
      {/* Seamless background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-surface/25 to-background" />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-accent text-primary uppercase tracking-widest mb-5"
          >
            How It Works
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight"
          >
            Three steps to <span className="text-gradient-accent">automation bliss</span>
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
            {/* Glowing timeline connector - desktop only */}
            <div className="hidden md:block absolute top-24 left-[18%] right-[18%] h-0.5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="h-full origin-left rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(217 100% 60% / 0.2), hsl(217 100% 60% / 0.5), hsl(217 100% 60% / 0.2))",
                  boxShadow: "0 0 20px hsl(217 100% 60% / 0.3)",
                }}
              />
              {/* Animated traveling dot */}
              <motion.div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-primary -translate-y-1/2"
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                  boxShadow: "0 0 15px hsl(217 100% 60%), 0 0 30px hsl(217 100% 60% / 0.5)" 
                }}
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="group text-center"
                >
                  {/* Step number and icon */}
                  <div className="relative inline-block mb-10">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      className="w-20 h-20 rounded-3xl glass-premium flex items-center justify-center relative z-10 transition-all duration-500 group-hover:shadow-neon"
                    >
                      <step.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                    
                    {/* Step number badge */}
                    <motion.span 
                      className="absolute -top-4 -right-4 text-5xl font-display-bold"
                      style={{
                        background: "linear-gradient(180deg, hsl(217 100% 60% / 0.5), hsl(217 100% 60% / 0.15))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {step.number}
                    </motion.span>
                    
                    {/* Pulse ring animation */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-primary/30"
                      animate={isInView ? { 
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0, 0.5],
                      } : {}}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: index * 0.8,
                      }}
                    />
                  </div>

                  <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-foreground/70 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;