import { MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CommunityFeed = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-2 border-dashed border-muted">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Community Feed Coming Soon</CardTitle>
          <CardDescription className="text-base">
            This space will soon be filled with discussions, stories, and connections 
            from our amazing community of creators and shoppers.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MessageSquare className="w-5 h-5" />
            <p className="text-sm">
              Future features: Discussion threads, brand stories, shopper reviews, and more
            </p>
          </div>
          <p className="text-sm text-muted-foreground italic">
            In the meantime, check out the Merchant Notice Board and share your feedback!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
