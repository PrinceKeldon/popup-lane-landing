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
          *,
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
                <div className="bg-card border-2 border-transparent rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:border-wine/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col min-h-[420px]">
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
                  <div className="p-6 space-y-2 flex-1 flex flex-col bg-white">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      BY {merchant.brand_name}
                    </p>

                    {firstProduct && (
                      <>
                        <h4
                          className="text-base font-bold leading-tight text-foreground cursor-pointer hover:text-wine transition-colors"
                          onClick={() => onMerchantClick(merchant.id)}
                        >
                          {firstProduct.product_name}
                        </h4>

                        {firstProduct.discount_percentage && firstProduct.original_price ? (
                          <div className="flex items-baseline gap-2 text-sm pt-1">
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
                          <div className="flex items-baseline gap-2 text-sm pt-1">
                            <span className="font-semibold text-muted-foreground">Starting at</span>
                            <span className="text-lg font-bold">
                              ${parseFloat(String(firstProduct.price)).toFixed(2)}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}

                    {merchant.category && (
                      <Badge variant="secondary" className="text-xs w-fit">
                        {merchant.category}
                      </Badge>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 mt-auto">
                      <Button
                        size="sm"
                        className="flex-1 bg-foreground hover:bg-foreground/90 text-background"
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
                            ? "bg-foreground hover:bg-foreground/90 text-background"
                            : "hover:bg-muted"
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
