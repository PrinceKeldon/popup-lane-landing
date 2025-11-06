import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import ProductImageCarousel from "./ProductImageCarousel";
import { getProductImages } from "@/lib/image-utils";

interface TrendingSectionProps {
  onMerchantClick: (id: string) => void;
}

export default function TrendingSection({ onMerchantClick }: TrendingSectionProps) {
  const { data: merchants } = useQuery({
    queryKey: ["trending-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select(`
          *,
          merchant_products (*)
        `)
        .eq("application_status", "Approved")
        .or("tier.eq.trending,click_count.gt.0")
        .order("click_count", { ascending: false })
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
          {merchants.map((merchant) => {
            // Priority: 1) Featured product, 2) First product with images, 3) Any first product
            const firstProduct = merchant.merchant_products?.find(p => p.is_featured) ||
              merchant.merchant_products?.find(p => {
                const imgs = getProductImages(p);
                return imgs.length > 0;
              }) || merchant.merchant_products?.[0];
            const images = firstProduct ? getProductImages(firstProduct) : [];
            return (
              <div
                key={merchant.id}
                className="flex-none w-[260px] snap-start cursor-pointer group"
                onClick={() => onMerchantClick(merchant.id)}
              >
                <div className="bg-card rounded-xl overflow-hidden shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-hover)] transition-all duration-200 hover:-translate-y-1 flex flex-col min-h-[320px]">
                  <div className="flex-shrink-0">
                    <ProductImageCarousel
                      images={images}
                      brandName={merchant.brand_name}
                      discountBadge={
                        firstProduct?.discount_percentage && (
                          <div className="absolute top-3 right-3 bg-white text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                            {firstProduct.discount_percentage}% OFF
                          </div>
                        )
                      }
                    />
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col bg-white">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      BY {merchant.brand_name}
                    </p>
                    {firstProduct && (
                      <h4 className="text-sm font-bold leading-tight text-foreground">
                        {firstProduct.product_name}
                      </h4>
                    )}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-red-50 text-red-600"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                      {merchant.click_count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {merchant.click_count} views
                        </span>
                      )}
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
