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
          id,
          brand_name,
          website_url,
          social_media,
          category,
          application_status,
          tier,
          click_count,
          created_at,
          updated_at,
          spots_claimed,
          merchant_products (*)
        `)
        .eq("application_status", "Approved")
        .or("tier.eq.trending,click_count.gt.0")
        .order("click_count", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (!merchants || merchants.length === 0) return null;

  return (
    <section className="py-8 mb-12">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">🔥 Trending Now</h3>
          <p className="text-sm text-muted-foreground">
            What shoppers are saving most
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
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
                className="cursor-pointer group"
                onClick={() => onMerchantClick(merchant.id)}
              >
                <div className="bg-card rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[380px]">
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
                  <div className="px-4 pb-3 pt-1 space-y-1 flex-1 flex flex-col justify-end relative z-10 rounded-none bg-[#000900]/0">
                    <div className="rounded bg-[#fbfcfb]/90 px-[6px] py-[3px] w-fit space-y-1">
                    {firstProduct && (
                      <Badge className="bg-[#f5f8f9] text-sm font-medium text-black w-fit hover:bg-[#f5f8f9]">
                        {firstProduct.product_name}
                      </Badge>
                    )}
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        BY {merchant.brand_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
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
