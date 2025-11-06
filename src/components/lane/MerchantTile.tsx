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
    <div className="group relative bg-card border rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
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
      <div className="p-6 space-y-2 flex-1 flex flex-col bg-white">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          BY {merchant.brand_name}
        </p>

        {firstProduct && (
          <>
            <h3
              className="text-base font-bold leading-tight text-foreground cursor-pointer hover:text-wine transition-colors"
              onClick={handleClick}
            >
              {firstProduct.product_name}
            </h3>

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
          {merchant.website_url && (
            <Button
              size="sm"
              className="flex-1 bg-foreground hover:bg-foreground/90 text-background"
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
              <ExternalLink className="h-4 w-4 mr-1" />
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
                ? "bg-foreground hover:bg-foreground/90 text-background"
                : "hover:bg-muted"
            }
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
