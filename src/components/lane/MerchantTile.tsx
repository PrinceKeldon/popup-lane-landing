import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";
import ProductImageCarousel from "./ProductImageCarousel";
import { getProductImages } from "@/lib/image-utils";
import { useTrackMerchantAnalytics } from "@/hooks/useTrackMerchantAnalytics";

interface MerchantTileProps {
  merchant: any;
  onClick: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export default function MerchantTile({
  merchant,
  onClick,
  onSave,
  isSaved,
}: MerchantTileProps) {
  const { trackMerchantClick } = useTrackMerchantAnalytics();
  const productCount = merchant.merchant_products?.length || 0;

  const handleClick = () => {
    trackMerchantClick(merchant.id);
    onClick();
  };

  // Priority: 1) Featured product, 2) First product with images, 3) Any first product
  const firstProduct = merchant.merchant_products?.find(p => p.is_featured) ||
    merchant.merchant_products?.find(p => {
      const imgs = getProductImages(p);
      return imgs.length > 0;
    }) || merchant.merchant_products?.[0];

  const images = firstProduct ? getProductImages(firstProduct) : [];

  return (
    <div className="group relative bg-card border rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[380px]">
      {/* Product Image Carousel */}
      <div className="cursor-pointer" onClick={handleClick}>
        <ProductImageCarousel
          images={images}
          brandName={merchant.brand_name}
          discountBadge={
            firstProduct?.discount_percentage ? (
              <div className="absolute top-3 left-3 bg-white text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                {firstProduct.discount_percentage}% OFF
              </div>
            ) : firstProduct?.price ? (
              <div className="absolute top-3 left-3 bg-white text-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                ${parseFloat(String(firstProduct.price)).toFixed(0)}
              </div>
            ) : undefined
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

        <div className="rounded bg-[#fbfcfb]/90 px-[6px] py-[3px] my-[19px] w-fit">
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
          {merchant.website_url && (
            <Button
              size="sm"
              className="flex-1 bg-foreground hover:bg-foreground/90 text-background transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                if (merchant.website_url) {
                  trackMerchantClick(merchant.id);
                  window.open(merchant.website_url, "_blank");
                } else {
                  handleClick();
                }
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              {merchant.website_url ? "Visit Store" : "View"}
            </Button>
          )}
          <Button
            size="sm"
            variant={isSaved ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={
              isSaved
                ? "bg-foreground hover:bg-foreground/90 text-background transition-all duration-300"
                : "hover:bg-muted transition-all duration-300"
            }
          >
            <Heart className={`h-3 w-3 transition-all duration-300 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
