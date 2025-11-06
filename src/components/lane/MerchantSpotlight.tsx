import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, Heart, Globe, Instagram, Facebook } from "lucide-react";
import { Loader2 } from "lucide-react";
import ProductImageCarousel from "./ProductImageCarousel";
import { getProductImages } from "@/lib/image-utils";

interface MerchantSpotlightProps {
  merchantId: string;
  onClose: () => void;
  onSave: (merchantId: string) => void;
  isSaved: boolean;
}

export default function MerchantSpotlight({
  merchantId,
  onClose,
  onSave,
  isSaved,
}: MerchantSpotlightProps) {
  const { data: merchant, isLoading } = useQuery({
    queryKey: ["merchant", merchantId],
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
          airtable_record_id,
          merchant_products (*)
        `)
        .eq("id", merchantId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !merchant) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--wine))]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="relative h-64 bg-gradient-to-br from-wine/10 via-wine/20 to-wine/10 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 bg-background/80 hover:bg-background"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="w-32 h-32 rounded-full bg-wine/20 flex items-center justify-center">
              <span className="text-6xl font-bold text-wine">
                {merchant.brand_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{merchant.brand_name}</h2>
                {merchant.category && (
                  <Badge variant="secondary">{merchant.category}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                {merchant.website_url && (
                  <Button
                    onClick={() => window.open(merchant.website_url, "_blank")}
                    className="bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Store
                  </Button>
                )}
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={() => onSave(merchantId)}
                  className={
                    isSaved
                      ? "bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                      : ""
                  }
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            {merchant.social_media && (
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Facebook className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Products */}
            {merchant.merchant_products && merchant.merchant_products.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {merchant.merchant_products.map((product: any) => {
                    const images = getProductImages(product);
                    return (
                      <div
                        key={product.id}
                        className="border rounded-lg overflow-hidden space-y-2 hover:shadow-md transition-shadow"
                      >
                        <ProductImageCarousel
                          images={images}
                          brandName={merchant.brand_name}
                        />
                      <div className="p-4 space-y-2">
                        <h4 className="font-semibold">{product.product_name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.product_description}
                        </p>
                        {product.price && (
                          <p className="text-lg font-bold text-[hsl(var(--wine))]">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                        )}
                        {product.website_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(product.website_url, "_blank")}
                          >
                            <Globe className="h-3 w-3 mr-2" />
                            View Product
                          </Button>
                        )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
