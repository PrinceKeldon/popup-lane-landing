import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import LaneHero from "@/components/lane/LaneHero";
import LaneFeed from "@/components/lane/LaneFeed";
import MerchantSpotlight from "@/components/lane/MerchantSpotlight";
import MyFinds from "@/components/lane/MyFinds";
import { Footer } from "@/components/Footer";
import { useLaneState } from "@/hooks/use-lane-state";
import { supabase } from "@/integrations/supabase/client";

export default function TheLane() {
  const { state: laneStatus, nextEventDate } = useLaneState();
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [savedMerchantIds, setSavedMerchantIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedMerchants");
    return saved ? JSON.parse(saved) : [];
  });

  const handleMerchantClick = async (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    
    // Track click count
    try {
      const { data: merchant } = await supabase
        .from("merchants")
        .select("click_count")
        .eq("id", merchantId)
        .single();

      if (merchant) {
        await supabase
          .from("merchants")
          .update({ click_count: (merchant.click_count || 0) + 1 })
          .eq("id", merchantId);
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const handleSaveMerchant = (merchantId: string) => {
    setSavedMerchantIds((prev) => {
      const updated = prev.includes(merchantId)
        ? prev.filter((id) => id !== merchantId)
        : [...prev, merchantId];
      localStorage.setItem("savedMerchants", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearFinds = () => {
    setSavedMerchantIds([]);
    localStorage.removeItem("savedMerchants");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <LaneHero 
          isOpen={laneStatus === "open"} 
          nextEventDate={nextEventDate}
        />
        
        <LaneFeed
          isOpen={laneStatus === "open"}
          onMerchantClick={handleMerchantClick}
          onSaveMerchant={handleSaveMerchant}
          savedMerchantIds={savedMerchantIds}
        />
      </main>

      <Footer />

      {selectedMerchantId && (
        <MerchantSpotlight
          merchantId={selectedMerchantId}
          onClose={() => setSelectedMerchantId(null)}
          onSave={handleSaveMerchant}
          isSaved={savedMerchantIds.includes(selectedMerchantId)}
        />
      )}

      {savedMerchantIds.length > 0 && (
        <MyFinds
          savedMerchantIds={savedMerchantIds}
          onClear={handleClearFinds}
          onMerchantClick={handleMerchantClick}
        />
      )}
    </div>
  );
}
