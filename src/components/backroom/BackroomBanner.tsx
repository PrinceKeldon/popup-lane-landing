import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const BackroomBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('backroom-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('backroom-banner-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary/10 backdrop-blur-lg border-t border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">
              Want to join the next pop-up?
            </p>
            <p className="text-xs text-muted-foreground">
              Sign up for early access and be first in line when The Lane opens
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <a href="/">Get Notified</a>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
