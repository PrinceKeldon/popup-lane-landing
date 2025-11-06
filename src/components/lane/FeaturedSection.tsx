import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";
import ProductImageCarousel from "./ProductImageCarousel";
import { getProductImages } from "@/lib/image-utils";

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
        .eq("tier", "featured")
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
            // Priority: 1) Featured product, 2) First product with images, 3) Any first product
            const firstProduct = merchant.merchant_products?.find(p => p.is_featured) ||
              merchant.merchant_products?.find(p => {
                const imgs = getProductImages(p);
                return imgs.length > 0;
              }) || merchant.merchant_products?.[0];
            const isSaved = savedMerchantIds.includes(merchant.id);
            const images = firstProduct ? getProductImages(firstProduct) : [];

            return (
              <div
                key={merchant.id}
                className="group flex-none w-[340px] snap-start"
              >
                <div className="bg-card border-2 border-transparent rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:border-wine/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[420px]">
                  {/* Image Carousel */}
                  <div onClick={() => onMerchantClick(merchant.id)} className="flex-shrink-0">
                    <ProductImageCarousel
                      images={images}
                      brandName={merchant.brand_name}
                      discountBadge={
                        firstProduct?.discount_percentage && (
                          <div className="absolute top-3 left-3 bg-white text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                            {firstProduct.discount_percentage}% OFF
                          </div>
                        )
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-3 pt-1 space-y-1 flex-1 flex flex-col justify-end relative z-10 rounded-none bg-[#000900]/0">
                    {firstProduct && (
                      <Badge className="bg-[#f5f8f9] text-sm font-medium text-black px-3 w-fit my-0 py-[3px] hover:bg-[#f5f8f9]">
                        {firstProduct.product_name}
                      </Badge>
                    )}

                    <div className="rounded bg-[#fbfcfb]/90 px-[6px] mx-0 py-[3px] my-[19px]">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        BY {merchant.brand_name}
                      </p>
                {merchant.category && (
                  <Badge variant="secondary" className="text-xs w-fit border-0 px-2 py-0.5 bg-white text-wine">
                    {merchant.category}
                  </Badge>
                )}
                    </div>

                    {firstProduct && (
                      <>
                        {firstProduct.discount_percentage && firstProduct.original_price ? (
                          <div className="flex items-baseline gap-2 text-sm bg-[#fbfcfb]/90 rounded px-2 py-1 w-fit">
                            <span className="text-lg font-bold">
                              ${(parseFloat(String(firstProduct.original_price)) * (1 - firstProduct.discount_percentage / 100)).toFixed(2)}
                            </span>
                            <span className="line-through text-muted-foreground text-sm">
                              ${parseFloat(String(firstProduct.original_price)).toFixed(2)}
                            </span>
                            <span className="text-red-600 font-bold text-sm">
                              {firstProduct.discount_percentage}% Off
                            </span>
                          </div>
                        ) : firstProduct.price ? (
                          <div className="flex items-baseline gap-2 text-sm bg-[#fbfcfb]/90 rounded px-2 py-1 w-fit">
                            <span className="font-semibold text-muted-foreground">Starting at</span>
                            <span className="text-lg font-bold">
                              ${parseFloat(String(firstProduct.price)).toFixed(2)}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-foreground hover:bg-foreground/90 text-background transition-all duration-300"
                        onClick={() => onMerchantClick(merchant.id)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
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
                            ? "bg-foreground hover:bg-foreground/90 text-background transition-all duration-300"
                            : "hover:bg-muted transition-all duration-300"
                        }
                      >
                        <Heart
                          className={`h-3 w-3 transition-all duration-300 ${isSaved ? "fill-current" : ""}`}
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
