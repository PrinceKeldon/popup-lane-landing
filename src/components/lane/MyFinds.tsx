import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface MyFindsProps {
  savedMerchantIds: string[];
  onClear: () => void;
  onMerchantClick: (merchantId: string) => void;
}

export default function MyFinds({
  savedMerchantIds,
  onClear,
  onMerchantClick,
}: MyFindsProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const { data: savedMerchants } = useQuery({
    queryKey: ["saved-merchants", savedMerchantIds],
    queryFn: async () => {
      if (savedMerchantIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("public_merchants")
        .select("id, brand_name, website_url, social_media, category, application_status, tier, click_count, created_at, updated_at, spots_claimed")
        .in("id", savedMerchantIds);

      if (error) throw error;
      return data;
    },
    enabled: savedMerchantIds.length > 0,
  });

  const handleEmailFinds = async () => {
    const email = prompt("Enter your email to receive your saved brands:");
    if (!email) return;

    setIsSending(true);
    try {
      const brands = savedMerchants || [];
      const { error } = await supabase.functions.invoke("send-my-finds", {
        body: { email, brands },
      });

      if (error) throw error;

      toast({
        title: "Email sent!",
        description: `Your saved brands have been emailed to ${email}`,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      // Fallback to mailto if edge function fails
      const merchantList = savedMerchants
        ?.map((m) => `${m.brand_name} - ${m.website_url || "No website"}`)
        .join("\n");

      const subject = encodeURIComponent("My PopUp Lane Finds");
      const body = encodeURIComponent(
        `Here are my favorite brands from The Lane:\n\n${merchantList}`
      );

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      
      toast({
        title: "Opening email client",
        description: "Email service unavailable, using your default email app",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!savedMerchants || savedMerchants.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-slide-in-right">
      <div className="bg-card border rounded-lg shadow-lg overflow-hidden">
        <div className="bg-wine text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-current" />
            <h3 className="font-semibold">My Finds</h3>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {savedMerchants.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-white hover:bg-white/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {savedMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
              onClick={() => onMerchantClick(merchant.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-wine/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-wine">
                    {merchant.brand_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{merchant.brand_name}</p>
                  {merchant.category && (
                    <p className="text-xs text-muted-foreground">{merchant.category}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <Button
            onClick={handleEmailFinds}
            className="w-full bg-wine hover:bg-wine-light text-white"
            disabled={isSending}
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : "Email My Finds"}
          </Button>
        </div>
      </div>
    </div>
  );
}
