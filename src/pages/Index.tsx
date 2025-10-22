import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { LanePreview } from "@/components/LanePreview";
import { BrandCarousel } from "@/components/BrandCarousel";
import { SignupForms } from "@/components/SignupForms";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <LanePreview />
        <HowItWorks />
        <About />
        <BrandCarousel />
        <div id="signup-forms">
          <SignupForms />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Index;
