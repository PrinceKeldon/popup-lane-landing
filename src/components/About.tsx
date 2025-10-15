import { Heart, Users, TrendingUp } from "lucide-react";

export const About = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* What is PopUp Lane Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h3 className="text-serif text-xl sm:text-2xl mb-4">
            What is PopUp Lane?
          </h3>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-2.5">
            PopUp Lane is a seasonal digital pop-up — a curated directory and timed event that opens during major shopping moments (like Black Friday and the holidays). While the lane is open, shoppers browse our curated directory, filter by categories, and visit each merchant's storefront to purchase directly. The directory remains an archive of past lanes so shoppers can revisit favorites and brands remain discoverable between drops.
          </p>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Importantly, merchants <strong className="text-foreground">keep 100% of every sale</strong>. Transactions occur on the merchant's own site or platform (Shopify, Etsy, native checkout, etc.), and PopUp Lane does not take a cut of those sales. Instead, PopUp Lane supports creators through paid placement (featured tiles, hero spots), sponsorships, and optional affiliate tracking when merchants opt in — keeping the marketplace creator-first and fair by design.
          </p>
        </div>

        {/* Promise Blocks */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-[var(--shadow-card)] hover-lift">
            <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-foreground" />
            </div>
            <h4 className="text-serif text-lg font-semibold mb-2">For Shoppers</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover real deals from real people — and find them again anytime. No algorithms, no noise.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-[var(--shadow-card)] hover-lift">
            <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-foreground" />
            </div>
            <h4 className="text-serif text-lg font-semibold mb-2">For Merchants</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visibility that lasts beyond the sale. Keep 100% of revenue while staying discoverable year-round.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-[var(--shadow-card)] hover-lift">
            <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-foreground" />
            </div>
            <h4 className="text-serif text-lg font-semibold mb-2">For Everyone</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A marketplace built for moments, remembered forever. Small brands deserve to be seen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
