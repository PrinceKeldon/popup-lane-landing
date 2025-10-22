import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, ExternalLink, X } from "lucide-react";

// Mock data for preview
const PREVIEW_BRANDS = [
  {
    id: "1",
    name: "Loom & Found",
    tagline: "Handwoven home essentials",
    category: "Sustainable",
    offer: "30% OFF",
    offerDetails: "Selected linens • Free shipping over $80",
    logoInitial: "LF",
  },
  {
    id: "2",
    name: "Bright Studio",
    tagline: "Modern ceramics & gifts",
    category: "Boutique",
    offer: "Buy 2 Get 1",
    offerDetails: "Limited sets • Ends Nov 26",
    logoInitial: "BS",
  },
  {
    id: "3",
    name: "Thread Theory",
    tagline: "Apparel with intent",
    category: "Style",
    offer: "25% OFF",
    offerDetails: "Extra 10% with code LANE10",
    logoInitial: "TT",
  },
  {
    id: "4",
    name: "Olive Branch",
    tagline: "Organic skincare",
    category: "Wellness",
    offer: "40% OFF",
    offerDetails: "Best sellers only",
    logoInitial: "OB",
  },
];

export const LanePreview = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [savedBrands, setSavedBrands] = useState<string[]>([]);

  const toggleSave = (brandId: string) => {
    setSavedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const brand = PREVIEW_BRANDS.find((b) => b.id === selectedBrand);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-wine/10 text-wine text-sm font-semibold uppercase tracking-wider mb-2">
            Preview The Lane
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Sample What's Inside
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a taste of the curated brands, limited-time offers, and discovery experience waiting for you when The Lane opens.
          </p>
        </div>

        {/* Featured Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {PREVIEW_BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="group relative bg-card border rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedBrand(brand.id)}
            >
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-10 bg-[hsl(var(--urgent-red))] text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg animate-pulse">
                {brand.offer}
              </div>

              {/* Logo/Image Area */}
              <div className="h-44 bg-gradient-to-br from-wine/5 via-wine/10 to-wine/5 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-wine/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-bold text-wine">
                    {brand.logoInitial}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-base mb-1">{brand.name}</h4>
                  <p className="text-sm text-muted-foreground">{brand.tagline}</p>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {brand.category}
                </Badge>

                {/* Offer Bar */}
                <div className="bg-wine/5 rounded-lg px-3 py-2 text-xs font-semibold text-wine">
                  {brand.offerDetails}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBrand(brand.id);
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant={savedBrands.includes(brand.id) ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(brand.id);
                    }}
                    className={
                      savedBrands.includes(brand.id)
                        ? "bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                        : ""
                    }
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        savedBrands.includes(brand.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white shadow-[var(--shadow-button)] group"
            onClick={() => (window.location.href = "/lane")}
          >
            Explore The Full Lane
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedBrand && brand && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br from-wine/10 via-wine/20 to-wine/10 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedBrand(null)}
                className="absolute top-4 right-4 bg-background/80 hover:bg-background"
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="w-24 h-24 rounded-full bg-wine/20 flex items-center justify-center">
                <span className="text-5xl font-bold text-wine">
                  {brand.logoInitial}
                </span>
              </div>
              <div className="absolute top-4 left-4 bg-[hsl(var(--urgent-red))] text-white px-4 py-2 rounded-lg font-bold text-base shadow-lg">
                {brand.offer}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">{brand.name}</h3>
                <p className="text-muted-foreground">{brand.tagline}</p>
                <Badge variant="secondary" className="mt-2">
                  {brand.category}
                </Badge>
              </div>

              <div className="bg-wine/5 rounded-xl p-4 space-y-2">
                <div className="font-bold text-wine text-lg">
                  Special Offer: {brand.offer}
                </div>
                <p className="text-sm text-muted-foreground">
                  {brand.offerDetails}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                  onClick={() => (window.location.href = "/lane")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit in The Lane
                </Button>
                <Button
                  variant={savedBrands.includes(brand.id) ? "default" : "outline"}
                  onClick={() => toggleSave(brand.id)}
                  className={
                    savedBrands.includes(brand.id)
                      ? "bg-[hsl(var(--wine))] hover:bg-[hsl(var(--wine-light))] text-white"
                      : ""
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${
                      savedBrands.includes(brand.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This is a preview. Visit The Lane when it's open to shop these exclusive deals.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
