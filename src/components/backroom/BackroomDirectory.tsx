import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BackroomMerchantCard } from "./BackroomMerchantCard";
import { BackroomFilters } from "./BackroomFilters";
import { Skeleton } from "@/components/ui/skeleton";

interface BackroomDirectoryProps {
  onMerchantClick: (id: string) => void;
  onSaveMerchant: (id: string) => void;
  savedMerchantIds: string[];
}

export const BackroomDirectory = ({
  onMerchantClick,
  onSaveMerchant,
  savedMerchantIds,
}: BackroomDirectoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedSort, setSelectedSort] = useState("alphabetical");

  const { data: merchants = [], isLoading } = useQuery({
    queryKey: ['backroom-merchants', selectedCategory, selectedSeason, selectedSort],
    queryFn: async () => {
      let query = supabase
        .from('merchants')
        .select('*')
        .eq('application_status', 'Approved')
        .or('status.is.null,status.eq.active');

      if (selectedCategory && selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      // Apply sorting
      if (selectedSort === 'alphabetical') {
        query = query.order('brand_name', { ascending: true });
      } else if (selectedSort === 'recent') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Extract unique categories from merchants
  const categories = [...new Set(merchants.map(m => m.category).filter(Boolean))] as string[];
  const seasons: string[] = [];

  const handleMerchantClick = async (merchantId: string) => {
    // Track backroom view
    await supabase.from('merchant_analytics').insert({
      merchant_id: merchantId,
      event_type: 'view',
      metadata: { mode: 'backroom' },
    });

    // Increment backroom stats
    try {
      await supabase.rpc('increment_backroom_stat' as any, {
        p_merchant_id: merchantId,
        p_stat_type: 'views'
      });
    } catch (error) {
      console.error('Error incrementing backroom stats:', error);
    }

    onMerchantClick(merchantId);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Browse Directory</h2>
          <p className="text-muted-foreground">
            {merchants.length} {merchants.length === 1 ? 'brand' : 'brands'} in our community
          </p>
        </div>

        <BackroomFilters
          selectedCategory={selectedCategory}
          selectedSeason={selectedSeason}
          selectedSort={selectedSort}
          onCategoryChange={setSelectedCategory}
          onSeasonChange={setSelectedSeason}
          onSortChange={setSelectedSort}
          categories={categories}
          seasons={seasons}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        ) : merchants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No merchants found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchants.map((merchant) => (
              <BackroomMerchantCard
                key={merchant.id}
                merchant={{
                  ...merchant,
                  season_joined: null
                }}
                onSave={() => onSaveMerchant(merchant.id)}
                isSaved={savedMerchantIds.includes(merchant.id)}
                onClick={() => handleMerchantClick(merchant.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
