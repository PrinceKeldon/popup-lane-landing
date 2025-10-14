import { Search, MousePointer, Bell, FileText, Star, TrendingUp } from "lucide-react";

export const HowItWorks = () => {
  const shopperSteps = [
    {
      icon: Search,
      title: "Browse",
      description: "Explore curated deals from indie brands and creators",
    },
    {
      icon: MousePointer,
      title: "Click",
      description: "Visit the shops that catch your eye",
    },
    {
      icon: Bell,
      title: "Subscribe",
      description: "Get early access to future PopUp Lane seasons",
    },
  ];

  const merchantSteps = [
    {
      icon: FileText,
      title: "Submit",
      description: "Share your best seasonal offer with our community",
    },
    {
      icon: Star,
      title: "Get Featured",
      description: "Appear in our curated directory of deals",
    },
    {
      icon: TrendingUp,
      title: "Drive Traffic",
      description: "Connect with shoppers looking for authentic brands",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple for shoppers. Easy for merchants. Win-win for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Shoppers Column */}
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-xl p-6 border-2 border-primary/20">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center">For Shoppers</h3>
              <div className="space-y-6">
                {shopperSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Merchants Column */}
          <div className="space-y-6">
            <div className="bg-accent/5 rounded-xl p-6 border-2 border-accent/20">
              <h3 className="text-2xl font-bold text-accent mb-6 text-center">For Merchants</h3>
              <div className="space-y-6">
                {merchantSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
