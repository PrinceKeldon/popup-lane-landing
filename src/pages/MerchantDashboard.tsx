import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { MerchantHeader } from "@/components/merchant/MerchantHeader";
import { ProductForm } from "@/components/merchant/ProductForm";
import { ProductList } from "@/components/merchant/ProductList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { POPUP_LANE_CONFIG } from "@/lib/constants";
import { Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate(POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE);
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate(POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE);
      } else {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: merchant, isLoading, refetch } = useQuery({
    queryKey: ["merchant", userId],
    queryFn: async () => {
      if (!userId) return null;

      // First try to find by user_id
      const { data: merchantByUserId, error: userIdError } = await supabase
        .from("merchants")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (userIdError) throw userIdError;
      if (merchantByUserId) return merchantByUserId;

      // If not found by user_id, try to find by email and link it
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return null;

      const { data: merchantByEmail, error: emailError } = await supabase
        .from("merchants")
        .select("*")
        .eq("email", user.email)
        .eq("application_status", "Approved")
        .maybeSingle();

      if (emailError) throw emailError;
      if (!merchantByEmail) return null;

      // If merchant found by email but not linked, link it now
      if (!merchantByEmail.user_id) {
        const { error: updateError } = await supabase
          .from("merchants")
          .update({ user_id: userId })
          .eq("id", merchantByEmail.id);

        if (updateError) {
          console.error("Failed to link merchant account:", updateError);
          throw updateError;
        }

        // Wait a moment for the update to propagate
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch the updated merchant record
        const { data: linkedMerchant, error: linkedError } = await supabase
          .from("merchants")
          .select("*")
          .eq("id", merchantByEmail.id)
          .single();

        if (linkedError) throw linkedError;
        return linkedMerchant;
      }

      return merchantByEmail;
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["merchant-products", merchant?.id],
    queryFn: async () => {
      if (!merchant?.id) return [];

      const { data, error } = await supabase
        .from("merchant_products")
        .select("*")
        .eq("merchant_id", merchant.id);

      if (error) throw error;
      return data;
    },
    enabled: !!merchant?.id,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl">No merchant account found</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-xl font-serif font-bold hover:opacity-80"
            >
              PopUp Lane
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              / Merchant Portal
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <MerchantHeader
          brandName={merchant.brand_name}
          email={merchant.email}
          productCount={products.length}
        />

        <Separator />

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Add Product to Your Lane</h2>
            <p className="text-muted-foreground">
              Add products that will be featured during the PopUp Lane event
            </p>
          </div>

          <div className="max-w-2xl">
            <ProductForm
              merchantId={merchant.id}
              onSuccess={() => {
                // Products will auto-refresh via query invalidation
              }}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Products</h2>
            <p className="text-muted-foreground">
              Manage the products in your lane
            </p>
          </div>

          <ProductList merchantId={merchant.id} />
        </section>
      </main>
    </div>
  );
}
