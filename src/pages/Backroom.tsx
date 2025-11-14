import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackroomHero } from "@/components/backroom/BackroomHero";
import { BackroomDirectory } from "@/components/backroom/BackroomDirectory";
import { BackroomBanner } from "@/components/backroom/BackroomBanner";
import MerchantSpotlight from "@/components/lane/MerchantSpotlight";
import MyFinds from "@/components/lane/MyFinds";
import { useLaneSettings } from "@/hooks/useLaneSettings";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";

export default function Backroom() {
  const { earlyAccessDate } = useLaneSettings();
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [savedMerchantIds, setSavedMerchantIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedMerchants");
    return saved ? JSON.parse(saved) : [];
  });
  const [merchantCount, setMerchantCount] = useState(0);

  useEffect(() => {
    const fetchMerchantCount = async () => {
      try {
        const { data, error } = await (supabase
          .from("merchants")
          .select("id")
          .eq("application_status", "Approved")
          .eq("backroom_status", "active") as any);
        
        if (!error && data) {
          setMerchantCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching merchant count:", error);
      }
    };
    fetchMerchantCount();
  }, []);

  const handleMerchantClick = async (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "The Backroom — PopUp Lane Merchant Directory",
    "description": "Year-round directory of small brands and indie makers",
    "url": `${window.location.origin}/backroom`
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="The Backroom | Merchant Directory | PopUp Lane"
        description="Discover small brands year-round in our permanent directory. Browse indie makers and creators even when The Lane is closed."
        canonical={`${window.location.origin}/backroom`}
        structuredData={structuredData}
      />
      <Navigation />
      
      <main>
        <BackroomHero 
          nextSeasonDate={earlyAccessDate}
          merchantCount={merchantCount}
        />
        
        <BackroomDirectory
          onMerchantClick={handleMerchantClick}
          onSaveMerchant={handleSaveMerchant}
          savedMerchantIds={savedMerchantIds}
        />
        
        <BackroomBanner />
      </main>

      <Footer />

      {selectedMerchantId && (
        <MerchantSpotlight
          merchantId={selectedMerchantId}
          onClose={() => setSelectedMerchantId(null)}
          onSave={handleSaveMerchant}
          isSaved={savedMerchantIds.includes(selectedMerchantId)}
          mode="backroom"
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
