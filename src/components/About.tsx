import { Heart, Shield, Zap } from "lucide-react";

export const About = () => {
  const promises = [
    {
      icon: Heart,
      title: "For Shoppers",
      description: "Curated deals from real people, not algorithms. Discover unique finds before they go viral.",
    },
    {
      icon: Shield,
      title: "For Merchants",
      description: "Get discovered without breaking the bank. No bidding wars, just authentic visibility.",
    },
    {
      icon: Zap,
      title: "For Everyone",
      description: "A seasonal street that levels the playing field for indie creators and small businesses.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Story */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Not Every Great Brand Has a <span className="text-gradient">Big Ad Budget</span>
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground space-y-4">
              <p className="text-lg">
                Every year, Black Friday becomes a battleground where only the loudest brands survive. 
                Small businesses and indie creators — the ones with the most unique products and genuine stories — 
                get drowned out by mega-retailers spending millions on ads.
              </p>
              <p className="text-lg">
                PopUp Lane changes that. It's a seasonal online directory where small brands, makers, and creators 
                can showcase their best deals without competing in costly ad auctions. And for shoppers? 
                It's a curated street of authentic finds you won't see everywhere else.
              </p>
            </div>
          </div>

          {/* Promise Blocks */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {promises.map((promise, index) => {
              const Icon = promise.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-lg hover-lift border border-border"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{promise.title}</h3>
                  <p className="text-muted-foreground">{promise.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
