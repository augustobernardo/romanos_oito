import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        {/* <WhatWeDoSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
