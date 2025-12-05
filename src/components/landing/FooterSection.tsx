import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="py-16 border-t border-border bg-synth-navy">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Logo */}
          <div className="mb-6">
            <span className="text-3xl font-display font-bold text-gradient">
              Synth
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © Synth — All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
