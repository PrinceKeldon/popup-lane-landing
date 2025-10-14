import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Construction } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { useLaneState } from "@/hooks/use-lane-state";
import heroImage from "@/assets/hero-lane.jpg";

export const Hero = () => {
  const { state, nextEventDate } = useLaneState();
  const isOpen = state === "open";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="PopUp Lane marketplace" 
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background ${!isOpen && 'opacity-70'}`}></div>
      </div>

      {/* Animated Glow Effect - Only visible when open */}
      {isOpen && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-glow-pulse z-0"></div>
      )}

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* State Badge */}
          <div className="flex justify-center">
            {isOpen ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">The Lane Is Open</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                <Construction className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Lane Closed</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {isOpen ? (
              <>⚡ The Lane Is Open — Discover 50 Indie Deals Before It Closes.</>
            ) : (
              <>🚧 PopUp Lane Is Closed for Now — The Next Opening Is Coming Holiday '25.</>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A digital lane that <span className="text-gradient font-semibold">opens for moments</span> — and remembers the brands that made them.
          </p>

          {isOpen && <CountdownTimer targetDate="2024-12-05" />}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {isOpen ? (
              <>
                <Button size="lg" className="text-lg px-8 group">
                  🛍️ Shop the Lane
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  💼 List Your Brand
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8 group">
                  💌 Join the Lane Club
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  🛍️ Browse the Backroom Directory
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0"></div>
    </section>
  );
};
