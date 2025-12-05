import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const WhatIsSynthSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden bg-background">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-glow opacity-50 blur-3xl" />
      
      <div className="container px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            The Platform
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display mb-8"
          >
            What is <span className="text-gradient">Synth</span>?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6 text-lg md:text-xl text-foreground/70 leading-relaxed"
          >
            <p>
              Synth is an AI-native automation platform that understands your 
              workflow and builds intelligent systems around it. Simply describe 
              what you want to automate, and Synth handles the rest.
            </p>
            <p>
              Unlike traditional tools that require complex configurations, 
              Synth learns from your patterns and proactively suggests improvements. 
              It's like having a brilliant automation engineer working alongside 
              you, 24/7.
            </p>
          </motion.div>

          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default WhatIsSynthSection;
