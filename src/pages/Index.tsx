import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { BrandCarousel } from "@/components/BrandCarousel";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <About />
      <BrandCarousel />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;
