import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-16 relative overflow-hidden">
      {/* Seamless top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-synth-navy/40" />
      
      {/* Subtle grid fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_50%_50%/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_50%_50%/0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
      
      <div className="container px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo with glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <motion.div 
              className="w-10 h-10 rounded-xl glass-premium flex items-center justify-center icon-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-2xl font-display-bold text-foreground">Synth</span>
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-foreground/50"
          >
            © Synth — All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;