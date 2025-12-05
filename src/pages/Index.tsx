import HeroSection from "@/components/landing/HeroSection";
import WhatIsSynthSection from "@/components/landing/WhatIsSynthSection";
import WhyDifferentSection from "@/components/landing/WhyDifferentSection";
import ICPSection from "@/components/landing/ICPSection";
import ExampleAutomationsSection from "@/components/landing/ExampleAutomationsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden">
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
