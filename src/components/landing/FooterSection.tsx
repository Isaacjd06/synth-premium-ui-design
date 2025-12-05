import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-20 relative overflow-hidden">
      {/* Seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-synth-navy/50" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-computation opacity-20" />
      
      <div className="container px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo with intelligence glow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-8"
          >
            <motion.div 
              className="w-10 h-10 rounded-xl glass-node flex items-center justify-center icon-node"
              whileHover={{ scale: 1.05 }}
              style={{ animation: "thinking-pulse 4s ease-in-out infinite" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-2xl font-display-bold text-foreground tracking-tight">Synth</span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-foreground/45 mb-4"
          >
            The thinking automation engine.
          </motion.p>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xs text-foreground/35"
          >
            © Synth — All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;