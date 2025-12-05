import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Atom } from "lucide-react";

const WhatIsSynthSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-36 md:py-48 relative overflow-hidden">
      {/* Seamless background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-synth-surface/40 to-transparent" />
      
      {/* AI Node graph background - circular glowing element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 100% 60% / 0.06) 0%, transparent 60%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Orbiting rings */}
        <motion.div
          className="absolute inset-[15%] border border-primary/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-primary/40 blur-sm" />
        </motion.div>
        <motion.div
          className="absolute inset-[30%] border border-primary/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-primary/30 blur-sm" />
        </motion.div>
      </div>
      
      <div className="container px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-18 h-18 rounded-2xl glass-premium mb-8 icon-glow animate-glow-pulse"
          >
            <Atom className="w-9 h-9 text-primary" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm font-accent text-primary uppercase tracking-widest mb-5"
          >
            The Platform
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight mb-10"
          >
            What is <span className="text-gradient">Synth</span>?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-7 text-lg md:text-xl text-foreground/75 leading-relaxed"
          >
            <p>
              <span className="font-accent text-gradient">Synth</span> is an AI-native automation platform that understands your 
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
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-14 flex items-center justify-center gap-3"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
            <motion.div 
              className="w-2.5 h-2.5 rounded-full bg-primary shadow-neon"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSynthSection;