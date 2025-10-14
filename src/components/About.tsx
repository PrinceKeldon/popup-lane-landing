import { Heart, Shield, Zap } from "lucide-react";
export const About = () => {
  const promises = [{
    icon: Heart,
    title: "For Shoppers",
    description: "Discover real deals from real people — and find them again anytime in our year-round directory."
  }, {
    icon: Shield,
    title: "For Merchants",
    description: "Visibility that lasts beyond the sale. Get discovered during events, stay remembered all year."
  }, {
    icon: Zap,
    title: "For Everyone",
    description: "A lane that opens for moments, closes for curation, and remembers the brands that matter."
  }];
  return <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Story */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Every sale season, small brands get buried under <span className="text-gradient">big ad budgets</span>. We built PopUp Lane to dig them out — and keep them remembered.
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground space-y-4">
              <p className="text-lg">
                Every year, Black Friday becomes a battleground where only the loudest brands survive. 
                Small businesses and indie creators — the ones with the most unique products and genuine stories — 
                get drowned out by mega-retailers spending millions on ads.
              </p>
              <p className="text-lg">
                PopUp Lane changes that. It's a seasonal online directory that <strong>opens for limited-time events</strong> (like Black Friday), 
                then transitions into a <strong>directory state</strong> that stays active year-round. Small brands, makers, and creators 
                can showcase their best deals without competing in costly ad auctions. When the lane "closes," their stories live on in our Backroom Directory.
              </p>
            </div>
          </div>

          {/* Promise Blocks */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {promises.map((promise, index) => {
            const Icon = promise.icon;
            return <div key={index} className="bg-card rounded-xl p-6 shadow-lg hover-lift border border-border">
                  
                  <h3 className="text-xl font-bold mb-2">{promise.title}</h3>
                  <p className="text-muted-foreground">{promise.description}</p>
                </div>;
          })}
          </div>
        </div>
      </div>
    </section>;
};