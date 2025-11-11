import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoticeList } from "./NoticeList";
import { NoticeSubmissionForm } from "./NoticeSubmissionForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const MerchantNoticeBoard = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmitSuccess = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Merchant Notice Board</h2>
          <p className="text-muted-foreground mt-1">
            Share updates, offers, and opportunities with the community
          </p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Post Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post a Notice</DialogTitle>
            </DialogHeader>
            <NoticeSubmissionForm onSuccess={handleSubmitSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="public" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="public">🌍 Public Notices</TabsTrigger>
          <TabsTrigger value="merchant">🛍️ Merchant Hub</TabsTrigger>
        </TabsList>
        
        <TabsContent value="public" className="mt-6">
          <NoticeList visibility="Public" refreshTrigger={refreshTrigger} />
        </TabsContent>
        
        <TabsContent value="merchant" className="mt-6">
          <NoticeList visibility="Merchant-only" refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
