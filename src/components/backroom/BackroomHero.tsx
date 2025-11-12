import { formatDistanceToNow } from "date-fns";

interface BackroomHeroProps {
  nextSeasonDate?: Date;
  merchantCount: number;
}

export const BackroomHero = ({ nextSeasonDate, merchantCount }: BackroomHeroProps) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.03),transparent_50%)]" />
      
      <div className="container relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
          <span className="text-2xl">🏛️</span>
          <span className="text-sm font-medium text-muted-foreground">Directory Mode</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          The Backroom
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Discover Our Community Year-Round
        </p>
        
        <p className="text-base text-muted-foreground/80 mb-8 max-w-xl mx-auto">
          The Lane may be closed, but our community is always here. Explore {merchantCount} curated brands at your own pace.
        </p>
        
        {nextSeasonDate && (
          <div className="flex flex-col items-center gap-3 mb-8">
            <p className="text-sm text-muted-foreground">Next Pop-Up Event</p>
            <p className="text-lg font-semibold text-foreground">
              Opens {formatDistanceToNow(nextSeasonDate, { addSuffix: true })}
            </p>
          </div>
        )}
        
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg transition-all hover:scale-105"
        >
          <span>Join Waitlist for Next Pop-Up</span>
          <span className="text-lg">→</span>
        </a>
      </div>
    </section>
  );
};
