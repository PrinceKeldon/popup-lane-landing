import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TrendingSectionProps {
  onMerchantClick: (id: string) => void;
}

export default function TrendingSection({ onMerchantClick }: TrendingSectionProps) {
  const { data: merchants } = useQuery({
    queryKey: ["trending-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .eq("application_status", "Approved")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (!merchants || merchants.length === 0) return null;

  return (
    <section className="py-6 bg-gradient-to-r from-wine/5 to-wine/10 border-y">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-wine" />
            Trending Now
          </h3>
          <p className="text-sm text-muted-foreground">
            What shoppers are saving most
          </p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              className="flex-none w-[260px] snap-start cursor-pointer group"
              onClick={() => onMerchantClick(merchant.id)}
            >
              <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-hover)] transition-all duration-200 hover:-translate-y-1 space-y-3">
                <div className="h-28 bg-gradient-to-br from-wine/5 to-wine/10 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-wine/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-wine">
                      {merchant.brand_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {merchant.brand_name}
                  </h4>
                  {merchant.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-[hsl(var(--urgent-red))]/10 text-[hsl(var(--urgent-red))]"
                    >
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
