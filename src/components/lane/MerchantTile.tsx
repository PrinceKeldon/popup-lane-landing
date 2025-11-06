import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";
import ProductImageCarousel from "./ProductImageCarousel";
import { getProductImages } from "@/lib/image-utils";

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
  const productCount = merchant.merchant_products?.length || 0;

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
      <div className="cursor-pointer" onClick={onClick}>
        <ProductImageCarousel
          images={images}
          brandName={merchant.brand_name}
          discountBadge={
            firstProduct?.discount_percentage ? (
              <div className="absolute top-2 left-2 bg-[hsl(var(--urgent-red))] text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-lg z-10 animate-pulse-badge">
                {firstProduct.discount_percentage}% OFF
              </div>
            ) : firstProduct?.price ? (
              <div className="absolute top-2 left-2 bg-[hsl(var(--wine))] text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-lg z-10">
                ${parseFloat(String(firstProduct.price)).toFixed(0)}
              </div>
            ) : undefined
          }
          offerText={firstProduct?.offer_text}
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="space-y-1">
          <h3
            className="font-semibold text-lg cursor-pointer hover:text-wine transition-colors"
            onClick={onClick}
          >
            {merchant.brand_name}
          </h3>
          {merchant.category && (
            <Badge variant="secondary" className="text-xs">
              {merchant.category}
            </Badge>
          )}
        </div>

        {firstProduct && (
          <div className="space-y-1">
            <div className="bg-wine/5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-wine">
              {firstProduct.product_name}
            </div>
            {firstProduct.discount_percentage && firstProduct.original_price && (
              <div className="flex items-center gap-2 text-xs">
                <span className="line-through text-muted-foreground">
                  ${parseFloat(String(firstProduct.original_price)).toFixed(2)}
                </span>
                <span className="font-bold text-[hsl(var(--urgent-red))]">
                  ${(parseFloat(String(firstProduct.original_price)) * (1 - firstProduct.discount_percentage / 100)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 mt-auto">
          {merchant.website_url && (
            <Button
              size="sm"
              className="flex-1 bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
              onClick={(e) => {
                e.stopPropagation();
                if (merchant.website_url) {
                  window.open(merchant.website_url, "_blank");
                } else {
                  onClick();
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              {merchant.website_url ? "Visit" : "View"}
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
                ? "bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                : ""
            }
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
