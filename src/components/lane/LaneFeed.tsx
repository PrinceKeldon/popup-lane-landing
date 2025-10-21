import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import MerchantTile from "./MerchantTile";

interface LaneFeedProps {
  isOpen: boolean;
  onMerchantClick: (merchantId: string) => void;
  onSaveMerchant: (merchantId: string) => void;
  savedMerchantIds: string[];
}

const CATEGORIES = [
  "All",
  "Emerging",
  "Founder-Led",
  "Sustainable",
  "Artisan",
  "Tech",
  "Wellness",
];

export default function LaneFeed({
  isOpen,
  onMerchantClick,
  onSaveMerchant,
  savedMerchantIds,
}: LaneFeedProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: merchants, isLoading } = useQuery({
    queryKey: ["approved-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select(`
          *,
          merchant_products (*)
        `)
        .eq("application_status", "Approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredMerchants =
    activeFilter === "All"
      ? merchants
      : merchants?.filter((m) => m.category === activeFilter);

  if (!isOpen) {
    return (
      <section id="lane-feed" className="py-20 bg-muted/30">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">The Lane is Closed</h2>
          <p className="text-muted-foreground">
            Check back during our next pop-up season to discover amazing brands.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="lane-feed" className="py-12 border-t">
      <div className="container px-4 space-y-8">
        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className={
                activeFilter === category
                  ? "bg-wine hover:bg-wine-light text-white shrink-0"
                  : "shrink-0"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Merchant Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-wine" />
          </div>
        ) : filteredMerchants && filteredMerchants.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredMerchants.length} brand{filteredMerchants.length !== 1 ? "s" : ""} in The Lane
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-wine"></span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.floor(Math.random() * 50 + 120)} shoppers browsing
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMerchants.map((merchant) => (
                <MerchantTile
                  key={merchant.id}
                  merchant={merchant}
                  onClick={() => onMerchantClick(merchant.id)}
                  onSave={() => onSaveMerchant(merchant.id)}
                  isSaved={savedMerchantIds.includes(merchant.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No brands found in this category. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
