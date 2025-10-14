import { Search, MousePointer, Bell, FileText, Star, TrendingUp, FolderOpen, UserPlus, Send } from "lucide-react";

export const HowItWorks = () => {
  const shopperStepsOpen = [
    {
      icon: Search,
      title: "Discover",
      description: "Browse live deals during our active season",
    },
    {
      icon: MousePointer,
      title: "Shop",
      description: "Visit the brands that resonate with you",
    },
    {
      icon: Bell,
      title: "Subscribe",
      description: "Stay connected for future lane openings",
    },
  ];

  const shopperStepsClosed = [
    {
      icon: FolderOpen,
      title: "Explore",
      description: "Browse the Backroom Directory of past brands",
    },
    {
      icon: UserPlus,
      title: "Join",
      description: "Sign up for the Lane Club to get notified",
    },
    {
      icon: Send,
      title: "Apply",
      description: "Submit your brand for the next opening",
    },
  ];

  const merchantStepsOpen = [
    {
      icon: FileText,
      title: "Submit",
      description: "Share your best seasonal offer with our community",
    },
    {
      icon: Star,
      title: "Get Featured",
      description: "Appear in our live lane during the event",
    },
    {
      icon: TrendingUp,
      title: "Drive Traffic",
      description: "Connect with engaged shoppers seeking authentic brands",
    },
  ];

  const merchantStepsClosed = [
    {
      icon: Send,
      title: "Apply",
      description: "Submit your brand for the next opening",
    },
    {
      icon: FolderOpen,
      title: "Get Listed",
      description: "Your brand stays in the Backroom Directory",
    },
    {
      icon: Bell,
      title: "Stay Ready",
      description: "Be notified when the next lane event opens",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The lane has two states — open for discovery, closed for memory.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Shoppers Column */}
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-xl p-6 border-2 border-primary/20">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center">For Shoppers</h3>
              
              {/* When Open */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-primary/20"></div>
                  <span className="text-xs font-semibold text-primary uppercase">When the Lane Is Open</span>
                  <div className="h-px flex-1 bg-primary/20"></div>
                </div>
                <div className="space-y-4">
                  {shopperStepsOpen.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* When Closed */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-muted"></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">When the Lane Is Closed</span>
                  <div className="h-px flex-1 bg-muted"></div>
                </div>
                <div className="space-y-4">
                  {shopperStepsClosed.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Merchants Column */}
          <div className="space-y-6">
            <div className="bg-accent/5 rounded-xl p-6 border-2 border-accent/20">
              <h3 className="text-2xl font-bold text-accent mb-6 text-center">For Merchants</h3>
              
              {/* When Open */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-accent/20"></div>
                  <span className="text-xs font-semibold text-accent uppercase">When the Lane Is Open</span>
                  <div className="h-px flex-1 bg-accent/20"></div>
                </div>
                <div className="space-y-4">
                  {merchantStepsOpen.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* When Closed */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-muted"></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">When the Lane Is Closed</span>
                  <div className="h-px flex-1 bg-muted"></div>
                </div>
                <div className="space-y-4">
                  {merchantStepsClosed.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
