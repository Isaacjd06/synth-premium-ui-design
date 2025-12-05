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
      {/* Computation surface background */}
      <div className="fixed inset-0 bg-gradient-to-b from-synth-navy via-background to-synth-navy pointer-events-none" />
      
      {/* Neural network ambient visualization */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary intelligence glow */}
        <motion.div
          className="absolute top-[5%] left-[15%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 100% 60% / 0.06) 0%, transparent 60%)",
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Secondary reasoning glow */}
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-[550px] h-[550px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 100% 60% / 0.05) 0%, transparent 55%)",
          }}
          animate={{ 
            scale: [1.05, 0.95, 1.05],
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Computation grid overlay */}
      <div className="fixed inset-0 grid-nodes opacity-30 pointer-events-none" />
      
      {/* Neural network nodes - representing AI awareness */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/30"
            style={{
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -15 - (i % 3) * 8, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
        
        {/* Connection lines between nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <motion.line
            x1="15%" y1="25%" x2="35%" y2="45%"
            stroke="hsl(217 100% 60%)"
            strokeWidth="1"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.line
            x1="65%" y1="20%" x2="85%" y2="40%"
            stroke="hsl(217 100% 60%)"
            strokeWidth="1"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.line
            x1="25%" y1="60%" x2="50%" y2="75%"
            stroke="hsl(217 100% 60%)"
            strokeWidth="1"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </svg>
      </div>
      
      {/* Deliberate scan line - represents system awareness */}
      <motion.div
        className="fixed left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(217 100% 60% / 0.25), hsl(217 100% 70% / 0.4), hsl(217 100% 60% / 0.25), transparent)",
        }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
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