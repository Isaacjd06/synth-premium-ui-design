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
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-medium text-primary uppercase tracking-wider mb-4"
          >
            How It Works
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display"
          >
            Three steps to <span className="text-gradient italic">automation bliss</span>
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
                className="h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 origin-left"
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
                      className="w-20 h-20 rounded-3xl bg-card-gradient shadow-card flex items-center justify-center relative z-10 border border-border/50 group-hover:shadow-glow transition-shadow duration-500"
                    >
                      <step.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <span className="absolute -top-3 -right-3 text-5xl font-display text-primary/10 font-light">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
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
