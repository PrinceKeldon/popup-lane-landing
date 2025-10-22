import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";

interface FeaturedSectionProps {
  onMerchantClick: (id: string) => void;
  onSaveMerchant: (id: string) => void;
  savedMerchantIds: string[];
}

export default function FeaturedSection({
  onMerchantClick,
  onSaveMerchant,
  savedMerchantIds,
}: FeaturedSectionProps) {
  const { data: merchants } = useQuery({
    queryKey: ["featured-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select(`
          *,
          merchant_products (*)
        `)
        .eq("application_status", "Approved")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  if (!merchants || merchants.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container px-4">
        <h3 className="text-2xl font-bold mb-6">Featured Brands</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {merchants.map((merchant) => {
            const firstProduct = merchant.merchant_products?.[0];
            const isSaved = savedMerchantIds.includes(merchant.id);

            return (
              <div
                key={merchant.id}
                className="group flex-none w-[340px] snap-start"
              >
                <div className="bg-card border-2 border-transparent rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:border-wine/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  {/* Image/Logo Area */}
                  <div
                    className="relative h-48 bg-gradient-to-br from-wine/5 via-wine/10 to-wine/5 flex items-center justify-center"
                    onClick={() => onMerchantClick(merchant.id)}
                  >
                    {firstProduct?.price && (
                      <div className="absolute top-3 left-3 bg-[hsl(var(--urgent-red))] text-white px-3 py-2 rounded-lg font-bold text-sm shadow-lg z-10 animate-pulse">
                        FROM ${parseFloat(String(firstProduct.price)).toFixed(0)}
                      </div>
                    )}
                    <div className="w-24 h-24 rounded-full bg-wine/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-4xl font-bold text-wine">
                        {merchant.brand_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => onMerchantClick(merchant.id)}
                    >
                      <h4 className="font-semibold text-lg mb-1">
                        {merchant.brand_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {merchant.category || "Discover unique products"}
                      </p>
                    </div>

                    {merchant.category && (
                      <Badge variant="secondary" className="text-xs">
                        {merchant.category}
                      </Badge>
                    )}

                    {firstProduct && (
                      <div className="bg-wine/5 rounded-lg px-3 py-2 text-xs font-semibold text-wine">
                        {firstProduct.product_name} • Limited time offer
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                        onClick={() => onMerchantClick(merchant.id)}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View Brand
                      </Button>
                      <Button
                        size="sm"
                        variant={isSaved ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveMerchant(merchant.id);
                        }}
                        className={
                          isSaved
                            ? "bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                            : ""
                        }
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
