import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 relative overflow-hidden">
      {/* Seamless top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-synth-navy/30" />
      
      <div className="container px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">Synth</span>
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