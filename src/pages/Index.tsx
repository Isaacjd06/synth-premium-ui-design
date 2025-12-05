import HeroSection from "@/components/landing/HeroSection";
import WhatIsSynthSection from "@/components/landing/WhatIsSynthSection";
import WhyDifferentSection from "@/components/landing/WhyDifferentSection";
import ICPSection from "@/components/landing/ICPSection";
import ExampleAutomationsSection from "@/components/landing/ExampleAutomationsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FooterSection from "@/components/landing/FooterSection";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background relative">
      {/* Premium seamless background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-synth-navy via-background to-synth-navy pointer-events-none" />
      
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(217 100% 60% / 0.08) 0%, transparent 70%)",
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, hsl(217 100% 60% / 0.1) 0%, transparent 70%)",
          }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Animated grid pattern overlay */}
      <div className="fixed inset-0 grid-dots opacity-40 pointer-events-none" />
      
      {/* Floating AI particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Scan line effect */}
      <motion.div
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <HeroSection />
      <WhatIsSynthSection />
      <WhyDifferentSection />
      <ICPSection />
      <ExampleAutomationsSection />
      <HowItWorksSection />
      <FooterSection />
    </main>
  );
};

export default Index;