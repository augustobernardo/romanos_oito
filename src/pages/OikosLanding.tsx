import HeroSection from "@/components/oikos/HeroSection";
import HeadlineSection from "@/components/oikos/HeadlineSection";
import WhatIsOikosSection from "@/components/oikos/WhatIsOikosSection";
import FAQSection from "@/components/oikos/FAQSection";
import WelcomeSection from "@/components/oikos/WelcomeSection";
import OikosFormSection from "@/components/oikos/OikosFormSection";
import ClosingQuoteSection from "@/components/oikos/ClosingQuoteSection";
import CheckoutOikos2026 from "./CheckoutOikos2026";

const OikosLanding = () => {
  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "#fff9e1" }}
    >
      <HeroSection />
      <HeadlineSection />
      <WhatIsOikosSection />
      <FAQSection />
      <WelcomeSection />
      <OikosFormSection />
      <ClosingQuoteSection />
    </div>
  );
};

export default OikosLanding;
