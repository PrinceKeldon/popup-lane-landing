import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { BrandCarousel } from "@/components/BrandCarousel";
import { SignupForms } from "@/components/SignupForms";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <About />
      <BrandCarousel />
      <SignupForms />
      <Footer />
    </main>
  );
};

export default Index;
