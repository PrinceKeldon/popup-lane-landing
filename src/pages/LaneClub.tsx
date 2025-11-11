import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeSection } from "@/components/lane-club/WelcomeSection";
import { CommunityFeed } from "@/components/lane-club/CommunityFeed";
import { MerchantNoticeBoard } from "@/components/lane-club/MerchantNoticeBoard";
import { FeedbackSection } from "@/components/lane-club/FeedbackSection";

export default function LaneClub() {
  return (
    <>
      <SEOHead
        title="The Lane Club — PopUp Lane Community for Creators and Shoppers"
        description="Join The Lane Club — where small brands and shoppers meet, share updates, and help shape PopUp Lane's future."
        canonical="https://popuplane.com/lane-club"
      />
      <Navigation />
      <div className="min-h-screen bg-background">
        <WelcomeSection />
        
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="feed">🏠 Community Feed</TabsTrigger>
              <TabsTrigger value="notices">📣 Notice Board</TabsTrigger>
              <TabsTrigger value="feedback">💬 Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              <CommunityFeed />
            </TabsContent>
            
            <TabsContent value="notices">
              <MerchantNoticeBoard />
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
