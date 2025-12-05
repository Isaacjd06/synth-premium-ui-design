import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cpu, Network, Binary, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spotlight gradient behind headline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-spotlight pointer-events-none" />
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 -right-1/4 w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(217 100% 60% / 0.12) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(217 100% 70% / 0.15) 0%, transparent 60%)",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating tech elements with parallax */}
      <motion.div
        className="absolute top-[18%] left-[12%] p-4 rounded-2xl glass-premium"
        animate={{ y: [-12, 12, -12], rotate: [0, 3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cpu className="w-7 h-7 text-primary/70" />
      </motion.div>
      <motion.div
        className="absolute top-[32%] right-[15%] p-3 rounded-xl glass-premium"
        animate={{ y: [10, -14, 10], rotate: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Network className="w-6 h-6 text-primary/70" />
      </motion.div>
      <motion.div
        className="absolute bottom-[28%] left-[18%] p-3 rounded-xl glass-premium"
        animate={{ y: [-15, 10, -15], rotate: [3, -3, 3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Binary className="w-6 h-6 text-primary/70" />
      </motion.div>
      <motion.div
        className="absolute top-[55%] right-[22%] p-3 rounded-xl glass-premium"
        animate={{ y: [8, -10, 8], x: [-5, 5, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Zap className="w-5 h-5 text-primary/70" />
      </motion.div>
      
      {/* Grid pattern with subtle glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_50%_50%/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_50%_50%/0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container relative z-10 px-6 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center">
          {/* Premium glassmorphism badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-premium mb-10 group cursor-default glow-ring"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-foreground/90 tracking-wide">
              AI-Powered Automation Platform
            </span>
          </motion.div>

          {/* Premium Headline with Geist font */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display-bold tracking-tight mb-8 leading-[1.05]"
          >
            Automate your
            <br />
            <span className="text-gradient-shimmer">entire workflow</span>
          </motion.h1>

          {/* Subheadline with Inter */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto mb-12 leading-relaxed font-sans"
          >
            Synth transforms how teams work by building intelligent automations 
            that learn and adapt. No code required, infinite possibilities.
          </motion.p>

          {/* Premium CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl overflow-hidden btn-premium"
              style={{
                boxShadow: "0 0 40px hsl(217 100% 60% / 0.35), 0 8px 32px -8px hsl(217 100% 50% / 0.4)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2 font-accent">
                Join the Waitlist
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary via-synth-blue-light to-primary bg-[length:200%_100%]"
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            <motion.a
              href="#how-it-works"
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-foreground/75 hover:text-primary transition-all duration-300 font-medium group"
            >
              <span>See how Synth works</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-background via-background/90 to-transparent" />
    </section>
  );
};

export default HeroSection;