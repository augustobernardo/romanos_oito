import HeroSection from "@/components/oikos/HeroSection";
import HeadlineSection from "@/components/oikos/HeadlineSection";
import WhatIsOikosSection from "@/components/oikos/WhatIsOikosSection";
import FAQSection from "@/components/oikos/FAQSection";
import WelcomeSection from "@/components/oikos/WelcomeSection";
import TicketSelector from "@/components/oikos/TicketSelector";
import ClosingQuoteSection from "@/components/oikos/ClosingQuoteSection";

const OikosLanding = () => {
  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "#fff9e1" }}
    >
      <HeroSection />
      <HeadlineSection />
      <WhatIsOikosSection />
      {/* <CtaBannerSection /> */}
      <FAQSection />
      <WelcomeSection />
      <TicketSelector />
      <ClosingQuoteSection />
    </div>
  );
};

export default OikosLanding;
