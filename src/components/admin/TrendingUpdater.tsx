import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TrendingUpdater() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTrending = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-trending-merchants');
      
      if (error) throw error;

      toast({
        title: "Trending merchants updated",
        description: `${data.trending_count} merchants marked as trending based on AI analysis`,
      });
    } catch (error: any) {
      console.error('Error updating trending:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update trending merchants",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Trending Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            AI automatically analyzes merchant engagement to determine trending status
          </p>
        </div>
        <Button 
          onClick={handleUpdateTrending}
          disabled={isUpdating}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Analyzing...' : 'Update Now'}
        </Button>
      </div>
    </Card>
  );
}
