import { Crown, Percent, Zap, Users, TrendingUp, Calendar, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantSpots } from "@/hooks/useMerchantSpots";

export const PioneerBenefits = () => {
  const { spotsRemaining, totalSpots } = useMerchantSpots();

  const benefits = [
    {
      icon: Crown,
      title: "Free Valentine's Lane",
      value: "$49.99 value",
      description: "Join our inaugural Valentine's pop-up at zero cost"
    },
    {
      icon: Percent,
      title: "50% Off Forever",
      value: "$120/year saved",
      description: "Lifetime Backroom Membership discount"
    },
    {
      icon: Zap,
      title: "Early Feature Access",
      value: "Exclusive",
      description: "Be first to test new tools and capabilities"
    },
    {
      icon: Calendar,
      title: "Next Lane 50% Off",
      value: "$25 saved",
      description: "Half price on your second seasonal lane"
    },
    {
      icon: TrendingUp,
      title: "Priority Placement",
      value: "Featured",
      description: "Enhanced visibility in our curated marketplace"
    },
    {
      icon: Users,
      title: "Founder Events",
      value: "Community",
      description: "Exclusive access to merchant community events"
    },
  ];

  const remaining = spotsRemaining;
  
  const getUrgencyMessage = () => {
    if (remaining === 0) return "Program Full - Waitlist Open";
    if (remaining <= 5) return `Only ${remaining} spots left!`;
    if (remaining <= 10) return `Less than ${remaining} spots remaining`;
    if (remaining <= 20) return "Limited spots available";
    return `${remaining} spots remaining`;
  };

  const getUrgencyColor = () => {
    if (remaining <= 5) return "text-destructive";
    if (remaining <= 10) return "text-orange-500";
    return "text-wine";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-valentine-blush/30 via-valentine-cream/20 to-background border-t border-wine/10 relative overflow-hidden">
      {/* Decorative hearts */}
      <Heart className="absolute top-12 left-[5%] w-10 h-10 text-wine/15 animate-float-slow" fill="currentColor" />
      <Heart className="absolute top-24 right-[8%] w-6 h-6 text-valentine-rose/25 animate-float-medium" fill="currentColor" />
      <Heart className="absolute bottom-20 left-[12%] w-8 h-8 text-wine/12 animate-float-fast" fill="currentColor" />
      <Heart className="absolute bottom-32 right-[6%] w-12 h-12 text-valentine-blush/30 animate-float-slow" fill="currentColor" />
      
      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine/10 text-wine text-sm font-semibold uppercase tracking-wider">
            <Heart className="w-4 h-4" fill="currentColor" />
            Limited Opportunity
            <Heart className="w-4 h-4" fill="currentColor" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold">
            Be a Founding Brand
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the first {totalSpots} merchants and unlock over <span className="text-wine font-semibold">$1,200 in lifetime benefits</span>. 
            Shape the future of small brand discovery.
          </p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border-2 border-wine/20 ${getUrgencyColor()} font-semibold shadow-[var(--shadow-heart)]`}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-wine"></span>
            </span>
            {getUrgencyMessage()}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-card/80 backdrop-blur-sm border border-wine/10 rounded-xl p-6 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300 hover:border-wine/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-wine/15 to-valentine-rose/10">
                    <Icon className="w-6 h-6 text-wine" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-base">{benefit.title}</h3>
                      <span className="text-xs font-semibold text-wine bg-valentine-blush/50 px-2 py-1 rounded">
                        {benefit.value}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-wine hover:bg-wine-light text-white shadow-[var(--shadow-button)] group"
            onClick={() => {
              const signupSection = document.getElementById('signup-forms');
              signupSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            disabled={remaining === 0}
          >
            <Heart className="mr-2 h-5 w-5" fill="currentColor" />
            {remaining === 0 ? 'Join Waitlist' : 'Claim Your Spot'}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-wine/30 hover:bg-valentine-blush/20 hover:border-wine/50"
            onClick={() => window.location.href = '/pricing'}
          >
            View Pricing Details
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Beta merchant program for Valentine's 2026. Limited to first {totalSpots} approved brands.
        </p>
      </div>
    </section>
  );
};
