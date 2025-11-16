import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";

export const BetaBanner = () => {
  const [isBetaMerchant, setIsBetaMerchant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBetaStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: merchant } = await supabase
          .from("merchants")
          .select("beta_merchant")
          .eq("user_id", user.id)
          .single();

        if (merchant?.beta_merchant) {
          setIsBetaMerchant(true);
        }
      } catch (error) {
        console.error("Error checking beta status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkBetaStatus();
  }, []);

  if (loading || !isBetaMerchant) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 mb-8">
      <Alert className="bg-gradient-to-r from-wine/10 via-wine-light/10 to-wine/10 border-wine/20">
        <Sparkles className="h-5 w-5 text-wine" />
        <AlertTitle className="text-wine font-semibold">
          🎉 You're a Beta Merchant!
        </AlertTitle>
        <AlertDescription className="text-foreground/80">
          <strong>Special Black Friday 2025 Pricing:</strong>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Lane Pass: <span className="font-semibold text-wine">FREE</span> (normally $49.99)</li>
            <li>Backroom Membership: <span className="font-semibold text-wine">$9.99/mo</span> (50% off lifetime - normally $19.99/mo)</li>
            <li>Next Lane Pass: <span className="font-semibold text-wine">50% off</span> ($24.99)</li>
          </ul>
          <p className="mt-2 text-sm">
            Thank you for being an early supporter! Your beta pricing is locked in forever.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
