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

  return (
    <div className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Logo Placeholder */}
      <div
        className="h-48 bg-gradient-to-br from-wine/5 via-wine/10 to-wine/5 flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <div className="w-20 h-20 rounded-full bg-wine/20 flex items-center justify-center">
          <span className="text-3xl font-bold text-wine">
            {merchant.brand_name.charAt(0).toUpperCase()}
          </span>
        </div>
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

        {productCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {productCount} product{productCount !== 1 ? "s" : ""} available
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {merchant.website_url && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(merchant.website_url, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit Store
            </Button>
          )}
          <Button
            size="sm"
            variant={isSaved ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={isSaved ? "bg-wine hover:bg-wine-light text-white" : ""}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
