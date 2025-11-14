import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Heart, Share2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getProductImagesFromMultiple } from "@/lib/image-utils";

interface MerchantSpotlightProps {
  merchantId: string;
  onClose: () => void;
  onSave: (merchantId: string) => void;
  isSaved: boolean;
  mode?: 'active' | 'backroom';
}

export default function MerchantSpotlight({
  merchantId,
  onClose,
  onSave,
  isSaved,
  mode = 'active',
}: MerchantSpotlightProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: merchant, isLoading } = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_merchants")
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
        .eq("id", merchantId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const products = merchant?.merchant_products || [];
  const carouselImages = getProductImagesFromMultiple(products);

  const handleNext = () => {
    if (carouselImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }
  };

  const handlePrev = () => {
    if (carouselImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {isLoading || !merchant ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-wine" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image Carousel */}
            <div>
              <div className="relative rounded-xl overflow-hidden bg-muted">
                {carouselImages.length > 0 ? (
                  <>
                    <img
                      src={carouselImages[currentImageIndex]}
                      alt={merchant.brand_name}
                      className="w-full h-96 object-cover"
                    />
                    {carouselImages.length > 1 && (
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={handlePrev}
                          className="rounded-full"
                        >
                          ←
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={handleNext}
                          className="rounded-full"
                        >
                          →
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-muted">
                    <span className="text-6xl font-bold text-muted-foreground">
                      {merchant.brand_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {carouselImages.length > 0 ? `${currentImageIndex + 1} / ${carouselImages.length}` : "No images"}
              </p>
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl">{merchant.brand_name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{merchant.category}</p>
              </DialogHeader>

              {products.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Products & Offers:</h4>
                  {mode === 'backroom' && (
                    <p className="text-sm text-muted-foreground italic">
                      💡 Check back during our next pop-up for exclusive offers
                    </p>
                  )}
                  {products.map((product: any) => (
                    <div key={product.id} className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold">{product.product_name}</h5>
                        {mode === 'active' && product.discount_percentage && (
                          <Badge className="bg-red-500 text-white">
                            {product.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.product_description}
                      </p>
                      {mode === 'active' && product.offer_text && (
                        <p className="text-sm font-semibold text-wine">
                          {product.offer_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-wine hover:bg-wine-light"
                  onClick={() => window.open(merchant.website_url || "#", "_blank")}
                >
                  <Store className="h-4 w-4 mr-2" />
                  {mode === 'active' ? 'Visit Store' : 'Visit Website'}
                </Button>
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={() => onSave(merchantId)}
                  className={isSaved ? "bg-wine hover:bg-wine-light" : ""}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
