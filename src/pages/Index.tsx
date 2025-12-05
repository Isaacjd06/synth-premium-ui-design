import HeroSection from "@/components/landing/HeroSection";
import WhatIsSynthSection from "@/components/landing/WhatIsSynthSection";
import WhyDifferentSection from "@/components/landing/WhyDifferentSection";
import ICPSection from "@/components/landing/ICPSection";
import ExampleAutomationsSection from "@/components/landing/ExampleAutomationsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background relative">
      {/* Global seamless background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-synth-navy/50 to-background pointer-events-none" />
      
      {/* Animated circuit/data stream lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50h40v-40h20v40h40M50 0v40h40v20h-40v40" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-primary"/>
              <circle cx="50" cy="50" r="3" fill="currentColor" className="text-primary"/>
              <circle cx="0" cy="50" r="2" fill="currentColor" className="text-primary"/>
              <circle cx="100" cy="50" r="2" fill="currentColor" className="text-primary"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

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