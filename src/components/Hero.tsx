import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { useLaneState } from "@/hooks/use-lane-state";

export const Hero = () => {
  const { state, nextEventDate } = useLaneState();
  const isOpen = state === "open";

  return (
    <section 
      className={`relative py-12 sm:py-16 text-center transition-all duration-[450ms] ease-out will-change-transform rounded-lg ${
        isOpen ? 'transform -translate-y-2.5 bg-[hsl(var(--open-overlay))]' : ''
      }`}
      role="banner"
      aria-labelledby="page-title"
    >
      {/* ARIA live announcer */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isOpen 
          ? "PopUp Lane is live. Shop now for limited-time deals from indie brands."
          : "PopUp Lane opens soon. Join the waitlist to be first."}
      </div>

      <div className="container px-4 mx-auto max-w-5xl">
        {/* Title */}
        <h1 id="page-title" className="text-serif font-bold text-[clamp(34px,6.2vw,64px)] leading-[1.02] mx-auto mb-3">
          <span className="block text-[0.36em] text-muted-foreground tracking-[4px] mb-2.5">
            BLACK FRIDAY '25
          </span>
          PopUp Lane
        </h1>

        {/* Subtitle */}
        <p className={`max-w-3xl mx-auto text-muted-foreground text-lg transition-opacity duration-[450ms] ${!isOpen ? 'opacity-90' : ''}`}>
          {isOpen 
            ? "We're live — the Lane is open. Discover limited-time drops from indie makers while the pop-up is active."
            : "A digital lane that opens for moments — and remembers the brands that made them. Great products, limited time: discover curated small-brand deals before they disappear."}
        </p>

        {/* Live Pill */}
        {isOpen && (
          <div 
            className="inline-block mt-3.5 px-3.5 py-2 rounded-full bg-[linear-gradient(90deg,hsl(var(--gradient-live)))] text-foreground font-semibold text-[13px] shadow-[0_8px_30px_hsl(220_15%_8%/0.04)] animate-in fade-in slide-in-from-top-2 duration-450"
            aria-hidden="true"
          >
            <Zap className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
            We're Live!
          </div>
        )}

        {/* Countdown Label */}
        <div className="text-[13px] text-muted-foreground uppercase tracking-[1.6px] mb-2 mt-4">
          {isOpen ? "Black Friday Pop-Up Ends in :" : "Black Friday Pop-Up Starts in :"}
        </div>

        {/* Countdown Timer */}
        <CountdownTimer 
          targetDate={nextEventDate} 
          isOpen={isOpen}
        />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4.5" role="navigation" aria-label="Primary actions">
          {isOpen ? (
            <>
              <Button 
                size="lg" 
                className="text-base px-8 bg-primary text-primary-foreground shadow-[var(--shadow-button)] hover:bg-primary/90 group"
                onClick={() => window.location.href = '/lane'}
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 bg-transparent border-input hover:bg-accent/10"
                onClick={() => {
                  const formsSection = document.getElementById("signup-forms");
                  formsSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                List Your Brand
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="lg" 
                className="text-base px-8 bg-primary text-primary-foreground shadow-[var(--shadow-button)] hover:bg-primary/90 group"
                onClick={() => {
                  const formsSection = document.getElementById("signup-forms");
                  formsSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Join the Lane Club
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent border-input hover:bg-accent/10">
                Browse the Backroom
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
