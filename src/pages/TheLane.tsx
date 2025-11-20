import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import LaneHero from "@/components/lane/LaneHero";
import LaneFeed from "@/components/lane/LaneFeed";
import MerchantSpotlight from "@/components/lane/MerchantSpotlight";
import MyFinds from "@/components/lane/MyFinds";
import { Footer } from "@/components/Footer";
import { useLaneSettings } from "@/hooks/useLaneSettings";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";

export default function TheLane() {
  const { earlyAccessDate, laneCloseDate, laneStatus, isLoading } = useLaneSettings();
  const isOpen = laneStatus === "open";
  
  // Show loading state
  if (isLoading || !earlyAccessDate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-64 mx-auto" />
          <div className="h-6 bg-muted rounded w-96 mx-auto" />
        </div>
      </div>
    );
  }
  
  const targetDate = isOpen ? laneCloseDate : earlyAccessDate;
  const nextEventDate = targetDate ? targetDate.toISOString() : null;
  
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "PopUp Lane Black Friday '25",
    "description": "Shop curated small brands with exclusive Black Friday offers",
    "startDate": earlyAccessDate?.toISOString() || new Date().toISOString(),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": `${window.location.origin}/lane`
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Walk The Lane | Shop Small Brands | PopUp Lane"
        description="Browse curated small brands with exclusive Black Friday offers. Limited-time pop-up shop featuring indie makers and creators."
        canonical={`${window.location.origin}/lane`}
        structuredData={structuredData}
      />
      <Navigation />
      
      <main>
        {nextEventDate && (
          <LaneHero 
            isOpen={isOpen} 
            nextEventDate={nextEventDate}
          />
        )}
        
        <LaneFeed
          isOpen={isOpen}
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
          mode={isOpen ? "active" : "backroom"}
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
