import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { POPUP_LANE_CONFIG } from "@/lib/constants";

interface LaneHeroProps {
  isOpen: boolean;
  nextEventDate?: string;
}

export default function LaneHero({ isOpen, nextEventDate }: LaneHeroProps) {
  const scrollToFeed = () => {
    document.getElementById("lane-feed")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-wine/5">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNBMjNFNDgiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNi0yLjY4NiA2LTYtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6TTI0IDM2YzAtMy4zMTQgMi42ODYtNiA2LTZzNi0yLjY4NiA2LTYtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6TTEyIDU2YzAtMy4zMTQgMi42ODYtNiA2LTZzNi0yLjY4NiA2LTYtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <div className="container relative z-10 px-4 text-center space-y-6 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Pop-Up Shop Season
          </span>
          {isOpen && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wine/10 border border-wine/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-wine"></span>
              </span>
              <span className="text-xs font-semibold text-wine">LIVE NOW</span>
            </span>
          )}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Walk{" "}
          <span className="bg-gradient-to-r from-wine via-wine-light to-wine bg-clip-text text-transparent">
            The Lane
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {isOpen
            ? "Discover curated small brands. Shop limited-time offers. Support founders."
            : "The Lane is currently closed. Sign up to be notified when we reopen."}
        </p>

        <div className="pt-4">
          <CountdownTimer
            targetDate={
              isOpen
                ? POPUP_LANE_CONFIG.LANE_CLOSE_DATE.toISOString()
                : POPUP_LANE_CONFIG.LANE_OPEN_DATE.toISOString()
            }
            isOpen={isOpen}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {isOpen ? (
            <>
              <Button
                size="lg"
                onClick={scrollToFeed}
                className="bg-wine hover:bg-wine-light text-white font-semibold px-8 py-6 text-lg"
              >
                Walk The Lane
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Get Notified
              </Button>
            </>
          ) : (
            <Button size="lg" className="bg-wine hover:bg-wine-light text-white font-semibold px-8 py-6 text-lg">
              Join Waitlist
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
