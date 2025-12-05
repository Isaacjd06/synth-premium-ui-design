import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Atom } from "lucide-react";

const WhatIsSynthSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden">
      {/* Seamless background - continues from hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-surface/30 to-transparent" />
      
      {/* Glowing center accent */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Orbiting elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 border border-primary/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-primary/30 blur-sm" />
      </motion.div>
      
      <div className="container px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6"
          >
            <Atom className="w-8 h-8 text-primary" />
          </motion.div>

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
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8"
          >
            What is <span className="text-gradient">Synth</span>?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6 text-lg md:text-xl text-foreground/80 leading-relaxed"
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

          {/* Decorative data stream */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <motion.div 
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSynthSection;