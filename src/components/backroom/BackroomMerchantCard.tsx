import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import { useState } from "react";

interface BackroomMerchantCardProps {
  merchant: {
    id: string;
    brand_name: string;
    category: string | null;
    website_url: string | null;
    social_media: string | null;
    season_joined?: string | null;
  };
  onSave: () => void;
  isSaved: boolean;
  onClick: () => void;
}

export const BackroomMerchantCard = ({
  merchant,
  onSave,
  isSaved,
  onClick,
}: BackroomMerchantCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-border/50 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {merchant.brand_name}
              </h3>
              {merchant.category && (
                <Badge variant="secondary" className="text-xs">
                  {merchant.category}
                </Badge>
              )}
            </div>
            
            {merchant.season_joined && (
              <p className="text-xs text-muted-foreground">
                Joined: {merchant.season_joined}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={isSaved ? "text-primary" : "text-muted-foreground"}
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex gap-2 pt-2">
          {merchant.website_url && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(merchant.website_url!, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Store
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
