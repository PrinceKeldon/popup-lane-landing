import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useLaneState } from "@/hooks/use-lane-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Deal {
  id: number;
  title: string;
  tagline: string;
  discount: string;
  category: string;
  image: string;
  link: string;
}

export const DiscoveryGrid = () => {
  const { state } = useLaneState();
  const isOpen = state === "open";
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sample deals data
  const deals: Deal[] = [
    {
      id: 1,
      title: "Artisan Coffee Co.",
      tagline: "Small-batch roasted beans",
      discount: "25% OFF",
      category: "Food & Drink",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      id: 2,
      title: "Handmade Ceramics",
      tagline: "Unique pottery pieces",
      discount: "30% OFF",
      category: "Home & Living",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      id: 3,
      title: "Indie Apparel",
      tagline: "Sustainable fashion",
      discount: "20% OFF",
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      id: 4,
      title: "Local Candle Makers",
      tagline: "Hand-poured soy candles",
      discount: "15% OFF",
      category: "Home & Living",
      image: "https://images.unsplash.com/photo-1602874801007-62c2b1a6e30c?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      id: 5,
      title: "Vintage Vinyl Shop",
      tagline: "Curated record collection",
      discount: "40% OFF",
      category: "Music",
      image: "https://images.unsplash.com/photo-1514511819353-a8f16c1e4b66?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      id: 6,
      title: "Botanical Beauty",
      tagline: "Natural skincare",
      discount: "35% OFF",
      category: "Beauty",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop",
      link: "#",
    },
  ];

  const categories = ["all", "Food & Drink", "Home & Living", "Fashion", "Music", "Beauty"];

  const filteredDeals = category === "all" 
    ? deals 
    : deals.filter(deal => deal.category === category);

  return (
    <section className="py-20 bg-muted/20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Step Into the Lane — Discover <span className="text-gradient">What's Really Popping</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isOpen 
              ? "Every brand here earned its place in the lane. Browse live deals from indie creators."
              : "Every brand here earned its place in the lane. When we close, they move into the Backroom — where discovery never ends."}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="discount">Best Discount</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-card rounded-xl overflow-hidden shadow-lg hover-lift border border-border group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold">
                  {deal.discount}
                </Badge>
                {!isOpen && (
                  <Badge className="absolute top-4 left-4 bg-muted text-muted-foreground text-xs">
                    Past Season
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">{deal.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                <p className="text-muted-foreground mb-4">{deal.tagline}</p>
                <Button className="w-full group/btn">
                  Shop Now
                  <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
