import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { BetaBanner } from "@/components/pricing/BetaBanner";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (productType: "lane_pass" | "backroom_membership") => {
    setLoading(productType);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase.",
          variant: "destructive",
        });
        navigate("/merchant/login");
        return;
      }

      // Get merchant ID
      const { data: merchant } = await supabase
        .from("merchants")
        .select("id, email, brand_name")
        .eq("user_id", user.id)
        .single();

      if (!merchant) {
        toast({
          title: "Merchant Account Required",
          description: "Please complete merchant signup first.",
          variant: "destructive",
        });
        navigate("/merchant/signup");
        return;
      }

      // Call checkout edge function (will be created in next phase)
      toast({
        title: "Checkout Coming Soon",
        description: "Payment processing will be available shortly.",
      });

    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <SEOHead 
        title="Pricing - PopUp Lane"
        description="Simple, flexible pricing for small brands. Join PopUp Lane with a seasonal Lane Pass or year-round Backroom Membership."
        canonical="https://popuplane.com/pricing"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-20">
          <BetaBanner />
          
          {/* Hero Section */}
          <div className="container mx-auto px-4 text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
              Simple Pricing for Small Brands
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Pay per Lane or join the Backroom to access year-round perks. Choose what works for your brand.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="container mx-auto px-4 mb-20">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <PricingCard
                badge="Seasonal"
                badgeColor="seasonal"
                title="Lane Pass"
                price="$49.99"
                description="Participate in a PopUp Lane for a single seasonal event."
                features={[
                  "Placement in the Lane for the full season",
                  "Brand card + outbound shop link",
                  "Deal highlighting & visibility boosts",
                  "Shopper traffic routing",
                  "Click + save analytics (MVP light)"
                ]}
                ctaText="Join a Lane"
                ctaAction={() => handleCheckout("lane_pass")}
                note="One-time fee, valid for one Lane."
                loading={loading === "lane_pass"}
              />

              <PricingCard
                badge="Most Popular"
                badgeColor="popular"
                title="Backroom Membership"
                price="$19.99"
                period="/mo"
                description="Your year-round home inside PopUp Lane. Community, early access & more."
                features={[
                  "Access to Lane Club community",
                  "Merchant Notice Board posting",
                  "Early access to upcoming Lanes",
                  "Private merchant updates",
                  "Feature previews & priority testing"
                ]}
                ctaText="Join the Backroom"
                ctaAction={() => handleCheckout("backroom_membership")}
                note="Cancel anytime. Lane Pass sold separately."
                highlighted={true}
                loading={loading === "backroom_membership"}
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="container mx-auto px-4">
            <PricingFAQ />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
