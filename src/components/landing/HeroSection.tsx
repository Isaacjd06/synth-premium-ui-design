import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cpu, Network, Binary } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)/0.15) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--synth-blue-glow)/0.2) 0%, transparent 70%)",
          }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating tech elements */}
        <motion.div
          className="absolute top-[20%] left-[15%] p-4 rounded-2xl bg-primary/5 backdrop-blur-sm border border-primary/20"
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cpu className="w-8 h-8 text-primary/60" />
        </motion.div>
        <motion.div
          className="absolute top-[35%] right-[18%] p-3 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/20"
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Network className="w-6 h-6 text-primary/60" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] left-[20%] p-3 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/20"
          animate={{ y: [-15, 15, -15], rotate: [5, -5, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Binary className="w-6 h-6 text-primary/60" />
        </motion.div>
        
        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid pattern with glow nodes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="container relative z-10 px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              AI-Powered Automation Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6"
          >
            Automate your
            <br />
            <span className="text-gradient bg-clip-text">entire workflow</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10"
          >
            Synth transforms how teams work by building intelligent automations 
            that learn and adapt. No code required, infinite possibilities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                boxShadow: "0 0 30px hsl(var(--primary)/0.4), 0 0 60px hsl(var(--primary)/0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Waitlist
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary via-synth-blue-light to-primary bg-[length:200%_100%]"
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            <motion.a
              href="#how-it-works"
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
            >
              See how Synth works
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default HeroSection;