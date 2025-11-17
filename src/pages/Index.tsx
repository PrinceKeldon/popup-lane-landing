import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandCarousel } from "@/components/BrandCarousel";
import { SignupForms } from "@/components/SignupForms";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PioneerBenefits } from "@/components/PioneerBenefits";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PopUp Lane",
    "description": "A seasonal digital pop-up for curated small-brand Black Friday deals",
    "url": window.location.origin,
    "logo": `${window.location.origin}/placeholder.svg`,
    "sameAs": []
  };

  return (
    <>
      <SEOHead
        title="PopUp Lane — Black Friday '25 | Curated Small Brand Deals"
        description="Discover limited-time Black Friday deals from indie brands. A seasonal digital pop-up featuring curated small businesses with exclusive offers."
        canonical={window.location.origin}
        structuredData={structuredData}
      />
      <Navigation />
      <main className="min-h-screen">
        <Hero />
      {/* Preview The Lane Button */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-wine/10 text-wine text-sm font-semibold uppercase tracking-wider mb-2">
            Preview The Lane
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Experience The Lane
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a preview of the curated brands, limited-time offers, and discovery experience waiting for you when The Lane opens.
          </p>
          <Button
            size="lg"
            className="bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white shadow-[var(--shadow-button)] group"
            onClick={() => (window.location.href = "/lane-preview")}
          >
            Preview The Lane
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
        <HowItWorks />
        <About />
        <PioneerBenefits />
        <BrandCarousel />
        <div id="signup-forms">
          <SignupForms />
        </div>
        <TestimonialCarousel />
        <Footer />
      </main>
    </>
  );
};

export default Index;
