import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  badge: string;
  badgeColor: "seasonal" | "popular";
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaAction: () => void;
  note?: string;
  highlighted?: boolean;
  loading?: boolean;
}

export const PricingCard = ({
  badge,
  badgeColor,
  title,
  price,
  period,
  description,
  features,
  ctaText,
  ctaAction,
  note,
  highlighted = false,
  loading = false,
}: PricingCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover-lift",
        highlighted && "border-wine shadow-lg"
      )}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wine via-wine-light to-wine" />
      )}
      
      <CardHeader>
        <Badge 
          variant={badgeColor === "popular" ? "default" : "secondary"}
          className={cn(
            "w-fit mb-4",
            badgeColor === "popular" && "bg-wine hover:bg-wine/90 text-primary-foreground"
          )}
        >
          {badge}
        </Badge>
        
        <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
        
        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-4xl md:text-5xl font-bold text-foreground">{price}</span>
          {period && <span className="text-muted-foreground text-lg">{period}</span>}
        </div>
        
        <CardDescription className="text-base mt-4">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-wine mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={ctaAction}
          disabled={loading}
          className={cn(
            "w-full text-base py-6",
            highlighted && "bg-wine hover:bg-wine/90"
          )}
        >
          {loading ? "Loading..." : ctaText}
        </Button>
        
        {note && (
          <p className="text-xs text-muted-foreground text-center">{note}</p>
        )}
      </CardFooter>
    </Card>
  );
};
