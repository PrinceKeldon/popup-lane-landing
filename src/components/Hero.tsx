import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { useLaneSettings } from "@/hooks/useLaneSettings";
import { CURRENT_SEASON } from "@/lib/season-config";

export const Hero = () => {
  const {
    earlyAccessDate,
    laneStatus
  } = useLaneSettings();
  const isOpen = laneStatus === "open";
  const nextEventDate = earlyAccessDate.toISOString();
  
  return (
    <section 
      className={`relative py-8 sm:py-12 md:py-16 px-3 sm:px-4 text-center transition-all duration-[450ms] ease-out will-change-transform rounded-lg ${isOpen ? 'transform -translate-y-2.5 bg-[hsl(var(--open-overlay))]' : ''}`} 
      role="banner" 
      aria-labelledby="page-title"
    >
      {/* ARIA live announcer */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isOpen 
          ? "PopUp Lane is live. Shop now for thoughtful Valentine's gifts from indie brands." 
          : "The Valentine's Lane opens soon. Join the waitlist to be first."}
      </div>

      <div className="container px-4 mx-auto max-w-5xl">
        {/* Title */}
        <h1 id="page-title" className="text-serif font-bold text-[clamp(34px,6.2vw,64px)] leading-[1.02] mx-auto mb-3">
          <span className="block text-[0.36em] text-muted-foreground tracking-[4px] mb-2.5">
            {CURRENT_SEASON.label}
          </span>
          {CURRENT_SEASON.headline}
        </h1>

        {/* Subtitle */}
        <p className={`max-w-3xl mx-auto text-muted-foreground text-lg transition-opacity duration-[450ms] ${!isOpen ? 'opacity-90' : ''}`}>
          {isOpen 
            ? "We're live — the Lane is open. Discover thoughtful Valentine's gifts from indie makers while the pop-up is active." 
            : CURRENT_SEASON.subheadline}
        </p>

        {/* Live Pill */}
        {isOpen && (
          <div 
            aria-hidden="true" 
            className="inline-block mt-3.5 px-3.5 py-2 bg-[linear-gradient(90deg,hsl(var(--valentine-blush)/0.4),hsl(var(--valentine-rose)/0.25))] text-foreground font-semibold text-[13px] shadow-[0_8px_30px_hsl(220_15%_8%/0.04)] animate-in fade-in slide-in-from-top-2 duration-450 rounded"
          >
            {CURRENT_SEASON.livePill}
          </div>
        )}

        {/* Countdown Label */}
        <div className="text-[13px] text-muted-foreground uppercase tracking-[1.6px] mb-2 mt-4">
          {isOpen 
            ? `${CURRENT_SEASON.countdownPrefix} Ends in :` 
            : `${CURRENT_SEASON.countdownPrefix} Starts in :`}
        </div>

        {/* Countdown Timer */}
        <CountdownTimer targetDate={nextEventDate} isOpen={isOpen} />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4.5" role="navigation" aria-label="Primary actions">
          {isOpen ? (
            <>
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-h-[44px] text-base px-8 bg-primary text-primary-foreground shadow-[var(--shadow-button)] hover:bg-primary/90 group" 
                onClick={() => window.location.href = '/lane'}
              >
                {CURRENT_SEASON.shopCTA}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto min-h-[44px] text-base px-8 bg-transparent border-input hover:bg-accent/10" 
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
                className="w-full sm:w-auto min-h-[44px] text-base px-8 bg-primary text-primary-foreground shadow-[var(--shadow-button)] hover:bg-primary/90 group" 
                onClick={() => window.location.href = '/lane-club'}
              >
                Join the Lane Club
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto min-h-[44px] text-base px-8 bg-transparent border-input hover:bg-accent/10" 
                onClick={() => window.location.href = '/backroom'}
              >
                Browse the Backroom
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};