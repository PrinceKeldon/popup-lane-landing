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
import { BackroomHero } from "@/components/backroom/BackroomHero";
import { BackroomDirectory } from "@/components/backroom/BackroomDirectory";
import { BackroomBanner } from "@/components/backroom/BackroomBanner";

export default function TheLane() {
  const { earlyAccessDate, laneStatus } = useLaneSettings();
  const nextEventDate = earlyAccessDate.toISOString();
  const isOpen = laneStatus === "open";
  
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

  // Dynamic SEO metadata based on lane status
  const seoTitle = isOpen
    ? "Walk The Lane | Shop Small Brands | PopUp Lane"
    : "The Backroom | Merchant Directory | PopUp Lane";
  
  const seoDescription = isOpen
    ? "Browse curated small brands with exclusive Black Friday offers. Limited-time pop-up shop featuring indie makers and creators."
    : "Discover small brands year-round in our permanent directory. Browse indie makers and creators even when The Lane is closed.";
  
  const structuredData = isOpen ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "PopUp Lane Black Friday '25",
    "description": "Shop curated small brands with exclusive Black Friday offers",
    "startDate": earlyAccessDate.toISOString(),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": `${window.location.origin}/lane`
    }
  } : {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "The Backroom — PopUp Lane Merchant Directory",
    "description": "Year-round directory of small brands",
    "url": `${window.location.origin}/lane`
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`${window.location.origin}/lane`}
        structuredData={structuredData}
      />
      <Navigation />
      
      <main>
        {isOpen ? (
          <>
            <LaneHero 
              isOpen={true} 
              nextEventDate={nextEventDate}
            />
            
            <LaneFeed
              isOpen={true}
              onMerchantClick={handleMerchantClick}
              onSaveMerchant={handleSaveMerchant}
              savedMerchantIds={savedMerchantIds}
            />
          </>
        ) : (
          <>
            <BackroomHero 
              nextSeasonDate={earlyAccessDate}
              merchantCount={0}
            />
            
            <BackroomDirectory
              onMerchantClick={handleMerchantClick}
              onSaveMerchant={handleSaveMerchant}
              savedMerchantIds={savedMerchantIds}
            />
            
            <BackroomBanner />
          </>
        )}
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
