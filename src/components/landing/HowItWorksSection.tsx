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
    <section ref={ref} id="how-it-works" className="py-32 md:py-40 relative overflow-hidden">
      {/* Seamless background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-surface/20 to-background" />
      
      {/* Animated connection line */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            How It Works
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
          >
            Three steps to <span className="text-gradient">automation bliss</span>
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full origin-left"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--primary)/0.3), hsl(var(--primary)/0.5), hsl(var(--primary)/0.3))",
                }}
              />
              {/* Animated dot traveling along line */}
              <motion.div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-primary -translate-y-1/2"
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ boxShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)/0.5)" }}
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="group text-center"
                >
                  {/* Step number and icon */}
                  <div className="relative inline-block mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 rounded-3xl bg-card/50 backdrop-blur-md flex items-center justify-center relative z-10 border border-primary/20 group-hover:border-primary/50 transition-all duration-500"
                      style={{
                        boxShadow: "0 0 30px hsl(var(--primary)/0.1)",
                      }}
                    >
                      <step.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <motion.span 
                      className="absolute -top-3 -right-3 text-5xl font-display font-bold"
                      style={{
                        background: "linear-gradient(180deg, hsl(var(--primary)/0.4), hsl(var(--primary)/0.1))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {step.number}
                    </motion.span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
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