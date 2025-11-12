import { Megaphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const MerchantNoticeBoard = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-2 border-dashed border-muted">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Megaphone className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Merchant Notice Board Coming Soon</CardTitle>
          <CardDescription className="text-base">
            This space will soon allow merchants to post updates, special offers, 
            collaboration opportunities, and event announcements to the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Megaphone className="w-5 h-5" />
            <p className="text-sm">
              Future features: Public notices, merchant-only updates, offers, and more
            </p>
          </div>
          <p className="text-sm text-muted-foreground italic">
            In the meantime, share your feedback to help shape PopUp Lane!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
