import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";

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

  const firstProduct = merchant.merchant_products?.[0];

  return (
    <div className="group relative bg-card border rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-2">
      {/* Product Image or Logo Placeholder */}
      <div
        className="relative h-40 bg-gradient-to-br from-wine/5 via-wine/10 to-wine/5 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        {firstProduct?.image_url ? (
          <img 
            src={firstProduct.image_url} 
            alt={firstProduct.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-wine/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-3xl font-bold text-wine">
              {merchant.brand_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {firstProduct?.discount_percentage ? (
          <div className="absolute top-2 left-2 bg-[hsl(var(--urgent-red))] text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-lg z-10 animate-pulse-badge">
            {firstProduct.discount_percentage}% OFF
          </div>
        ) : firstProduct?.price && (
          <div className="absolute top-2 left-2 bg-[hsl(var(--wine))] text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-lg z-10">
            ${parseFloat(String(firstProduct.price)).toFixed(0)}
          </div>
        )}
        {firstProduct?.offer_text && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold text-center">
            {firstProduct.offer_text}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
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
        <div className="flex gap-2 pt-2">
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
